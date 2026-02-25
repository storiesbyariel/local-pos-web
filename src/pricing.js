export function clampMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function computeLineTotal(qty, unitPrice) {
  return clampMoney(Math.max(0, qty) * Math.max(0, unitPrice));
}

export function applyDiscount(subtotal, discountType, discountValue) {
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);
  const val = Math.max(0, Number(discountValue) || 0);
  let discountAmount = 0;

  if (discountType === 'percent') {
    discountAmount = safeSubtotal * Math.min(val, 100) / 100;
  } else {
    discountAmount = Math.min(val, safeSubtotal);
  }

  return {
    discountAmount: clampMoney(discountAmount),
    discountedSubtotal: clampMoney(safeSubtotal - discountAmount)
  };
}

export function computeTotals(cartItems, discountType, discountValue, taxRate) {
  const subtotal = clampMoney(cartItems.reduce((sum, item) => {
    return sum + computeLineTotal(item.qty, item.unitPrice);
  }, 0));

  const { discountAmount, discountedSubtotal } = applyDiscount(subtotal, discountType, discountValue);
  const safeTaxRate = Math.max(0, Number(taxRate) || 0);
  const taxAmount = clampMoney(discountedSubtotal * safeTaxRate / 100);
  const grandTotal = clampMoney(discountedSubtotal + taxAmount);

  return {
    subtotal,
    discountAmount,
    discountedSubtotal,
    taxAmount,
    grandTotal
  };
}
