const KEY = 'local_pos_mvp_v1';

const defaultState = {
  items: [],
  cart: [],
  taxRate: 8,
  discountType: 'flat',
  discountValue: 0,
  transactions: [],
  lastReceipt: null,
};

export function loadState(storage = localStorage) {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      items: Array.isArray(parsed.items) ? parsed.items : [],
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
    };
  } catch {
    return structuredClone(defaultState);
  }
}

export function saveState(state, storage = localStorage) {
  storage.setItem(KEY, JSON.stringify(state));
}

export function createMemoryStorage() {
  const data = new Map();
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); },
    clear() { data.clear(); }
  };
}

export { KEY as STORAGE_KEY, defaultState };
