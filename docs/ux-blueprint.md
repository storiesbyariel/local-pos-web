# UX Blueprint (Milestone 0)

## Primary Screens (single-page sections)
1. **Item Catalog**
   - Form: item name + unit price.
   - List rows with actions: Add to Cart, Edit, Delete.
2. **Cart + Pricing**
   - Cart rows: item name, qty input, unit price input, line total.
   - Controls: discount type/value, tax rate.
   - Summary: subtotal, discount, tax, total.
   - Checkout buttons: Cash, Card.
3. **Receipt (Latest Transaction)**
   - Timestamp, payment method, line details, totals.
4. **Transaction History**
   - Reverse chronological list with datetime, payment method, total.

## UX Principles
- Fast entry with minimal clicks.
- Immediate recalculation after each cart/pricing change.
- Persistence-first: reopen browser and continue with saved data.
- No modal-heavy complexity for MVP.
