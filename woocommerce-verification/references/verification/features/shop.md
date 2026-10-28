# Shop and product discovery

## Sub-features

- Shop archive and Product Catalog template output.
- Product cards and navigation to a single product.
- Merchant-authored Shop page content when the active implementation supports it.

## How to get to it (user POV)

Open the storefront Shop page. For merchant editing, use the assigned site's wp-admin entry point and navigate through Pages or Appearance → Editor according to the issue's affected surface.

## Driving it with Playwright

From the task worktree, run `woo-control doctor --browser playwright`. When `/shop/` resolves and the assigned site's product links use `/product/`, run `woo-control run shop --evidence tmp/verification/shop --browser playwright` for archive, card, and product navigation proof. With plain permalinks, use local Playwright on `/?post_type=product`, follow a rendered product link, and capture assertions and screenshots instead; the CLI recipe hardcodes pretty paths and fails there. Use local Playwright for issue-specific actions beyond the recipe; Host Chrome over CDP is a fallback only per the verification skill. When editing, verify the selected page/template identity before saving and wait for the save request to complete.

## Gotchas

- The Shop page and Product Catalog template are different entities; prove which one is active instead of inferring it from visible text.
- Classic and blockified archive templates can render Shop content differently.
- Category and tag archives can share Product Catalog structure but are not equivalent to the Shop archive.
- Restore page, template, theme, and product state changed during verification.
