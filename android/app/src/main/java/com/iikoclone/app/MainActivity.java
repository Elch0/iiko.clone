package com.iikoclone.app;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.bluetooth.BluetoothServerSocket;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.activity.ComponentActivity;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends ComponentActivity {
    private static final int BLUETOOTH_PERMISSION_REQUEST = 100;
    private static final UUID SERIAL_PORT_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    private BluetoothAdapter bluetoothAdapter;
    private final List<String> kitchenReceipts = new ArrayList<>();

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        requestBluetoothPermissions();
        showRoleSelection();
    }

    private void showRoleSelection() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setPadding(48, 48, 48, 48);
        TextView title = new TextView(this);
        title.setText("iiko.clone\nВыберите режим работы");
        title.setTextSize(24);
        title.setTextColor(Color.rgb(32, 35, 42));
        title.setGravity(Gravity.CENTER);
        layout.addView(title, new LinearLayout.LayoutParams(-1, -2));
        addRoleButton(layout, "Касса", "cashier");
        addRoleButton(layout, "Куханный экран", "kitchen");
        setContentView(layout);
    }

    private void addRoleButton(LinearLayout layout, String label, String role) {
        Button button = new Button(this);
        button.setText(label);
        button.setOnClickListener(view -> openRole(role));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-1, -2);
        params.setMargins(0, 24, 0, 0);
        layout.addView(button, params);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void openRole(String role) {
        setContentView(R.layout.activity_main);

        WebView webView = findViewById(R.id.web_view);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");

        webView.loadUrl("file:///android_asset/index.html?role=" + role);
        if ("kitchen".equals(role)) startBluetoothReceiver();
    }

    private void requestBluetoothPermissions() {
        if (android.os.Build.VERSION.SDK_INT >= 31) {
            requestPermissions(new String[]{
                    "android.permission.BLUETOOTH_CONNECT",
                    "android.permission.BLUETOOTH_SCAN"
            }, BLUETOOTH_PERMISSION_REQUEST);
        }
    }

    private class AndroidBridge {
        @JavascriptInterface
        public String getBluetoothStatus() {
            if (bluetoothAdapter == null) return "недоступен";
            if (!bluetoothAdapter.isEnabled()) return "выключен";
            if (android.os.Build.VERSION.SDK_INT >= 31 && checkSelfPermission("android.permission.BLUETOOTH_CONNECT") != PackageManager.PERMISSION_GRANTED) {
                return "нет разрешения";
            }
            int paired = bluetoothAdapter.getBondedDevices().size();
            return paired > 0 ? "включен, сопряжено устройств: " + paired : "включен, устройства не сопряжены";
        }

        @JavascriptInterface
        public String getKitchenReceipts() {
            JSONArray result = new JSONArray();
            synchronized (kitchenReceipts) {
                for (String receipt : kitchenReceipts) {
                    try { result.put(new JSONObject(receipt)); } catch (Exception ignored) { }
                }
            }
            return result.toString();
        }

        @JavascriptInterface
        public void sendReceipt(String receiptJson) {
            new Thread(() -> sendOverBluetooth(receiptJson)).start();
        }
    }

    private void sendOverBluetooth(String receiptJson) {
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled()) return;
        if (android.os.Build.VERSION.SDK_INT >= 31 && checkSelfPermission("android.permission.BLUETOOTH_CONNECT") != PackageManager.PERMISSION_GRANTED) return;
        for (BluetoothDevice device : bluetoothAdapter.getBondedDevices()) {
            try (BluetoothSocket socket = device.createRfcommSocketToServiceRecord(SERIAL_PORT_UUID)) {
                socket.connect();
                socket.getOutputStream().write((receiptJson + "\n").getBytes(StandardCharsets.UTF_8));
                return;
            } catch (IOException ignored) { }
        }
    }

    private void startBluetoothReceiver() {
        new Thread(() -> {
            if (bluetoothAdapter == null || android.os.Build.VERSION.SDK_INT >= 31 && checkSelfPermission("android.permission.BLUETOOTH_CONNECT") != PackageManager.PERMISSION_GRANTED) return;
            try (BluetoothServerSocket server = bluetoothAdapter.listenUsingRfcommWithServiceRecord("iiko.clone", SERIAL_PORT_UUID)) {
                while (!isFinishing()) {
                    try (BluetoothSocket socket = server.accept()) {
                        byte[] buffer = new byte[8192];
                        int length = socket.getInputStream().read(buffer);
                        if (length > 0) {
                            synchronized (kitchenReceipts) {
                                kitchenReceipts.add(new String(buffer, 0, length, StandardCharsets.UTF_8).trim());
                            }
                        }
                    } catch (IOException ignored) { }
                }
            } catch (IOException ignored) { }
        }).start();
    }
}
