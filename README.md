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

## GitHub Pages Deployment
1. Push this folder to a GitHub repository.
2. In `package.json`, build is already `vite build` (works for root deployment).
3. Run local build to verify: `npm run build`.
4. Commit `dist/` only if your workflow requires it; otherwise use GitHub Actions Pages deploy.
5. In GitHub: **Settings → Pages**
   - Source: GitHub Actions (recommended) or Deploy from branch with built assets.
6. If deploying under a repo subpath, set `base` in `vite.config.js` to `/<repo-name>/`.

## MVP Limitations
- No backend or multi-device sync.
- No auth/roles.
- No inventory counts/stock deduction.
- No refunds, split payments, or advanced reporting.
- Browser storage can be cleared by user/browser.
