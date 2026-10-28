# Mini-Cart

## Sub-features

- Storefront cart trigger and empty or filled drawer.
- Filled-cart line items, product details, quantity controls, removal, prices, and totals.
- Footer navigation to Cart and Checkout.
- Merchant-configurable drawer width in the Mini-Cart template part.

## How to get to it (user POV)

On a storefront whose header contains the Mini-Cart block, add a product when needed and select the cart item-count button to open the drawer. For merchant editing, open **Appearance → Editor**, open the **Mini-Cart** template part, select **Mini-Cart Contents**, and use **Settings → Dimensions** for drawer width.

## Driving it with Playwright

Run `woo-control doctor --browser playwright` from the exact task worktree. Use local Playwright on the assigned storefront and editor for Mini-Cart checks; a Shop CLI preflight is not required. Host Chrome over CDP is a fallback only per the verification skill. In the editor, use Document Overview to select **Mini-Cart Contents**, record the original width, change only the required value, save, and wait for explicit completion. Reload the storefront, use the accessible item-count button to open the drawer, and assert the dialog content. For responsive layout work, capture the configured width, viewport, computed grid and padding, element bounds, container ancestors, and `scrollWidth` versus `clientWidth` at each required width. Record console errors and the Store API cart response, then restore the original editor value and verify it after reload.

## Gotchas

- The editor preview uses sample products; it is not the storefront cart session.
- A filled-state check needs a live cart item. Preserve existing cart contents unless the task requires a fixture.
- When the viewport is narrower than the configured drawer width, the drawer fills the viewport; record both values.
- The drawer is attached outside Cart layout containers and uses a responsive `is-*` class. Do not assume Cart container-query behavior also applies to Mini-Cart; inspect actual container ancestors and computed styles.
- Canvas clicks often select an inner block. Use Document Overview and verify **Mini-Cart Contents** before changing Dimensions.
- Restore any changed template width and verify save completion and storefront reload.
- Accepted evidence for this entry: `pr-68912-mini-cart-verification-result.json`, `pr-68912-mini-cart-editor-before.png`, `pr-68912-mini-cart-editor-600.png`, `pr-68912-mini-cart-wide-600.png`, `pr-68912-mini-cart-narrow-360.png`, `pr-68912-mini-cart-wide-layout.json`, `pr-68912-mini-cart-narrow-layout.json`, and `pr-68912-mini-cart-cleanup.json`.
