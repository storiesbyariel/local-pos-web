# MVP Scope (Milestone 0)

## In Scope
- Local-first single-page POS web app.
- Item catalog CRUD: create, read/list, update, delete.
- Cart: add item, edit quantity, edit line unit price, remove via qty=0.
- Pricing controls: discount (flat or percent), one global tax rate.
- Checkout with payment labels: cash or card.
- Receipt view for latest completed transaction.
- Transaction history list.
- Persistence across refresh/reopen using localStorage only.

## Out of Scope
- Backend/API/database server.
- Multi-user auth, permissions, syncing, cloud backup.
- Inventory tracking, barcode scanner, printer integration.
- Returns/refunds, split tender, tips, loyalty, reporting dashboard.

## Technical Constraints
- Static assets only; deployable to GitHub Pages.
- No PII assumptions; all data stored in browser storage.
