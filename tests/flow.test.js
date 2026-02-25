import { describe, it, expect } from 'vitest';
import { createPOSApp } from '../src/app.js';
import { createMemoryStorage } from '../src/storage.js';

describe('basic POS flow', () => {
  it('supports add item -> cart -> checkout -> persisted history', () => {
    const storage = createMemoryStorage();
    const app = createPOSApp({ storage });

    app.upsertItem({ name: 'Coffee', unitPrice: 4 });
    const itemId = app.state.items[0].id;

    app.addToCart(itemId);
    app.setQty(itemId, 2);
    app.setDiscount('percent', 10);
    app.setTaxRate(5);

    const tx = app.checkout('cash');
    expect(tx).toBeTruthy();
    expect(tx.totals.grandTotal).toBe(7.56);
    expect(app.state.cart.length).toBe(0);

    const reopened = createPOSApp({ storage });
    expect(reopened.state.transactions.length).toBe(1);
    expect(reopened.state.lastReceipt.totals.grandTotal).toBe(7.56);
  });
});
