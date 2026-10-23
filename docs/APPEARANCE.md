# Wizekin appearance

The Wizekin homepage defaults to a light sage/ivory composition. Product layouts are deliberately separate:

- CraftCost: warm clay and cream, editorial typography, grouped costing fieldsets and a receipt-shaped result.
- StockSimple: cool blue operations dashboard, compact inputs and segmented result tiles.
- LessonSheet: lilac paper-and-ink identity, a settings dock and paired question/answer previews.
- ClearQuote: its existing layout with a light teal default palette and complete theme support.

`public/studio-assets/themes.css` defines color tokens and the ClearQuote compatibility layer. `product-identities.css` defines the three new product compositions; `home.css` defines the brand homepage. Product styles use tokens rather than hard-coded theme surfaces. Guide pages use their parent product's identity.

`themes.js` applies a stored selection before initial rendering and adds an accessible nonmodal chooser. There are six choices: Studio light (the individual product's default), Warm paper, Midnight, Ocean, Forest, and Rose. The choice uses the browser-local `wizekin-appearance-v1` preference and follows navigation across this origin. If storage is unavailable, the chooser still changes the current page and explains that saving failed. Existing calculator and offline-workspace storage keys are not used.

On desktop, the chooser is a right-side tab and the panel stays within viewport height. On small screens it becomes a bottom-right palette button. The drawer supports close, Escape, outside click, focus restoration, pressed states and live selection feedback. Print styles hide the chooser and use light output colors.

All 17 homepage/product/guide pages include the same appearance assets once. Verification documents and the 404 page are untouched. Run `python3 scripts/check_portfolio.py` and the existing model checks before publishing. Browser QA should cover palette changes, cross-page persistence, 375px layout, chooser bounds and existing calculator/worksheet actions.

The downloadable offline v1.0 packages are separate artifacts and are not rewritten by this public website redesign.
