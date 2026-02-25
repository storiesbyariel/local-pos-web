# Interaction Spec (Milestone 0)

## Item CRUD
- Submit item form with empty name: ignored.
- Add item: appends catalog row.
- Edit item: preload form, submit updates same id.
- Delete item: removes from catalog and cart lines referencing that item.

## Cart
- Add to Cart from catalog:
  - If line exists: increment qty by 1.
  - Else create line with qty=1 and current item unit price.
- Qty input change:
  - qty <= 0 removes line.
  - qty > 0 updates line qty.
- Line unit price input updates only that line.

## Pricing
- Discount type: `flat` or `percent`.
- Flat discount capped at subtotal.
- Percent discount capped at 100%.
- Tax is applied to post-discount subtotal.

## Checkout
- Checkout blocked if cart empty.
- Checkout creates immutable transaction record with:
  - timestamp, payment method, cart snapshot, pricing config, totals.
- After checkout:
  - cart cleared
  - latest receipt updated
  - transaction prepended to history
  - discount value reset to 0 (type retained)

## Persistence
- All state saved after each mutation to localStorage key `local_pos_mvp_v1`.
- On load, state rehydrated with defaults for missing fields.
