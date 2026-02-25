# Local POS Web (MVP)

Static, local-first POS web app built for strict MVP scope.

## Features (MVP only)
- Item CRUD (name + unit price)
- Cart (add item, qty edits, line unit price edits)
- Discount (flat or %), single tax rate
- Checkout with payment label (cash/card)
- Latest receipt view
- Transaction history
- localStorage persistence across refresh/reopen

## Tech
- Vite (static frontend)
- Vanilla JS modules
- localStorage persistence
- Vitest for tests

## Run locally
```bash
npm install
npm run dev
```
Open the URL shown by Vite.

## Build
```bash
npm run build
npm run preview
```
Build output is in `dist/`.

## Tests
```bash
npm test
```
Includes:
- Unit tests for pricing math
- Integration-style flow test (item -> cart -> checkout -> persistence)

## GitHub Pages Deployment (local build → gh-pages)
This repo supports one-command deploy from your machine.

1. Ensure GitHub Pages source is set to:
   - Branch: `gh-pages`
   - Folder: `/` (root)
2. Deploy:
```bash
npm run deploy
```

That command will:
- run a production build,
- copy `dist/` into `gh-pages`,
- push `gh-pages` to GitHub.

If deploying under a repo subpath, keep `base` in `vite.config.js` set to `/<repo-name>/`.

## MVP Limitations
- No backend or multi-device sync.
- No auth/roles.
- No inventory counts/stock deduction.
- No refunds, split payments, or advanced reporting.
- Browser storage can be cleared by user/browser.
