import { describe, it, expect } from 'vitest';
import { computeTotals, applyDiscount } from '../src/pricing.js';

describe('pricing math', () => {
  it('computes flat discount and tax', () => {
    const totals = computeTotals(
      [{ qty: 2, unitPrice: 10 }, { qty: 1, unitPrice: 5 }],
      'flat',
      3,
      10
    );

    expect(totals.subtotal).toBe(25);
    expect(totals.discountAmount).toBe(3);
    expect(totals.taxAmount).toBe(2.2);
    expect(totals.grandTotal).toBe(24.2);
  });

  it('caps percent discount at 100%', () => {
    const out = applyDiscount(50, 'percent', 500);
    expect(out.discountAmount).toBe(50);
    expect(out.discountedSubtotal).toBe(0);
  });
});
