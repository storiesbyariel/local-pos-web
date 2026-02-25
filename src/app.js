import { computeTotals, clampMoney } from './pricing.js';
import { loadState, saveState } from './storage.js';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function money(v) {
  return `$${Number(v || 0).toFixed(2)}`;
}

export function createPOSApp({ storage = localStorage } = {}) {
  const state = loadState(storage);

  function persist() {
    saveState(state, storage);
  }

  function upsertItem({ id, name, unitPrice }) {
    const safeName = String(name || '').trim();
    const safePrice = clampMoney(Math.max(0, Number(unitPrice) || 0));
    if (!safeName) return;

    if (id) {
      const existing = state.items.find((x) => x.id === id);
      if (existing) {
        existing.name = safeName;
        existing.unitPrice = safePrice;
      }
    } else {
      state.items.push({ id: uid(), name: safeName, unitPrice: safePrice });
    }

    persist();
  }

  function deleteItem(itemId) {
    state.items = state.items.filter((x) => x.id !== itemId);
    state.cart = state.cart.filter((x) => x.itemId !== itemId);
    persist();
  }

  function addToCart(itemId) {
    const item = state.items.find((x) => x.id === itemId);
    if (!item) return;
    const line = state.cart.find((x) => x.itemId === itemId);
    if (line) line.qty += 1;
    else state.cart.push({ itemId, qty: 1, unitPrice: item.unitPrice });
    persist();
  }

  function setQty(itemId, qty) {
    const q = Math.max(0, Number(qty) || 0);
    const line = state.cart.find((x) => x.itemId === itemId);
    if (!line) return;
    if (q === 0) state.cart = state.cart.filter((x) => x.itemId !== itemId);
    else line.qty = q;
    persist();
  }

  function setLineUnitPrice(itemId, unitPrice) {
    const safePrice = clampMoney(Math.max(0, Number(unitPrice) || 0));
    const line = state.cart.find((x) => x.itemId === itemId);
    if (!line) return;
    line.unitPrice = safePrice;
    persist();
  }

  function setDiscount(type, value) {
    state.discountType = type === 'percent' ? 'percent' : 'flat';
    state.discountValue = clampMoney(Math.max(0, Number(value) || 0));
    persist();
  }

  function setTaxRate(value) {
    state.taxRate = clampMoney(Math.max(0, Number(value) || 0));
    persist();
  }

  function getCartDetailed() {
    return state.cart.map((line) => {
      const item = state.items.find((x) => x.id === line.itemId);
      return {
        ...line,
        name: item?.name || 'Deleted Item'
      };
    });
  }

  function checkout(paymentMethod) {
    const cartItems = getCartDetailed();
    if (cartItems.length === 0) return null;
    const totals = computeTotals(cartItems, state.discountType, state.discountValue, state.taxRate);
    const tx = {
      id: uid(),
      timestamp: new Date().toISOString(),
      paymentMethod: paymentMethod === 'card' ? 'card' : 'cash',
      items: cartItems,
      discountType: state.discountType,
      discountValue: state.discountValue,
      taxRate: state.taxRate,
      totals,
    };
    state.transactions.unshift(tx);
    state.lastReceipt = tx;
    state.cart = [];
    state.discountValue = 0;
    persist();
    return tx;
  }

  return {
    state,
    upsertItem,
    deleteItem,
    addToCart,
    setQty,
    setLineUnitPrice,
    setDiscount,
    setTaxRate,
    getCartDetailed,
    checkout
  };
}

export function mountPOS(root, { storage = localStorage } = {}) {
  const app = createPOSApp({ storage });
  let editingId = null;

  function render() {
    const cartDetailed = app.getCartDetailed();
    const totals = computeTotals(cartDetailed, app.state.discountType, app.state.discountValue, app.state.taxRate);

    root.innerHTML = `
      <main class="layout">
        <h1>Local POS MVP</h1>

        <section class="card">
          <h2>Item Catalog (CRUD)</h2>
          <form id="item-form">
            <input id="item-name" placeholder="Item name" required />
            <input id="item-price" type="number" min="0" step="0.01" placeholder="Unit price" required />
            <button type="submit">${editingId ? 'Update Item' : 'Add Item'}</button>
            ${editingId ? '<button type="button" id="cancel-edit">Cancel</button>' : ''}
          </form>
          <ul class="list">
            ${app.state.items.map((item) => `
              <li>
                <span>${item.name} (${money(item.unitPrice)})</span>
                <div class="row-actions">
                  <button data-action="add" data-id="${item.id}">Add to Cart</button>
                  <button data-action="edit" data-id="${item.id}">Edit</button>
                  <button data-action="delete" data-id="${item.id}">Delete</button>
                </div>
              </li>
            `).join('') || '<li>No items yet.</li>'}
          </ul>
        </section>

        <section class="card">
          <h2>Cart</h2>
          <ul class="list">
            ${cartDetailed.map((line) => `
              <li>
                <div>
                  <strong>${line.name}</strong><br />
                  Qty: <input data-action="qty" data-id="${line.itemId}" type="number" min="0" value="${line.qty}" />
                  Unit: <input data-action="price" data-id="${line.itemId}" type="number" min="0" step="0.01" value="${line.unitPrice}" />
                </div>
                <span>${money(line.qty * line.unitPrice)}</span>
              </li>
            `).join('') || '<li>Cart is empty.</li>'}
          </ul>

          <div class="controls">
            <label>
              Discount type
              <select id="discount-type">
                <option value="flat" ${app.state.discountType === 'flat' ? 'selected' : ''}>Flat ($)</option>
                <option value="percent" ${app.state.discountType === 'percent' ? 'selected' : ''}>Percent (%)</option>
              </select>
            </label>
            <label>
              Discount value
              <input id="discount-value" type="number" min="0" step="0.01" value="${app.state.discountValue}" />
            </label>
            <label>
              Tax rate (%)
              <input id="tax-rate" type="number" min="0" step="0.01" value="${app.state.taxRate}" />
            </label>
          </div>

          <div class="totals">
            <div>Subtotal: ${money(totals.subtotal)}</div>
            <div>Discount: -${money(totals.discountAmount)}</div>
            <div>Tax: ${money(totals.taxAmount)}</div>
            <div><strong>Total: ${money(totals.grandTotal)}</strong></div>
          </div>

          <div class="row-actions">
            <button id="checkout-cash">Checkout (Cash)</button>
            <button id="checkout-card">Checkout (Card)</button>
          </div>
        </section>

        <section class="card">
          <h2>Receipt (Latest)</h2>
          ${app.state.lastReceipt ? receiptMarkup(app.state.lastReceipt) : '<p>No receipt yet.</p>'}
        </section>

        <section class="card">
          <h2>Transaction History</h2>
          <ul class="list small">
            ${app.state.transactions.map((tx) => `
              <li>
                ${new Date(tx.timestamp).toLocaleString()} - ${tx.paymentMethod.toUpperCase()} - ${money(tx.totals.grandTotal)}
              </li>
            `).join('') || '<li>No transactions yet.</li>'}
          </ul>
        </section>
      </main>
    `;

    bindHandlers();
  }

  function receiptMarkup(tx) {
    return `
      <div class="receipt">
        <div>${new Date(tx.timestamp).toLocaleString()}</div>
        <div>Payment: ${tx.paymentMethod.toUpperCase()}</div>
        <ul>
          ${tx.items.map((line) => `<li>${line.name} x${line.qty} @ ${money(line.unitPrice)} = ${money(line.qty * line.unitPrice)}</li>`).join('')}
        </ul>
        <div>Subtotal: ${money(tx.totals.subtotal)}</div>
        <div>Discount: -${money(tx.totals.discountAmount)}</div>
        <div>Tax: ${money(tx.totals.taxAmount)}</div>
        <div><strong>Total: ${money(tx.totals.grandTotal)}</strong></div>
      </div>
    `;
  }

  function bindHandlers() {
    const itemForm = root.querySelector('#item-form');
    itemForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = root.querySelector('#item-name').value;
      const unitPrice = root.querySelector('#item-price').value;
      app.upsertItem({ id: editingId, name, unitPrice });
      editingId = null;
      render();
    });

    root.querySelector('#cancel-edit')?.addEventListener('click', () => {
      editingId = null;
      render();
    });

    root.querySelectorAll('button[data-action="add"]').forEach((btn) => btn.addEventListener('click', () => {
      app.addToCart(btn.dataset.id);
      render();
    }));

    root.querySelectorAll('button[data-action="delete"]').forEach((btn) => btn.addEventListener('click', () => {
      app.deleteItem(btn.dataset.id);
      render();
    }));

    root.querySelectorAll('button[data-action="edit"]').forEach((btn) => btn.addEventListener('click', () => {
      editingId = btn.dataset.id;
      const item = app.state.items.find((x) => x.id === editingId);
      if (item) {
        root.querySelector('#item-name').value = item.name;
        root.querySelector('#item-price').value = item.unitPrice;
      }
    }));

    root.querySelectorAll('input[data-action="qty"]').forEach((input) => input.addEventListener('change', () => {
      app.setQty(input.dataset.id, input.value);
      render();
    }));

    root.querySelectorAll('input[data-action="price"]').forEach((input) => input.addEventListener('change', () => {
      app.setLineUnitPrice(input.dataset.id, input.value);
      render();
    }));

    root.querySelector('#discount-type')?.addEventListener('change', (e) => {
      app.setDiscount(e.target.value, app.state.discountValue);
      render();
    });

    root.querySelector('#discount-value')?.addEventListener('change', (e) => {
      app.setDiscount(app.state.discountType, e.target.value);
      render();
    });

    root.querySelector('#tax-rate')?.addEventListener('change', (e) => {
      app.setTaxRate(e.target.value);
      render();
    });

    root.querySelector('#checkout-cash')?.addEventListener('click', () => {
      app.checkout('cash');
      render();
    });

    root.querySelector('#checkout-card')?.addEventListener('click', () => {
      app.checkout('card');
      render();
    });
  }

  render();
  return app;
}
