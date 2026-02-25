# QA Checklist (Milestone 0)

## Smoke
- [ ] App loads with empty state and no console errors.
- [ ] Can add item and see it in catalog.
- [ ] Can edit and delete item.
- [ ] Can add item to cart and update qty/line price.

## Pricing
- [ ] Flat discount subtracts correctly and never exceeds subtotal.
- [ ] Percent discount caps at 100%.
- [ ] Tax applies after discount.
- [ ] Totals display with currency precision (2 decimals).

## Checkout
- [ ] Cash checkout creates transaction and receipt.
- [ ] Card checkout creates transaction and receipt.
- [ ] Checkout clears cart.
- [ ] History entry appears after each checkout.

## Persistence
- [ ] Refresh retains catalog, cart, tax, history, latest receipt.
- [ ] Browser reopen restores same data.

## Regression/Edge
- [ ] Qty 0 removes line.
- [ ] Negative inputs do not create negative totals.
- [ ] Deleting an item removes it from cart lines.
