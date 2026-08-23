package com.iikoclone.app;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.bluetooth.BluetoothServerSocket;
import android.content.pm.PackageManager;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.content.SharedPreferences;
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
    private final List<String> kitchenHistory = new ArrayList<>();
    private SharedPreferences kitchenStorage;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        kitchenStorage = getSharedPreferences("kitchen_receipts", MODE_PRIVATE);
        loadKitchenReceipts();
        requestBluetoothPermissions();
        showRoleSelection();
    }

    private void showRoleSelection() {
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
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
        TextView bluetooth = new TextView(this);
        bluetooth.setText("Bluetooth: " + bluetoothStatus());
        bluetooth.setGravity(Gravity.CENTER);
        bluetooth.setPadding(0, 24, 0, 0);
        layout.addView(bluetooth, new LinearLayout.LayoutParams(-1, -2));
        addRoleButton(layout, "Касса", "cashier");
        addRoleButton(layout, "Кухонный экран", "kitchen");
        setContentView(layout);
    }

    private void addRoleButton(LinearLayout layout, String label, String role) {
        Button button = new Button(this);
        button.setText(label);
        button.setTextColor(Color.WHITE);
        button.setBackgroundColor(Color.rgb(217, 61, 61));
        button.setAllCaps(false);
        button.setOnClickListener(view -> openRole(role));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-1, -2);
        params.setMargins(0, 24, 0, 0);
        layout.addView(button, params);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void openRole(String role) {
        setRequestedOrientation("kitchen".equals(role)
            ? ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
            : ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
        setContentView(R.layout.activity_main);

        WebView webView = findViewById(R.id.web_view);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);

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

    private String bluetoothStatus() {
        if (bluetoothAdapter == null) return "недоступен";
        if (!bluetoothAdapter.isEnabled()) return "выключен";
        if (android.os.Build.VERSION.SDK_INT >= 31 && checkSelfPermission("android.permission.BLUETOOTH_CONNECT") != PackageManager.PERMISSION_GRANTED) return "нет разрешения";
        int paired = bluetoothAdapter.getBondedDevices().size();
        return paired > 0 ? "включен, сопряжено устройств: " + paired : "включен, устройства не сопряжены";
    }

    private class AndroidBridge {
        @JavascriptInterface
        public String getBluetoothStatus() {
            return bluetoothStatus();
        }

        @JavascriptInterface
        public void openModeSelection() {
            runOnUiThread(() -> showRoleSelection());
        }

        @JavascriptInterface
        public String getKitchenReceipts() {
            return receiptsJson(kitchenReceipts);
        }

        @JavascriptInterface
        public String getKitchenHistory() {
            return receiptsJson(kitchenHistory);
        }

        @JavascriptInterface
        public void markKitchenReceiptServed(String receiptId) {
            synchronized (kitchenReceipts) {
                moveReceipt(receiptId, kitchenReceipts, kitchenHistory);
                saveKitchenReceipts();
            }
        }

        @JavascriptInterface
        public void deleteReceipt(String receiptId) {
            sendCommand("delete", receiptId);
        }

        @JavascriptInterface
        public void clearReceiptHistory() {
            sendCommand("clear", "");
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

    private void sendCommand(String command, String receiptId) {
        try {
            JSONObject payload = new JSONObject();
            payload.put("type", command);
            payload.put("id", receiptId);
            new Thread(() -> sendOverBluetooth(payload.toString())).start();
        } catch (Exception ignored) { }
    }

    private String receiptsJson(List<String> receipts) {
        JSONArray result = new JSONArray();
        synchronized (receipts) {
            for (String receipt : receipts) {
                try { result.put(new JSONObject(receipt)); } catch (Exception ignored) { }
            }
        }
        return result.toString();
    }

    private void moveReceipt(String receiptId, List<String> from, List<String> to) {
        for (int index = from.size() - 1; index >= 0; index--) {
            try {
                if (receiptId.equals(new JSONObject(from.get(index)).optString("id"))) {
                    JSONObject receipt = new JSONObject(from.remove(index));
                    receipt.put("servedAt", new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", java.util.Locale.US).format(new java.util.Date()));
                    to.add(receipt.toString());
                    return;
                }
            } catch (Exception ignored) { }
        }
    }

    private void loadKitchenReceipts() {
        String pending = kitchenStorage.getString("pending", "[]");
        String history = kitchenStorage.getString("history", "[]");
        try {
            JSONArray pendingArray = new JSONArray(pending);
            JSONArray historyArray = new JSONArray(history);
            for (int i = 0; i < pendingArray.length(); i++) kitchenReceipts.add(pendingArray.getJSONObject(i).toString());
            for (int i = 0; i < historyArray.length(); i++) kitchenHistory.add(historyArray.getJSONObject(i).toString());
        } catch (Exception ignored) { }
    }

    private void saveKitchenReceipts() {
        kitchenStorage.edit().putString("pending", receiptsJson(kitchenReceipts)).putString("history", receiptsJson(kitchenHistory)).apply();
    }

    private void startBluetoothReceiver() {
        new Thread(() -> {
            if (bluetoothAdapter == null || android.os.Build.VERSION.SDK_INT >= 31 && checkSelfPermission("android.permission.BLUETOOTH_CONNECT") != PackageManager.PERMISSION_GRANTED) return;
            try (BluetoothServerSocket server = bluetoothAdapter.listenUsingRfcommWithServiceRecord("iiko.clone", SERIAL_PORT_UUID)) {
                while (!isFinishing()) {
                    try (BluetoothSocket socket = server.accept()) {
                        byte[] buffer = new byte[8192];
                        int length = socket.getInputStream().read(buffer);
                        if (length > 0) handleIncomingMessage(new String(buffer, 0, length, StandardCharsets.UTF_8).trim());
                    } catch (IOException ignored) { }
                }
            } catch (IOException ignored) { }
        }).start();
    }

    private void handleIncomingMessage(String message) {
        try {
            JSONObject payload = new JSONObject(message);
            String type = payload.optString("type", "receipt");
            synchronized (kitchenReceipts) {
                if ("delete".equals(type)) {
                    removeReceipt(payload.optString("id"), kitchenReceipts);
                    removeReceipt(payload.optString("id"), kitchenHistory);
                } else if ("clear".equals(type)) {
                    kitchenReceipts.clear();
                    kitchenHistory.clear();
                } else if (payload.optJSONArray("items") != null && payload.optJSONArray("items").length() > 0) {
                    kitchenReceipts.add(payload.toString());
                }
                saveKitchenReceipts();
            }
        } catch (Exception ignored) { }
    }

    private void removeReceipt(String receiptId, List<String> receipts) {
        receipts.removeIf(receipt -> {
            try { return receiptId.equals(new JSONObject(receipt).optString("id")); } catch (Exception ignored) { return false; }
        });
    }
}
