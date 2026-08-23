const { debounce, defer, memoize } = (typeof window !== 'undefined' && window.iikoUtils) ? window.iikoUtils : require('./utils');

const paymentTypes = [
  { id: 'kaspi', label: 'Kaspi', color: 'kaspi' },
  { id: 'halyk', label: 'Halyk', color: 'halyk' },
  { id: 'nalichka', label: 'Наличка', color: 'nalichka' },
  { id: 'tab', label: 'TAB', color: 'tab' }
];

const receiptStorageKey = 'iikoCloneReceipts';

let categories = [];
let itemsCatalog = [];
const locationOrigin = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin !== 'null')
  ? window.location.origin
  : '';
const defaultRemoteCatalogUrl = locationOrigin
  ? `${locationOrigin}/api/catalog`
  : 'https://iiko-clone-1.onrender.com/api/catalog';
const configuredRemoteCatalogUrl = (typeof window !== 'undefined' && window.__REMOTE_CATALOG_URL__) ? String(window.__REMOTE_CATALOG_URL__).trim() : '';
const remoteCatalogUrl = configuredRemoteCatalogUrl && !/(your-render-app|your-server|your-user|example\.com)/i.test(configuredRemoteCatalogUrl)
  ? configuredRemoteCatalogUrl
  : defaultRemoteCatalogUrl;
let pendingSearchRender = false;
let pendingRenderFrame = false;
const menuDataCache = new Map();

function getPreferredDefaultCategoryId() {
  const preferredMatch = categories.find(category => category.id !== 'root' && /^круглые торты alt$/i.test(String(category.title || '').trim()));
  if (preferredMatch) {
    return preferredMatch.id;
  }

  const preferredCategory = [...categories].reverse().find(category => category.id !== 'root');
  return preferredCategory ? preferredCategory.id : null;
}

function applyFinalMenuState() {
  currentCategoryId = null;
  menuState = {
    view: 'folders',
    categoryId: null,
    searchQuery: '',
    history: []
  };
  renderAfterStateChange();
}

async function initializeCatalog() {
  categories = [];
  rebuildItemsCatalog();
  await loadCatalogFromServer();
}

function rebuildItemsCatalog() {
  itemsCatalog = categories.flatMap(category => category.items.map(item => ({
    ...item,
    categoryId: category.id,
    categoryTitle: category.title
  })));
  menuDataCache.clear();
}

function isUsableCatalogPayload(payload) {
  if (!payload || !Array.isArray(payload.categories) || !payload.categories.length) {
    return false;
  }

  return payload.categories.some(category => {
    const title = String(category?.title || '').trim();
    const hasItems = Array.isArray(category?.items) && category.items.length > 0;
    const isRootFallback = /^(root|товары без папки)$/i.test(title);
    return hasItems || (!isRootFallback && title);
  });
}

async function loadCatalogFromServer() {
  const catalogSources = remoteCatalogUrl ? [remoteCatalogUrl] : [];
  // GitHub raw fetch is intentionally disabled to avoid blocked cross-origin requests.
  // The app server provides the same catalog data through /api/catalog.
  if (!catalogSources.length) {
    return;
  }
  for (const sourceUrl of catalogSources) {
    try {
      const response = await fetch(sourceUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) {
        continue;
      }
      const payload = await response.json();
      if (isUsableCatalogPayload(payload)) {
        categories = payload.categories.map(category => ({ ...category, items: [...(category.items || [])] }));
        rebuildItemsCatalog();
        applyFinalMenuState();
        return;
      }
    } catch (error) {
    }
  }

  categories = [];
  rebuildItemsCatalog();
  applyFinalMenuState();
}

const storageKey = receiptStorageKey;
let currentCategoryId = null;
let activePage = 'create';
let selectedPayment = '';
let selectedItems = {};
let activeSelectedItemId = null;
let paymentDraft = [];
let activePaymentTypeId = paymentTypes[0]?.id || '';
let savedReceipts = [];
let historyFilter = 'all';
let isMenuEditing = false;
const appRole = new URLSearchParams(window.location.search).get('role') || 'cashier';
let kitchenView = 'orders';

// Multiple receipts management
let receipts = [{ id: 1, items: {}, payments: [] }];
let activeReceiptId = 1;
let receiptCounter = 1;

let menuState = {
  view: 'folders',
  categoryId: null,
  searchQuery: '',
  history: []
};

const elements = {
  tabCreate: document.getElementById('tab-create'),
  tabHistory: document.getElementById('tab-history'),
  brandToggle: document.getElementById('brand-toggle'),
  pageCreate: document.getElementById('page-create'),
  pageHistory: document.getElementById('page-history'),
  folderList: document.getElementById('folder-list'),
  paymentType: document.getElementById('payment-type'),
  selectedList: document.getElementById('selected-list'),
  totalPrice: document.getElementById('total-price'),
  selectedActions: document.getElementById('selected-actions'),
  safiaToolbarActions: document.getElementById('safia-toolbar-actions'),
  quantityModal: document.getElementById('quantity-modal'),
  saveButton: document.getElementById('save-button'),
  receiptTabs: document.getElementById('receipt-tabs'),
  prevReceipt: document.getElementById('prev-receipt'),
  nextReceipt: document.getElementById('next-receipt'),
  addReceipt: document.getElementById('add-receipt'),
  deleteReceipt: document.getElementById('delete-receipt'),
  receiptNumber: document.getElementById('receipt-number'),
  receiptCount: document.getElementById('receipt-count'),
  backButton: document.getElementById('back-button'),
  searchButton: document.getElementById('search-button'),
  homeButton: document.getElementById('home-button'),
  modeSelectButton: document.getElementById('mode-select-button'),
  kitchenModeSelectButton: document.getElementById('kitchen-mode-select-button'),
  menuTitle: document.getElementById('menu-title'),
  menuPaginationZone: document.getElementById('menu-pagination-zone'),
  menuSearchPanel: document.getElementById('menu-search-panel'),
  menuSearchInput: document.getElementById('menu-search-input'),
  receiptList: document.getElementById('receipt-list'),
  clearReceiptsButton: document.getElementById('clear-receipts-button'),
  filterButtons: Array.from(document.querySelectorAll('.filter-button')),
  sumKaspi: document.getElementById('sum-kaspi'),
  sumHalyk: document.getElementById('sum-halyk'),
  sumNalichka: document.getElementById('sum-nalichka'),
  sumTotal: document.getElementById('sum-total'),
  kitchenReceiptList: document.getElementById('kitchen-receipt-list'),
  kitchenOrdersButton: document.getElementById('kitchen-orders-button'),
  kitchenHistoryButton: document.getElementById('kitchen-history-button'),
  appShell: document.querySelector('.app-shell'),
  kitchenPage: document.getElementById('page-kitchen')
};

function getAndroidBridge() {
  return typeof window !== 'undefined' ? window.AndroidBridge : null;
}

function bindModeSelectionButtons() {
  [elements.modeSelectButton, elements.kitchenModeSelectButton].filter(Boolean).forEach(button => {
    button.addEventListener('click', () => getAndroidBridge()?.openModeSelection());
  });
}

function renderKitchenReceipts() {
  const container = elements.kitchenReceiptList;
  if (!container) return;
  container.innerHTML = '';
  const bridge = getAndroidBridge();
  const incoming = bridge ? JSON.parse((kitchenView === 'history' ? bridge.getKitchenHistory() : bridge.getKitchenReceipts()) || '[]') : [];
  if (!incoming.length) {
    container.innerHTML = '<div class="empty-state">Нет чеков с напитками Safia Бар.</div>';
    return;
  }
  incoming.forEach(receipt => {
    const card = document.createElement('div');
    card.className = 'receipt-card kitchen-receipt-card';
    const control = document.createElement('div');
    control.className = `kitchen-receipt-control${kitchenView === 'history' ? ' kitchen-receipt-control-done' : ''}`;
    const timer = document.createElement('strong');
    timer.className = 'kitchen-timer';
    const updateTimer = () => {
      const remaining = 600 - Math.floor((Date.now() - new Date(receipt.createdAt).getTime()) / 1000);
      const absolute = Math.abs(remaining);
      const minutes = String(Math.floor(absolute / 60)).padStart(2, '0');
      const seconds = String(absolute % 60).padStart(2, '0');
      timer.textContent = remaining < 0 ? `-${minutes}:${seconds}` : `${minutes}:${seconds}`;
      control.classList.toggle('kitchen-receipt-expired', remaining < 0);
    };
    updateTimer();
    const title = document.createElement('span');
    title.textContent = `Чек ${receipt.id}`;
    control.append(timer, title);
    if (kitchenView === 'orders') {
      const served = document.createElement('button');
      served.type = 'button';
      served.className = 'filter-button kitchen-served-button';
      served.textContent = 'Подано';
      served.addEventListener('click', () => {
        bridge?.markKitchenReceiptServed(receipt.id);
        renderKitchenReceipts();
      });
      control.appendChild(served);
    }
    card.appendChild(control);
    const body = document.createElement('div');
    body.className = 'kitchen-receipt-body';
    (receipt.items || []).forEach(item => {
      const row = document.createElement('div');
      row.className = 'receipt-item';
      row.innerHTML = `<div><div>${item.name} × ${item.quantity}</div>${item.modifier ? `<div class="selected-modifier">${item.modifier}</div>` : ''}${item.comment ? `<div class="receipt-comment">${item.comment}</div>` : ''}${item.isTakeaway ? '<div class="selected-tag selected-tag-takeaway">На вынос</div>' : ''}${item.tableNumber ? `<div class="selected-tag selected-tag-table">№${item.tableNumber}</div>` : ''}</div>`;
      body.appendChild(row);
    });
    card.appendChild(body);
    container.appendChild(card);
    if (kitchenView === 'orders') window.setInterval(updateTimer, 1000);
  });
}

function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')} ₸`;
}

function compareByName(a, b) {
  const aValue = String(a.name || a.title || '');
  const bValue = String(b.name || b.title || '');
  const aGroup = /^[A-Za-z]/.test(aValue) ? 0 : 1;
  const bGroup = /^[A-Za-z]/.test(bValue) ? 0 : 1;
  if (aGroup !== bGroup) {
    return aGroup - bGroup;
  }
  return aValue.localeCompare(bValue, 'ru', { sensitivity: 'base' });
}

function toggleItemPriceVisibility() {
  const isVisible = document.body.classList.toggle('show-item-prices');
  if (elements.brandToggle) {
    elements.brandToggle.setAttribute('aria-pressed', String(isVisible));
    elements.brandToggle.title = isVisible ? 'Скрыть цены' : 'Показать цены';
  }
}

function isSafiaBarContext(category, item) {
  // Resolve starting category: prefer provided, fall back to item's categoryId
  let cat = category || null;
  if (!cat && item?.categoryId) {
    cat = categories.find(c => c.id === item.categoryId) || null;
  }

  // Walk up the parent chain to see if any ancestor has title 'Safia Бар'
  while (cat) {
    if (String(cat.title).trim() === 'Safia Бар') return true;
    cat = categories.find(c => c.id === cat.parentId) || null;
  }

  // As a last resort, check item's categoryTitle if present
  if (String(item?.categoryTitle || '').trim() === 'Safia Бар') return true;
  return false;
}

function getItemModifiers(item, category) {
  if (!isSafiaBarContext(category, item)) {
    return [];
  }
  if (Array.isArray(item?.modifiers)) {
    return item.modifiers.filter(Boolean);
  }
  if (typeof item?.modifier === 'string' && item.modifier.trim()) {
    return [item.modifier.trim()];
  }
  return [];
}

function sortModifiers(modifiers) {
  return [...modifiers]
    .filter(value => typeof value === 'string' && value.trim())
    .map(value => value.trim())
    .sort((a, b) => a.localeCompare(b, 'ru', { sensitivity: 'base' }));
}

function openModifierSelectionModal(item, category) {
  const modifiers = sortModifiers(getItemModifiers(item, category));
  if (!modifiers.length) {
    addItem(item, category, '');
    return;
  }

  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const title = document.createElement('h3');
  title.textContent = 'Выберите модификатор';
  content.appendChild(title);

  const list = document.createElement('div');
  list.className = 'modifier-picker-list';
  modifiers.forEach(modifier => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'modifier-picker-button';
    button.textContent = modifier;
    button.addEventListener('click', () => {
      addItem(item, category, modifier);
      elements.quantityModal.classList.add('hidden');
    });
    list.appendChild(button);
  });

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(cancelButton);

  content.appendChild(list);
  content.appendChild(actions);
  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
}

function applyColumnLayout(container, count) {
  let columns = 1;
  if (count >= 5 && count <= 8) {
    columns = 2;
  } else if (count > 8) {
    columns = Math.max(1, Math.min(4, Math.ceil(count / 8)));
  }

  container.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
  container.style.gridTemplateRows = count >= 5 && count <= 8 ? 'repeat(4, auto)' : 'repeat(8, auto)';
  container.style.gridAutoFlow = 'column';
}

function getActiveReceipt() {
  return receipts.find(r => r.id === activeReceiptId) || receipts[0];
}

function createNewReceipt() {
  receiptCounter += 1;
  const newReceipt = { id: receiptCounter, items: {}, payments: [] };
  receipts.push(newReceipt);
  switchReceipt(receiptCounter);
}

function switchReceipt(receiptId) {
  const receipt = receipts.find(r => r.id === receiptId);
  if (!receipt) return;
  
  // Save current receipt state
  const currentReceipt = getActiveReceipt();
  currentReceipt.items = selectedItems;
  currentReceipt.payments = paymentDraft;
  
  // Switch to new receipt
  activeReceiptId = receiptId;
  selectedItems = receipt.items;
  paymentDraft = receipt.payments;
  activePaymentTypeId = paymentTypes[0]?.id || '';
  activeSelectedItemId = null;
  
  renderReceiptTabs();
  renderSelectedItems();
  renderPaymentActions();
}

function renderReceiptTabs() {
  const currentIndex = receipts.findIndex(r => r.id === activeReceiptId);
  const totalCount = receipts.length;
  
  // Update display
  elements.receiptNumber.textContent = currentIndex + 1;
  elements.receiptCount.textContent = totalCount;
  
  // Disable/enable navigation buttons
  elements.prevReceipt.disabled = currentIndex === 0 || totalCount === 1;
  elements.nextReceipt.disabled = currentIndex === totalCount - 1 || totalCount === 1;
  
  // Hide nav buttons if only one receipt
  elements.prevReceipt.style.display = totalCount > 1 ? 'flex' : 'none';
  elements.nextReceipt.style.display = totalCount > 1 ? 'flex' : 'none';
}

function prevReceipt() {
  const currentIndex = receipts.findIndex(r => r.id === activeReceiptId);
  if (currentIndex > 0) {
    switchReceipt(receipts[currentIndex - 1].id);
  }
}

function nextReceipt() {
  const currentIndex = receipts.findIndex(r => r.id === activeReceiptId);
  if (currentIndex < receipts.length - 1) {
    switchReceipt(receipts[currentIndex + 1].id);
  }
}

function loadReceipts() {
  const stored = localStorage.getItem(storageKey);
  const parsed = stored ? JSON.parse(stored) : [];
  savedReceipts = Array.isArray(parsed) ? parsed.filter(receipt => Array.isArray(receipt.items) && receipt.items.length > 0) : [];
  saveReceipts();
}

function saveReceipts() {
  localStorage.setItem(storageKey, JSON.stringify(savedReceipts));
}

function getCurrentCategory() {
  const targetId = menuState.categoryId || currentCategoryId;
  if (!targetId) {
    return null;
  }
  return categories.find(category => category.id === targetId) || null;
}

function setMenuEditing(value) {
  isMenuEditing = value;
  if (!value) {
    elements.menuAddPopover.classList.add('hidden');
  }
  if (elements.menuEditToggle) {
    elements.menuEditToggle.classList.toggle('active', value);
  }
  if (elements.menuEditAddButton) {
    elements.menuEditAddButton.classList.toggle('hidden', !value);
  }
  if (elements.menuEditSaveButton) {
    elements.menuEditSaveButton.classList.toggle('hidden', !value);
  }
  renderAfterStateChange();
}

function toggleMenuEditing() {
  setMenuEditing(!isMenuEditing);
}

async function saveMenuChanges() {
  if (!isAdminMode) return;
  await saveCatalogToServer();
  if (typeof window !== 'undefined') {
    window.alert('Изменения сохранены');
  }
}

function activateAdminMode() {
  if (!isAdminMode) {
    const enteredPassword = typeof window !== 'undefined' ? window.prompt('Введите пароль администратора') : null;
    if (enteredPassword !== adminPassword) {
      if (typeof window !== 'undefined') {
        window.alert('Неверный пароль администратора');
      }
      return false;
    }
  }

  isAdminMode = true;
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(adminModeStorageKey, 'true');
    window.localStorage.setItem(adminTokenStorageKey, adminToken);
  }
  if (elements.menuEditToggle) {
    elements.menuEditToggle.classList.add('active');
  }
  if (elements.menuEditAddButton) {
    elements.menuEditAddButton.classList.remove('hidden');
  }
  if (elements.menuEditSaveButton) {
    elements.menuEditSaveButton.classList.remove('hidden');
  }
  setMenuEditing(true);
  return true;
}

function getNextCategoryTitle(parentId = null) {
  const existingTitles = categories.filter(category => category.parentId === parentId).map(category => category.title);
  let index = 1;
  let title = `New Папка ${index}`;
  while (existingTitles.includes(title)) {
    index += 1;
    title = `New Папка ${index}`;
  }
  return title;
}

function getNextItemName(category) {
  const existingNames = (category?.items || []).map(item => item.name);
  let index = 1;
  let title = `New Товар ${index}`;
  while (existingNames.includes(title)) {
    index += 1;
    title = `New Товар ${index}`;
  }
  return title;
}

function addMenuEntry(type) {
  if (!isAdminMode) return;
  elements.menuAddPopover.classList.add('hidden');

  if (type === 'folder') {
    const parentCategory = getCurrentCategory();
    const newCategory = {
      id: `cat${Date.now()}`,
      title: getNextCategoryTitle(parentCategory?.id || null),
      parentId: parentCategory?.id || null,
      items: []
    };
    categories.unshift(newCategory);
    persistCatalogLocally();
    saveCatalogToServer();
    if (parentCategory) {
      menuState = {
        view: 'items',
        categoryId: parentCategory.id,
        searchQuery: '',
        history: []
      };
    } else {
      menuState = {
        view: 'folders',
        categoryId: null,
        searchQuery: '',
        history: []
      };
    }
    rebuildItemsCatalog();
    renderAfterStateChange();
    return;
  }

  if (type === 'item') {
    const currentCategory = getCurrentCategory();
    if (currentCategory?.id === 'root' || (menuState.view === 'folders' && !currentCategory)) {
      const rootCategory = categories.find(cat => cat.id === 'root');
      if (rootCategory) {
        rootCategory.items.push({
          id: `item${Date.now()}`,
          name: getNextItemName(rootCategory),
          price: 0,
          modifier: ''
        });
      }
      menuState = { view: 'folders', categoryId: null, searchQuery: '', history: [] };
    } else {
      const targetCategory = currentCategory || categories[1];
      if (!targetCategory) return;
      targetCategory.items.push({
        id: `item${Date.now()}`,
        name: getNextItemName(targetCategory),
        price: 0,
        modifier: ''
      });
      persistCatalogLocally();
      saveCatalogToServer();
      menuState = { view: 'items', categoryId: targetCategory.id, searchQuery: '', history: [] };
    }
    rebuildItemsCatalog();
    renderAfterStateChange();
  }
}

function openFolderEditModal(category) {
  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const title = document.createElement('h3');
  title.textContent = 'Изменить папку';
  content.appendChild(title);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'menu-search-input qty-modal-input';
  input.value = category.title;
  input.placeholder = 'Название папки';
  content.appendChild(input);

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';
  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.textContent = 'Сохранить';
  saveButton.addEventListener('click', () => {
    const trimmed = input.value.trim();
    if (trimmed) {
      category.title = trimmed;
      persistCatalogLocally();
      rebuildItemsCatalog();
      renderAfterStateChange();
      syncCategoryToServer(category);
    }
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(saveButton);

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(cancelButton);
  content.appendChild(actions);

  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
  input.focus();
  input.select();
}

function openItemEditModal(item, category) {
  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const title = document.createElement('h3');
  title.textContent = 'Изменить позицию';
  content.appendChild(title);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'menu-search-input qty-modal-input';
  nameInput.value = item.name;
  nameInput.placeholder = 'Название';
  content.appendChild(nameInput);

  const priceInput = document.createElement('input');
  priceInput.type = 'number';
  priceInput.min = '0';
  priceInput.step = '1';
  priceInput.className = 'menu-search-input qty-modal-input';
  priceInput.value = item.price ?? 0;
  priceInput.placeholder = 'Сумма';
  content.appendChild(priceInput);

  const modifierSection = document.createElement('div');
  modifierSection.className = 'modifier-editor';
  const modifierLabel = document.createElement('div');
  modifierLabel.className = 'modifier-editor-label';
  modifierLabel.textContent = 'Модификаторы (до 16)';
  modifierSection.appendChild(modifierLabel);

  const modifierList = document.createElement('div');
  modifierList.className = 'modifier-input-list';
  const modifierFields = [];

  const addModifierField = (value = '') => {
    const row = document.createElement('div');
    row.className = 'modifier-input-row';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'menu-search-input qty-modal-input';
    input.value = value;
    input.placeholder = 'Название модификатора';
    row.appendChild(input);
    modifierFields.push(input);
    modifierList.appendChild(row);
    return input;
  };

  const existingModifiers = sortModifiers(Array.isArray(item.modifiers) ? item.modifiers : []);
  existingModifiers.forEach(value => addModifierField(value));
  if (modifierFields.length === 0) {
    addModifierField('');
  }

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'modifier-add-button';
  addButton.textContent = 'Добавить модификатор';
  addButton.addEventListener('click', () => {
    if (modifierFields.length >= 16) return;
    addModifierField('');
  });

  modifierSection.appendChild(modifierList);
  modifierSection.appendChild(addButton);
  content.appendChild(modifierSection);

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';
  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.textContent = 'Сохранить';
  saveButton.addEventListener('click', () => {
    const trimmedName = nameInput.value.trim();
    const parsedPrice = Number(priceInput.value);
    if (trimmedName) {
      item.name = trimmedName;
    }
    item.price = Number.isFinite(parsedPrice) ? parsedPrice : 0;
    item.modifiers = sortModifiers(modifierFields.map(field => field.value));
    persistCatalogLocally();
    if (item.modifiers.length) {
      item.modifier = item.modifiers[0];
    } else {
      item.modifier = '';
    }
    rebuildItemsCatalog();
    renderAfterStateChange();
    syncItemToServer(item);
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(saveButton);

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(cancelButton);
  content.appendChild(actions);

  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
  nameInput.focus();
  nameInput.select();
}

function renameCategory(category) {
  openFolderEditModal(category);
}

function deleteCategory(category) {
  if (!isAdminMode) return;
  const ok = window.confirm(`Удалить папку «${category.title}»?`);
  if (!ok) return;
  const index = categories.findIndex(item => item.id === category.id);
  if (index >= 0) {
    categories.splice(index, 1);
  }
  if (menuState.view === 'items' && menuState.categoryId === category.id) {
    menuState = { view: 'folders', categoryId: null, searchQuery: '', history: [] };
  }
  rebuildItemsCatalog();
  renderAfterStateChange();
  saveCatalogToServer();
}

function renameItem(item, category) {
  openItemEditModal(item, category);
}

function deleteItem(item, category) {
  if (!isAdminMode) return;
  const ok = window.confirm(`Удалить позицию «${item.name}»?`);
  if (!ok) return;
  const index = category.items.findIndex(entry => entry.id === item.id);
  if (index >= 0) {
    category.items.splice(index, 1);
  }
  persistCatalogLocally();
  rebuildItemsCatalog();
  renderAfterStateChange();
  saveCatalogToServer();
}

function setActivePage(page) {
  activePage = page;
  elements.pageCreate.classList.toggle('active', page === 'create');
  elements.pageHistory.classList.toggle('active', page === 'history');
  elements.tabCreate.classList.toggle('active', page === 'create');
  elements.tabHistory.classList.toggle('active', page === 'history');
  if (page === 'history') {
    renderReceipts();
  }
}

function pushMenuState(view, categoryId = null, searchQuery = '') {
  menuState.history.push({
    view: menuState.view,
    categoryId: menuState.categoryId,
    searchQuery: menuState.searchQuery
  });
  menuState.view = view;
  menuState.categoryId = categoryId;
  menuState.searchQuery = searchQuery;
}

function goBack() {
  const previous = menuState.history.pop();
  if (!previous) {
    menuState = { view: 'folders', categoryId: null, searchQuery: '', history: [] };
  } else {
    menuState.view = previous.view;
    menuState.categoryId = previous.categoryId;
    menuState.searchQuery = previous.searchQuery;
  }
  renderAfterStateChange();
}

function goHome() {
  menuState = { view: 'folders', categoryId: null, searchQuery: '', history: [] };
  renderAfterStateChange();
}

function openCategory(id) {
  pushMenuState('items', id, '');
  renderMenu();
}

function openSearch() {
  if (menuState.view === 'search') {
    elements.menuSearchInput.focus();
    return;
  }
  pushMenuState('search', menuState.categoryId, '');
  renderAfterStateChange();
  elements.menuSearchInput.focus();
}

const debouncedSearchRender = debounce(() => {
  pendingSearchRender = false;
  renderMenu();
}, 120);

function handleSearchInput(value) {
  menuState.searchQuery = value.trim().toLowerCase();
  pendingSearchRender = true;
  debouncedSearchRender();
}

function renderAfterStateChange() {
  queueMenuRender();
}

function selectPayment(type) {
  selectedPayment = type;
  activePaymentTypeId = type;
  if (!elements.quantityModal.classList.contains('hidden')) {
    renderPaymentModal();
  }
}

function parseAmountValue(value) {
  const normalized = String(value).replace(/,/g, '.').replace(/[^\d.]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getReceiptTotal() {
  return Object.values(selectedItems).reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getReceiptPayments(receipt, { excludeTab = false } = {}) {
  if (Array.isArray(receipt.payments) && receipt.payments.length) {
    const payments = receipt.payments.slice();
    return excludeTab ? payments.filter(payment => payment.type !== 'tab') : payments;
  }
  if (receipt.type) {
    const payment = { type: receipt.type, amount: receipt.total };
    return excludeTab && payment.type === 'tab' ? [] : [payment];
  }
  return [];
}

function getAllocatedAmount() {
  return paymentDraft.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
}

function getRemainingAmountForType(type) {
  const total = getReceiptTotal();
  const allocatedOthers = paymentDraft
    .filter(payment => payment.type !== type)
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
  return Math.max(0, total - allocatedOthers);
}

function findPaymentDraft(type) {
  return paymentDraft.find(payment => payment.type === type);
}

function activatePaymentType(type) {
  activePaymentTypeId = type;
  let existing = findPaymentDraft(type);
  if (!existing) {
    const newPayment = { type, value: '', amount: 0 };
    paymentDraft.push(newPayment);
    existing = newPayment;
  }
  return existing;
}

function getMaxAmountForType(type) {
  const total = getReceiptTotal();
  if (type !== 'kaspi' && type !== 'halyk') {
    return total;
  }
  const otherCardAmount = paymentDraft
    .filter(payment => payment.type !== type && (payment.type === 'kaspi' || payment.type === 'halyk'))
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
  return Math.max(0, total - otherCardAmount);
}

function updatePaymentDraft(type, value) {
  const existing = findPaymentDraft(type);
  if (!existing) {
    return;
  }
  const nextValue = parseAmountValue(value);
  if (type === 'kaspi' || type === 'halyk') {
    const cap = getMaxAmountForType(type);
    existing.amount = Math.min(nextValue, cap);
  } else if (type === 'nalichka') {
    existing.amount = nextValue;
  }
  existing.value = value.replace(/[^\d,]/g, '');
  if (existing.value === '') {
    existing.amount = 0;
  }
}

function removePaymentType(type) {
  paymentDraft = paymentDraft.filter(payment => payment.type !== type);
  if (activePaymentTypeId === type) {
    activePaymentTypeId = paymentDraft.length ? paymentDraft[0].type : paymentTypes[0]?.id || '';
  }
}

function getPaidNonTabAmount() {
  return paymentDraft.reduce((sum, payment) => {
    if (payment.type === 'tab') return sum;
    return sum + (Number(payment.amount) || 0);
  }, 0);
}

function canSavePayments() {
  const total = getReceiptTotal();
  if (total <= 0) return false;
  const hasTab = !!findPaymentDraft('tab');
  const paid = getPaidNonTabAmount();
  if (hasTab && paid > 0) return false;
  if (hasTab) return true;
  return paid >= total;
}

function getNalichkaChange() {
  const nalichka = findPaymentDraft('nalichka');
  if (!nalichka) return 0;
  const total = getReceiptTotal();
  const other = paymentDraft.reduce((sum, payment) => {
    if (payment.type === 'nalichka' || payment.type === 'tab') return sum;
    return sum + (Number(payment.amount) || 0);
  }, 0);
  return Math.max(0, (Number(nalichka.amount) || 0) - Math.max(0, total - other));
}

function renderPaymentBreakdown(container) {
  container.innerHTML = '';
  if (!paymentDraft.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Выберите способ оплаты сверху';
    container.appendChild(empty);
    return;
  }
  paymentDraft.forEach(payment => {
    const paymentType = paymentTypes.find(item => item.id === payment.type);
    if (!paymentType) return;
    const row = document.createElement('div');
    row.className = `payment-breakdown-row${activePaymentTypeId === payment.type ? ' active' : ''}`;
    row.addEventListener('click', () => {
      activatePaymentType(payment.type);
      renderPaymentModal();
    });
    const label = document.createElement('div');
    label.className = 'payment-breakdown-label';
    label.textContent = paymentType.label;
    const amount = document.createElement('div');
    amount.className = 'payment-breakdown-amount';
    amount.textContent = payment.type === 'tab' ? formatPrice(getReceiptTotal()) : formatPrice(payment.amount);
    const actions = document.createElement('div');
    actions.className = 'payment-row-actions';
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'payment-row-button';
    removeBtn.textContent = 'Х';
    removeBtn.addEventListener('click', event => {
      event.stopPropagation();
      removePaymentType(payment.type);
      renderPaymentModal();
    });
    actions.appendChild(removeBtn);
    row.appendChild(label);
    row.appendChild(amount);
    row.appendChild(actions);
    container.appendChild(row);
  });
}

function renderPaymentModal() {
  const total = getReceiptTotal();
  elements.quantityModal.innerHTML = '';

  const content = document.createElement('div');
  content.className = 'qty-modal-content payment-modal-content';

  const title = document.createElement('div');
  title.className = 'payment-modal-title';
  title.innerHTML = `<div></div><div class="item-subtotal">Итого: ${formatPrice(total)}</div>`;
  content.appendChild(title);

  const typeList = document.createElement('div');
  typeList.className = 'payment-type-list payment-type-list-with-tab';
  const paid = getPaidNonTabAmount();
  const hasNonTabPayment = paymentDraft.some(payment => payment.type !== 'tab');
  const completeNonTab = paymentDraft.find(payment => payment.type !== 'tab' && Number(payment.amount) >= total);
  paymentTypes.forEach(type => {
    const button = document.createElement('button');
    button.type = 'button';
    const disabled = (type.id === 'tab' && hasNonTabPayment) || (completeNonTab && type.id !== completeNonTab.type);
    button.disabled = disabled;
    button.className = `payment-type-option${activePaymentTypeId === type.id ? ' active' : ''}${disabled ? ' disabled' : ''}`;
    button.textContent = type.label;
    button.addEventListener('click', () => {
      if (disabled) return;
      activatePaymentType(type.id);
      renderPaymentModal();
    });
    typeList.appendChild(button);
  });
  content.appendChild(typeList);

  const breakdown = document.createElement('div');
  breakdown.className = 'payment-breakdown payment-selected-list';
  renderPaymentBreakdown(breakdown);
  content.appendChild(breakdown);

  const summaryBlock = document.createElement('div');
  summaryBlock.className = 'payment-amount-summary';
  const remaining = paymentDraft.length === 1 && paymentDraft[0].type === 'tab'
    ? 0
    : Math.max(0, total - getPaidNonTabAmount());
  const change = getNalichkaChange();
  summaryBlock.innerHTML = `
    <div class="payment-summary-row"><span>Итого:</span><strong>${formatPrice(total)}</strong></div>
    <div class="payment-summary-row"><span>Внести:</span><strong>${formatPrice(remaining)}</strong></div>
    <div class="payment-summary-row"><span>Сдача:</span><strong>${formatPrice(change)}</strong></div>
  `;
  content.appendChild(summaryBlock);

  const keypad = document.createElement('div');
  keypad.className = 'qty-modal-keypad';
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', 'Х'].forEach(buttonLabel => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = buttonLabel;
    button.addEventListener('click', () => {
      const draft = findPaymentDraft(activePaymentTypeId);
      if (!draft || activePaymentTypeId === 'tab') return;
      if (buttonLabel === 'Х') {
        draft.value = '';
      } else if (buttonLabel === ',') {
        if (!draft.value.includes(',')) {
          draft.value += ',';
        }
      } else {
        draft.value += buttonLabel;
      }
      updatePaymentDraft(activePaymentTypeId, draft.value);
      renderPaymentModal();
    });
    keypad.appendChild(button);
  });
  content.appendChild(keypad);

  const exactButton = document.createElement('button');
  exactButton.type = 'button';
  exactButton.className = 'payment-exact-button';
  exactButton.textContent = 'Точная сумма';
  exactButton.disabled = !activePaymentTypeId || activePaymentTypeId === 'tab';
  exactButton.addEventListener('click', () => {
    if (!activePaymentTypeId || activePaymentTypeId === 'tab') return;
    const amount = getRemainingAmountForType(activePaymentTypeId);
    const draft = activatePaymentType(activePaymentTypeId);
    draft.value = String(amount).replace('.', ',');
    updatePaymentDraft(activePaymentTypeId, draft.value);
    renderPaymentModal();
  });
  content.appendChild(exactButton);

  const isReady = canSavePayments();
  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.className = `payment-modal-save${isReady ? ' ready' : ' disabled'}`;
  saveButton.textContent = 'Сохранить';
  saveButton.disabled = !isReady;
  saveButton.addEventListener('click', () => {
    if (!isReady) return;
    saveReceiptWithPayments(paymentDraft);
    closePaymentModal();
  });
  content.appendChild(saveButton);

  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
}

function openPaymentModal() {
  if (Object.values(selectedItems).length === 0) {
    alert('Сначала добавьте хотя бы один товар.');
    return;
  }
  paymentDraft = [];
  activePaymentTypeId = '';
  renderPaymentModal();
}

function showChangeModal(changeAmount) {
  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content payment-modal-content';
  content.innerHTML = `<div class="payment-modal-title"><div></div><div class="item-subtotal">Сдача: ${formatPrice(changeAmount)}</div></div>`;
  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';
  const okButton = document.createElement('button');
  okButton.type = 'button';
  okButton.textContent = 'ОК';
  okButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(okButton);
  content.appendChild(actions);
  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
}

function closePaymentModal() {
  paymentDraft = [];
  activePaymentTypeId = paymentTypes[0]?.id || '';
  elements.quantityModal.classList.add('hidden');
  elements.quantityModal.innerHTML = '';
}

function saveReceiptWithPayments(payments) {
  if (Object.keys(selectedItems).length === 0) {
    alert('Нельзя сохранить пустой чек.');
    closePaymentModal();
    return null;
  }
  const total = getReceiptTotal();
  const validPayments = payments
    .filter(payment => payment.type === 'tab' || Number(payment.amount) > 0)
    .filter(payment => !(payment.type === 'tab' && payments.some(p => p.type !== 'tab' && Number(p.amount) > 0)));
  const receipt = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    items: Object.values(selectedItems).map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      comment: item.comment || '',
      modifier: item.selectedModifier || item.modifier || '',
      isSafiaBar: isSafiaBarContext(null, item),
      isTakeaway: Boolean(item.isTakeaway),
      tableNumber: Number.isInteger(item.tableNumber) && item.tableNumber > 0 ? item.tableNumber : null
    })),
    payments: validPayments.map(payment => ({ type: payment.type, amount: payment.type === 'tab' ? total : Number(payment.amount) })),
    total
  };
  savedReceipts.unshift(receipt);
  saveReceipts();
  const kitchenReceipt = {
    ...receipt,
    items: receipt.items.filter(item => item.isSafiaBar)
  };
  const bridge = getAndroidBridge();
  if (bridge && kitchenReceipt.items.length) {
    bridge.sendReceipt(JSON.stringify(kitchenReceipt));
  }
  
  // Clear current receipt and create new one
  const currentReceipt = getActiveReceipt();
  currentReceipt.items = {};
  currentReceipt.payments = [];
  
  selectedItems = {};
  paymentDraft = [];
  selectedPayment = '';
  activePaymentTypeId = paymentTypes[0]?.id || '';
  activeSelectedItemId = null;
  
  renderSelectedItems();
  renderPaymentActions();
  renderReceipts();
  alert('Чек сохранен. Можно перейти на страницу сохраненных чеков.');
  return receipt;
}


function ensureActiveSelectedItem() {
  const ids = Object.keys(selectedItems);
  if (!ids.length) {
    activeSelectedItemId = null;
    return;
  }

  if (!activeSelectedItemId || !selectedItems[activeSelectedItemId]) {
    activeSelectedItemId = ids[0];
  }
}

function selectSelectedItem(itemId) {
  if (!selectedItems[itemId]) return;
  activeSelectedItemId = itemId;
  renderSelectedItems();
}

function addItem(item, category = null, modifier = '') {
  const normalizedModifier = typeof modifier === 'string' ? modifier.trim() : '';
  const key = normalizedModifier ? `${item.id}::${normalizedModifier}` : item.id;
  const categoryTitle = category?.title || item?.categoryTitle || item?.category?.title || '';
  if (!selectedItems[key]) {
    selectedItems[key] = {
      ...item,
      id: key,
      quantity: 0,
      originalId: item.id,
      selectedModifier: normalizedModifier,
      modifier: normalizedModifier,
      categoryTitle,
      categoryId: category?.id || item?.categoryId || null,
      isTakeaway: false,
      tableNumber: null
    };
  }
  selectedItems[key].quantity += 1;
  selectedItems[key].selectedModifier = normalizedModifier;
  selectedItems[key].modifier = normalizedModifier;
  selectedItems[key].categoryTitle = categoryTitle || selectedItems[key].categoryTitle || '';
  selectedItems[key].categoryId = category?.id || item?.categoryId || selectedItems[key].categoryId || null;
  activeSelectedItemId = key;
  renderSelectedItems();
}

function changeQuantity(itemId, delta) {
  const current = selectedItems[itemId];
  if (!current) return;
  current.quantity += delta;
  if (current.quantity <= 0) {
    delete selectedItems[itemId];
    if (activeSelectedItemId === itemId) {
      activeSelectedItemId = null;
    }
  }
  renderSelectedItems();
}

function setQuantity(itemId, value) {
  const current = selectedItems[itemId];
  if (!current) return;
  const next = Number(value);
  if (!Number.isFinite(next) || next <= 0) {
    delete selectedItems[itemId];
    if (activeSelectedItemId === itemId) {
      activeSelectedItemId = null;
    }
  } else {
    current.quantity = next;
  }
  renderSelectedItems();
}

function openCommentModal(itemId) {
  const current = selectedItems[itemId];
  if (!current) return;

  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const input = document.createElement('textarea');
  input.className = 'comment-textarea';
  input.value = current.comment || '';
  input.placeholder = 'Введите комментарий';
  input.addEventListener('blur', () => {
    current.comment = input.value.trim();
    renderSelectedItems();
    elements.quantityModal.classList.add('hidden');
  });
  content.appendChild(input);

  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
  input.focus();
}

function openTableNumberModal(itemId) {
  const current = selectedItems[itemId];
  if (!current) return;

  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const title = document.createElement('h3');
  title.textContent = 'Выберите номер стола';
  content.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'table-number-grid';
  const numbers = [
    ...Array.from({ length: 20 }, (_, index) => index + 1),
    ...Array.from({ length: 20 }, (_, index) => index + 30)
  ];

  numbers.forEach(number => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'table-number-button';
    button.textContent = `№${number}`;
    if (current.tableNumber === number) {
      button.classList.add('active');
    }
    button.addEventListener('click', () => {
      current.tableNumber = number;
      renderSelectedItems();
      renderSafiaExtraActions();
      elements.quantityModal.classList.add('hidden');
    });
    grid.appendChild(button);
  });

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Удалить';
  deleteButton.addEventListener('click', () => {
    current.tableNumber = null;
    renderSelectedItems();
    renderSafiaExtraActions();
    elements.quantityModal.classList.add('hidden');
  });

  actions.appendChild(cancelButton);
  actions.appendChild(deleteButton);
  content.appendChild(grid);
  content.appendChild(actions);
  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
}

function renderSafiaExtraActions() {
  if (!elements.safiaToolbarActions) return;

  const activeItem = selectedItems[activeSelectedItemId];
  if (!activeItem || !isSafiaBarContext(null, activeItem)) {
    elements.safiaToolbarActions.innerHTML = '';
    elements.safiaToolbarActions.classList.add('hidden');
    return;
  }

  elements.safiaToolbarActions.innerHTML = '';
  elements.safiaToolbarActions.classList.remove('hidden');

  const takeawayButton = document.createElement('button');
  takeawayButton.type = 'button';
  takeawayButton.className = `safia-toolbar-button${activeItem.isTakeaway ? ' active' : ''}`;
  takeawayButton.textContent = 'На вынос';
  takeawayButton.addEventListener('click', () => {
    activeItem.isTakeaway = !activeItem.isTakeaway;
    renderSelectedItems();
    renderSafiaExtraActions();
  });

  const tableButton = document.createElement('button');
  tableButton.type = 'button';
  tableButton.className = `safia-toolbar-button${activeItem.tableNumber ? ' active' : ''}`;
  tableButton.textContent = 'Номерок';
  tableButton.addEventListener('click', () => {
    openTableNumberModal(activeItem.id);
  });

  elements.safiaToolbarActions.appendChild(takeawayButton);
  elements.safiaToolbarActions.appendChild(tableButton);
}

function openCustomAmountModal(item, category) {
  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const title = document.createElement('h3');
  title.textContent = 'Введите сумму';
  content.appendChild(title);

  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.step = '1';
  input.className = 'menu-search-input qty-modal-input';
  input.placeholder = 'Сумма';
  input.value = item.price ?? 0;
  content.appendChild(input);

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(cancelButton);

  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.textContent = 'ОК';
  applyButton.addEventListener('click', () => {
    const parsed = Number(input.value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      const customItem = { ...item, price: parsed };
      addItem(customItem, category, '');
    }
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(applyButton);

  content.appendChild(actions);
  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
  input.focus();
}

function openQuantityModal(itemId) {
  const current = selectedItems[itemId];
  if (!current) return;
  const presetValues = ['0,25', '0,5', '0,75', '1,25', '1,5', '1,75', '2,25', '2,5'];
  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content';
  content.innerHTML = `<h3>Введите количество</h3>`;

  const display = document.createElement('div');
  display.className = 'item-name';
  display.textContent = current.name;
  content.appendChild(display);

  const inputRow = document.createElement('div');
  inputRow.className = 'qty-modal-input-row';
  const input = document.createElement('input');
  input.type = 'text';
  input.value = '';
  input.placeholder = '0';
  input.className = 'menu-search-input qty-modal-input';
  input.setAttribute('inputmode', 'decimal');
  inputRow.appendChild(input);
  content.appendChild(inputRow);

  const body = document.createElement('div');
  body.className = 'qty-modal-body';

  const keypad = document.createElement('div');
  keypad.className = 'qty-modal-keypad';
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '×'].forEach(buttonLabel => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = buttonLabel;
    button.addEventListener('click', () => {
      if (buttonLabel === '×') {
        input.value = input.value.slice(0, -1);
        return;
      }
      if (buttonLabel === ',') {
        if (!input.value.includes(',')) {
          input.value += ',';
        }
        return;
      }
      input.value += buttonLabel;
    });
    keypad.appendChild(button);
  });
  body.appendChild(keypad);

  const side = document.createElement('div');
  side.className = 'qty-modal-side';
  const presetRow = document.createElement('div');
  presetRow.className = 'qty-modal-grid';
  presetValues.forEach(value => {
    const presetButton = document.createElement('button');
    presetButton.type = 'button';
    presetButton.textContent = value;
    presetButton.addEventListener('click', () => {
      setQuantity(itemId, value.replace(',', '.'));
      elements.quantityModal.classList.add('hidden');
    });
    presetRow.appendChild(presetButton);
  });
  side.appendChild(presetRow);

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';
  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.textContent = 'ОК';
  applyButton.addEventListener('click', () => {
    const parsed = Number(input.value.replace(',', '.'));
    if (Number.isFinite(parsed) && parsed > 0) {
      setQuantity(itemId, parsed);
    }
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(applyButton);
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(cancelButton);
  side.appendChild(actions);
  body.appendChild(side);
  content.appendChild(body);

  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
}

function renderPaymentTypes() {
  elements.paymentType.innerHTML = '';
}

function createFolderCard(category) {
  const card = document.createElement('div');
  card.className = 'folder-card';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = category.title;
  button.className = 'folder-button';
  button.addEventListener('click', event => {
    if (event.target.closest('.menu-edit-action')) return;
    openCategory(category.id);
  });
  card.appendChild(button);

  if (isMenuEditing) {
    const actions = document.createElement('div');
    actions.className = 'menu-edit-actions';

    const renameButton = document.createElement('button');
    renameButton.type = 'button';
    renameButton.className = 'menu-edit-action';
    renameButton.title = 'Переименовать папку';
    renameButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16z"/></svg>';
    renameButton.addEventListener('click', event => {
      event.stopPropagation();
      renameCategory(category);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'menu-edit-action danger';
    deleteButton.title = 'Удалить папку';
    deleteButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V5h6v2m-8 0 1 12h10l1-12"/></svg>';
    deleteButton.addEventListener('click', event => {
      event.stopPropagation();
      deleteCategory(category);
    });

    actions.appendChild(renameButton);
    actions.appendChild(deleteButton);
    card.appendChild(actions);
  }

  return card;
}

function buildMenuEntries() {
  const cacheKey = `${menuState.view}::${menuState.categoryId || 'root'}::${menuState.searchQuery}`;
  if (menuDataCache.has(cacheKey)) {
    return menuDataCache.get(cacheKey);
  }

  const parentCategory = getCurrentCategory();
  const rootCategory = categories.find(cat => cat.id === 'root');
  const visibleCategories = categories
    .filter(category => category.id !== 'root' && category.parentId === (parentCategory?.id || null))
    .sort(compareByName);

  let entries;
  let itemsCategoryForEditing = parentCategory;
  if (menuState.view === 'items' && parentCategory) {
    entries = [
      ...visibleCategories.map(category => ({ type: 'folder', data: category })),
      ...parentCategory.items.slice().sort(compareByName).map(item => ({ type: 'item', data: item }))
    ];
  } else if (menuState.view === 'folders' && !parentCategory) {
    entries = visibleCategories.map(category => ({ type: 'folder', data: category }));
    itemsCategoryForEditing = rootCategory;
  } else {
    entries = visibleCategories.map(category => ({ type: 'folder', data: category }));
  }

  const result = { entries, itemsCategoryForEditing };
  menuDataCache.set(cacheKey, result);
  return result;
}

function renderFolders() {
  if (!elements.folderList) {
    return;
  }
  
  elements.folderList.innerHTML = '';
  const { entries, itemsCategoryForEditing } = buildMenuEntries();
  const pageSize = 32;
  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
  const visibleEntries = entries.slice(0, Math.min(pageSize, entries.length));

  const folderGrid = document.createElement('div');
  folderGrid.className = 'item-grid';
  applyColumnLayout(folderGrid, visibleEntries.length);

  const fragment = document.createDocumentFragment();
  visibleEntries.forEach(entry => {
    if (entry.type === 'folder') {
      fragment.appendChild(createFolderCard(entry.data));
    } else {
      fragment.appendChild(createItemCard(entry.data, itemsCategoryForEditing));
    }
  });
  folderGrid.appendChild(fragment);
  elements.folderList.appendChild(folderGrid);

  if (totalPages > 1) {
    const pager = document.createElement('div');
    pager.className = 'item-pagination';
    for (let index = 1; index <= totalPages; index += 1) {
      const pageButton = document.createElement('button');
      pageButton.type = 'button';
      pageButton.textContent = index;
      pageButton.addEventListener('click', () => {
        const pageEntries = entries.slice((index - 1) * pageSize, index * pageSize);
        const newGrid = document.createElement('div');
        newGrid.className = 'item-grid';
        applyColumnLayout(newGrid, pageEntries.length);
        const pageFragment = document.createDocumentFragment();
        pageEntries.forEach(entry => {
          if (entry.type === 'folder') {
            pageFragment.appendChild(createFolderCard(entry.data));
          } else {
            pageFragment.appendChild(createItemCard(entry.data, itemsCategoryForEditing));
          }
        });
        newGrid.appendChild(pageFragment);
        elements.folderList.innerHTML = '';
        elements.folderList.appendChild(newGrid);
        document.getElementById('menu-header-pagination').innerHTML = '';
        document.getElementById('menu-header-pagination').appendChild(pager);
      });
      pager.appendChild(pageButton);
    }
    document.getElementById('menu-header-pagination').appendChild(pager);
  }
}

function queueMenuRender() {
  if (pendingRenderFrame) return;
  pendingRenderFrame = true;
  defer(() => {
    pendingRenderFrame = false;
    renderMenu();
  });
}

function renderMenu() {
  if (pendingSearchRender && menuState.view === 'search') {
    return;
  }
  elements.folderList.innerHTML = '';
  elements.menuPaginationZone.innerHTML = '';
  document.getElementById('menu-header-pagination').innerHTML = '';
  elements.menuSearchPanel.classList.toggle('hidden', menuState.view !== 'search');
  elements.menuSearchInput.value = menuState.searchQuery;
  if (elements.menuEditAddButton) {
    elements.menuEditAddButton.classList.toggle('hidden', !isMenuEditing);
  }
  if (elements.folderList) {
    elements.folderList.classList.toggle('hidden', false);
  }
  if (elements.menuAddPopover) {
    elements.menuAddPopover.classList.add('hidden');
  }

  if (menuState.view === 'search') {
    elements.menuTitle.textContent = 'Поиск товаров';
    elements.folderList.classList.remove('hidden');
    renderSearchResults();
    return;
  }

  if (menuState.view === 'items') {
    elements.menuTitle.textContent = '';
    renderFolders();
    return;
  }

  elements.menuTitle.textContent = '';
  renderFolders();
}

function createItemCard(item, category) {
  const card = document.createElement('div');
  card.className = `item-card${isMenuEditing ? ' menu-editable-card' : ''}`;
  if (!isMenuEditing) {
    card.addEventListener('click', () => {
      const normalizedName = String(item?.name || '').trim().toLowerCase();
      if (normalizedName === 'крошка') {
        openCustomAmountModal(item, category);
      } else if (isSafiaBarContext(category, item)) {
        openModifierSelectionModal(item, category);
      } else {
        addItem(item, category, '');
      }
    });
  } else {
    card.addEventListener('click', event => {
      event.stopPropagation();
    });
  }

  if (isMenuEditing) {
    const actions = document.createElement('div');
    actions.className = 'menu-edit-actions';

    const renameButton = document.createElement('button');
    renameButton.type = 'button';
    renameButton.className = 'menu-edit-action';
    renameButton.title = 'Переименовать позицию';
    renameButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16z"/></svg>';
    renameButton.addEventListener('click', event => {
      event.stopPropagation();
      renameItem(item, category);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'menu-edit-action danger';
    deleteButton.title = 'Удалить позицию';
    deleteButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V5h6v2m-8 0 1 12h10l1-12"/></svg>';
    deleteButton.addEventListener('click', event => {
      event.stopPropagation();
      deleteItem(item, category);
    });

    actions.appendChild(renameButton);
    actions.appendChild(deleteButton);
    card.appendChild(actions);
  }

  const row = document.createElement('div');
  row.className = 'item-row';

  const info = document.createElement('div');
  info.innerHTML = `<div class="item-name">${item.name}</div><div class="item-price">${formatPrice(item.price)}</div>${item.categoryTitle ? `<div class="item-category">${item.categoryTitle}</div>` : ''}`;

  row.appendChild(info);
  card.appendChild(row);
  return card;
}

function renderCategoryItems() {
  const category = categories.find(cat => cat.id === menuState.categoryId);
  if (!category) return;

  const pageSize = 32;
  const sortedItems = category.items.slice().sort(compareByName);
  const totalItems = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const visibleItems = sortedItems.slice(0, Math.min(pageSize, totalItems));

  const grid = document.createElement('div');
  grid.className = 'item-grid';
  applyColumnLayout(grid, visibleItems.length);
  visibleItems.forEach(item => {
    grid.appendChild(createItemCard(item, category));
  });

  elements.folderList.appendChild(grid);

  if (totalPages > 1) {
    const pager = document.createElement('div');
    pager.className = 'item-pagination';
    for (let index = 1; index <= totalPages; index += 1) {
      const pageButton = document.createElement('button');
      pageButton.type = 'button';
      pageButton.textContent = index;
      pageButton.addEventListener('click', () => {
        const pageItems = sortedItems.slice((index - 1) * pageSize, index * pageSize);
        const newGrid = document.createElement('div');
        newGrid.className = 'item-grid';
        applyColumnLayout(newGrid, pageItems.length);
        pageItems.forEach(pageItem => {
          newGrid.appendChild(createItemCard(pageItem, category));
        });
        elements.folderList.innerHTML = '';
        elements.folderList.appendChild(newGrid);
        elements.menuPaginationZone.innerHTML = '';
        elements.menuPaginationZone.appendChild(pager);
      });
      pager.appendChild(pageButton);
    }
    elements.menuPaginationZone.appendChild(pager);
  }
}

function renderSearchResults() {
  const query = menuState.searchQuery;
  elements.folderList.innerHTML = '';

  if (!query) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Введите название товара для поиска';
    elements.folderList.appendChild(empty);
    return;
  }

  const searchCacheKey = `search::${query}`;
  let matches = menuDataCache.get(searchCacheKey);
  if (!matches) {
    matches = itemsCatalog.filter(item => String(item.name || '').toLowerCase().includes(query)).sort(compareByName).slice(0, 20);
    menuDataCache.set(searchCacheKey, matches);
  }

  if (matches.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Товары не найдены';
    elements.folderList.appendChild(empty);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'item-grid columns-4 search-results-grid';
  grid.setAttribute('data-search-results', 'true');

  const fragment = document.createDocumentFragment();
  matches.forEach(item => {
    const targetCategory = categories.find(category => category.id === item.categoryId) || categories[0];
    fragment.appendChild(createItemCard(item, targetCategory));
  });
  grid.appendChild(fragment);
  elements.folderList.appendChild(grid);
}

function renderSelectedItems() {
  ensureActiveSelectedItem();
  const items = Object.values(selectedItems);
  renderSafiaExtraActions();
  elements.selectedList.innerHTML = '';
  elements.selectedActions.innerHTML = '';
  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Выберите товары в меню справа';
    elements.selectedList.appendChild(empty);
    elements.totalPrice.textContent = formatPrice(0);
    return;
  }

  let total = 0;
  const activeItem = selectedItems[activeSelectedItemId];
  if (activeItem) {
    const plusButton = document.createElement('button');
    plusButton.type = 'button';
    plusButton.className = 'action-button';
    plusButton.textContent = '+';
    plusButton.addEventListener('click', event => {
      event.stopPropagation();
      changeQuantity(activeItem.id, 1);
    });

    const minusButton = document.createElement('button');
    minusButton.type = 'button';
    minusButton.className = 'action-button';
    minusButton.textContent = '-';
    if (activeItem.quantity <= 1) {
      minusButton.disabled = true;
      minusButton.classList.add('disabled');
    }
    minusButton.addEventListener('click', event => {
      event.stopPropagation();
      changeQuantity(activeItem.id, -1);
    });

    const manualButton = document.createElement('button');
    manualButton.type = 'button';
    manualButton.className = 'action-button';
    manualButton.textContent = '123';
    manualButton.addEventListener('click', event => {
      event.stopPropagation();
      openQuantityModal(activeItem.id);
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'action-button';
    removeButton.textContent = '×';
    removeButton.addEventListener('click', event => {
      event.stopPropagation();
      delete selectedItems[activeItem.id];
      if (activeSelectedItemId === activeItem.id) {
        activeSelectedItemId = null;
      }
      renderSelectedItems();
    });

    const commentButton = document.createElement('button');
    commentButton.type = 'button';
    commentButton.className = 'action-button comment-action-button';
    commentButton.title = 'Комментарий';
    commentButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3V7a1 1 0 0 1 1-1Z" /></svg>';
    commentButton.addEventListener('click', event => {
      event.stopPropagation();
      openCommentModal(activeItem.id);
    });

    elements.selectedActions.appendChild(plusButton);
    elements.selectedActions.appendChild(minusButton);
    elements.selectedActions.appendChild(manualButton);
    elements.selectedActions.appendChild(removeButton);
    elements.selectedActions.appendChild(commentButton);
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = `selected-item${item.id === activeSelectedItemId ? ' active' : ''}`;
    card.addEventListener('click', () => selectSelectedItem(item.id));

    const row = document.createElement('div');
    row.className = 'selected-item-row';

    const title = document.createElement('div');
    title.className = 'selected-name';
    title.textContent = item.name;

    const tags = document.createElement('div');
    tags.className = 'selected-tags';

    if (item.isTakeaway) {
      const takeawayTag = document.createElement('div');
      takeawayTag.className = 'selected-tag selected-tag-takeaway';
      takeawayTag.textContent = 'На вынос';
      tags.appendChild(takeawayTag);
    }

    if (Number.isInteger(item.tableNumber) && item.tableNumber > 0) {
      const tableTag = document.createElement('div');
      tableTag.className = 'selected-tag selected-tag-table';
      tableTag.textContent = `№${item.tableNumber}`;
      tags.appendChild(tableTag);
    }

    const modifier = document.createElement('div');
    modifier.className = 'selected-modifier';
    modifier.textContent = item.selectedModifier || item.modifier || '';
    if (!modifier.textContent) {
      modifier.classList.add('hidden');
    }

    const comment = document.createElement('div');
    comment.className = 'item-comment';
    comment.textContent = item.comment || '';
    if (!comment.textContent) {
      comment.classList.add('hidden');
    }

    const footer = document.createElement('div');
    footer.className = 'selected-item-footer';

    const priceInfo = document.createElement('div');
    priceInfo.className = 'item-subtotal';
    priceInfo.textContent = `${formatPrice(item.price)} × ${item.quantity}`;

    const subtotal = document.createElement('div');
    subtotal.className = 'item-subtotal selected-total';
    subtotal.textContent = formatPrice(item.price * item.quantity);

    footer.appendChild(priceInfo);
    footer.appendChild(subtotal);

    row.appendChild(title);
    card.appendChild(row);
    if (tags.childElementCount) {
      card.appendChild(tags);
    }
    if (item.selectedModifier || item.modifier) {
      card.appendChild(modifier);
    }
    if (item.comment) {
      card.appendChild(comment);
    }
    card.appendChild(footer);
    elements.selectedList.appendChild(card);

    total += item.price * item.quantity;
  });

  elements.totalPrice.textContent = formatPrice(total);
}

function clearReceipts() {
  const confirmed = window.confirm('Удалить все сохранённые чеки?');
  if (!confirmed) return;
  savedReceipts = [];
  saveReceipts();
  getAndroidBridge()?.clearReceiptHistory();
  renderReceipts();
}

function createReceipt() {
  if (Object.keys(selectedItems).length === 0) {
    alert('Нельзя сохранить пустой чек.');
    return;
  }
  openPaymentModal();
}

function deleteActiveReceipt() {
  if (receipts.length <= 1) {
    return;
  }

  const currentIndex = receipts.findIndex(receipt => receipt.id === activeReceiptId);
  if (currentIndex === -1) {
    return;
  }

  const nextReceipt = receipts[currentIndex + 1] || receipts[currentIndex - 1];
  receipts = receipts.filter(receipt => receipt.id !== activeReceiptId);
  activeReceiptId = nextReceipt?.id || receipts[0]?.id;
  const nextActive = receipts.find(receipt => receipt.id === activeReceiptId);
  if (nextActive) {
    selectedItems = nextActive.items || {};
    paymentDraft = nextActive.payments || [];
  } else {
    selectedItems = {};
    paymentDraft = [];
  }
  activeSelectedItemId = null;
  activePaymentTypeId = paymentTypes[0]?.id || '';
  renderReceiptTabs();
  renderSelectedItems();
  renderPaymentActions();
}

function renderReceipts() {
  elements.receiptList.innerHTML = '';

  if (savedReceipts.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Еще нет сохраненных чеков.';
    elements.receiptList.appendChild(empty);
    elements.sumKaspi.textContent = formatPrice(0);
    elements.sumHalyk.textContent = formatPrice(0);
    elements.sumNalichka.textContent = formatPrice(0);
    elements.sumTotal.textContent = formatPrice(0);
    return;
  }

  function getHistoryPaymentAmount(receipt, payment) {
    if (payment.type !== 'nalichka') {
      return payment.amount;
    }
    const total = receipt.total;
    const other = receipt.payments.reduce((sum, p) => {
      if (p.type === 'nalichka' || p.type === 'tab') return sum;
      return sum + (Number(p.amount) || 0);
    }, 0);
    return Math.min(payment.amount, Math.max(0, total - other));
  }

  const combinedReceipts = savedReceipts.filter(receipt => getReceiptPayments(receipt, { excludeTab: true }).some(payment => ['kaspi', 'halyk', 'nalichka'].includes(payment.type)));

  const totals = { kaspi: 0, halyk: 0, nalichka: 0 };
  combinedReceipts.forEach(receipt => {
    getReceiptPayments(receipt, { excludeTab: true }).forEach(payment => {
      if (totals[payment.type] !== undefined) {
        totals[payment.type] += getHistoryPaymentAmount(receipt, payment);
      }
    });
  });
  elements.sumKaspi.textContent = formatPrice(totals.kaspi);
  elements.sumHalyk.textContent = formatPrice(totals.halyk);
  elements.sumNalichka.textContent = formatPrice(totals.nalichka);
  elements.sumTotal.textContent = formatPrice(totals.kaspi + totals.halyk + totals.nalichka);

  if (historyFilter === 'combined') {
    if (combinedReceipts.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Нет чеков для сводного отчета.';
      elements.receiptList.appendChild(empty);
      return;
    }
    renderCombinedReceipt(totals, combinedReceipts);
    return;
  }

  const filteredReceipts = savedReceipts.filter(receipt => historyFilter === 'all' || getReceiptPayments(receipt).some(payment => payment.type === historyFilter));

  if (filteredReceipts.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Нет чеков для выбранного фильтра.';
    elements.receiptList.appendChild(empty);
    return;
  }

  filteredReceipts.forEach(receipt => {
    const card = document.createElement('div');
    card.className = 'receipt-card';

    const header = document.createElement('div');
    header.className = 'receipt-header';

    const paymentBlock = document.createElement('div');
    paymentBlock.className = 'receipt-payment-block';
    const paymentRows = getReceiptPayments(receipt).map(payment => {
      const type = paymentTypes.find(item => item.id === payment.type);
      const amount = payment.type === 'nalichka' ? (
        (function(){
          const other = receipt.payments.reduce((s,p)=> p.type=== 'nalichka' || p.type==='tab' ? s : s + (Number(p.amount)||0), 0);
          return Math.min(payment.amount, Math.max(0, receipt.total - other));
        })()
      ) : payment.amount;
      const row = document.createElement('div');
      row.className = 'receipt-payment-row';
      const label = document.createElement('span');
      label.className = `receipt-type ${payment.type}`;
      label.textContent = type ? type.label : payment.type;
      const amountValue = document.createElement('span');
      amountValue.className = 'receipt-payment-amount';
      amountValue.textContent = formatPrice(amount);
      row.appendChild(label);
      row.appendChild(amountValue);
      return row;
    });
    paymentRows.forEach(row => paymentBlock.appendChild(row));

    const rightBlock = document.createElement('div');
    rightBlock.className = 'receipt-summary-block';
    const time = document.createElement('div');
    time.className = 'receipt-time';
    time.textContent = new Date(receipt.createdAt).toLocaleString('ru-RU');
    rightBlock.appendChild(time);

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'receipt-delete-button';
    del.title = 'Удалить чек';
    del.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M7 6l1 14h8l1-14"/><path d="M10 10v7"/><path d="M14 10v7"/></svg>';
    del.addEventListener('click', () => {
      const ok = window.confirm('Удалить этот чек?');
      if (!ok) return;
      savedReceipts = savedReceipts.filter(r => r.id !== receipt.id);
      saveReceipts();
      getAndroidBridge()?.deleteReceipt(receipt.id);
      renderReceipts();
    });
    rightBlock.appendChild(del);

    header.appendChild(paymentBlock);
    header.appendChild(rightBlock);

    const itemList = document.createElement('div');
    itemList.className = 'receipt-items';
    receipt.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'receipt-item';
      const modifierText = item.modifier || item.selectedModifier || '';
      const tagsMarkup = [
        item.isTakeaway ? '<div class="selected-tag selected-tag-takeaway">На вынос</div>' : '',
        Number.isInteger(item.tableNumber) && item.tableNumber > 0 ? `<div class="selected-tag selected-tag-table">№${item.tableNumber}</div>` : ''
      ].filter(Boolean).join('');
      row.innerHTML = `<div><div>${item.name} × ${item.quantity}</div>${tagsMarkup ? `<div class="selected-tags">${tagsMarkup}</div>` : ''}${modifierText ? `<div class="selected-modifier">${modifierText}</div>` : ''}${item.comment ? `<div class="receipt-comment">${item.comment}</div>` : ''}</div><div>${formatPrice(item.price * item.quantity)}</div>`;
      itemList.appendChild(row);
    });

    card.appendChild(header);
    card.appendChild(itemList);
    elements.receiptList.appendChild(card);
  });
}

function renderCombinedReceipt(totals, receipts = []) {
  elements.receiptList.innerHTML = '';
  const itemsMap = {};
  const sourceReceipts = receipts.length ? receipts : savedReceipts;
  sourceReceipts.forEach(receipt => {
    receipt.items.forEach(item => {
      const key = `${item.name}||${item.price}`;
      if (!itemsMap[key]) itemsMap[key] = { name: item.name, price: item.price, quantity: 0 };
      itemsMap[key].quantity += item.quantity;
    });
  });

  const items = Object.values(itemsMap).sort((a, b) => a.name.localeCompare(b.name, 'ru'));

  const card = document.createElement('div');
  card.className = 'receipt-card';

  const header = document.createElement('div');
  header.className = 'receipt-header';
  header.innerHTML = `
    <div>
      <div class="receipt-type combined">Сводный чек</div>
      <div class="item-subtotal">За все время</div>
    </div>
    <div class="item-name">Итого: ${formatPrice(totals.kaspi + totals.halyk + totals.nalichka)}</div>
  `;

  const itemList = document.createElement('div');
  itemList.className = 'receipt-items';
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'receipt-item';
    row.innerHTML = `<span>${item.name} × ${item.quantity}</span><span>${formatPrice(item.price * item.quantity)}</span>`;
    itemList.appendChild(row);
  });

  const footer = document.createElement('div');
  footer.className = 'receipt-footer';
  footer.innerHTML = `<div>Kaspi: ${formatPrice(totals.kaspi)}</div><div>Halyk: ${formatPrice(totals.halyk)}</div><div>Наличка: ${formatPrice(totals.nalichka)}</div>`;

  card.appendChild(header);
  card.appendChild(itemList);
  card.appendChild(footer);
  elements.receiptList.appendChild(card);
}

function setupEvents() {
  elements.tabCreate.addEventListener('click', () => setActivePage('create'));
  elements.tabHistory.addEventListener('click', () => setActivePage('history'));
  if (elements.brandToggle) {
    elements.brandToggle.addEventListener('click', toggleItemPriceVisibility);
  }
  bindModeSelectionButtons();
  elements.saveButton.addEventListener('click', createReceipt);
  elements.clearReceiptsButton.addEventListener('click', clearReceipts);
  elements.backButton.addEventListener('click', goBack);
  elements.searchButton.addEventListener('click', openSearch);
  elements.homeButton.addEventListener('click', goHome);
  elements.prevReceipt.addEventListener('click', prevReceipt);
  elements.nextReceipt.addEventListener('click', nextReceipt);
  elements.addReceipt.addEventListener('click', createNewReceipt);
  elements.deleteReceipt.addEventListener('click', deleteActiveReceipt);
  elements.menuSearchInput.addEventListener('input', event => handleSearchInput(event.target.value));
  elements.quantityModal.addEventListener('click', event => {
    if (event.target === elements.quantityModal) {
      closePaymentModal();
    }
  });
  elements.filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      historyFilter = button.dataset.filter;
      elements.filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
      renderReceipts();
    });
  });
}

function init() {
  if (appRole === 'kitchen') {
    elements.appShell?.classList.add('hidden');
    elements.kitchenPage?.classList.add('active');
    bindModeSelectionButtons();
    elements.kitchenOrdersButton?.addEventListener('click', () => { kitchenView = 'orders'; elements.kitchenOrdersButton.classList.add('active'); elements.kitchenHistoryButton.classList.remove('active'); renderKitchenReceipts(); });
    elements.kitchenHistoryButton?.addEventListener('click', () => { kitchenView = 'history'; elements.kitchenHistoryButton.classList.add('active'); elements.kitchenOrdersButton.classList.remove('active'); renderKitchenReceipts(); });
    renderKitchenReceipts();
    window.setInterval(() => {
      renderKitchenReceipts();
    }, 2000);
    return;
  }
  loadReceipts();
  setupEvents();
  renderPaymentTypes();
  renderReceiptTabs();
  initializeCatalog();
  renderSelectedItems();
  renderReceipts();
}

init();
