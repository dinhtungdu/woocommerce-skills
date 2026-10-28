# WooCommerce Feature Map

Compact, verified user-surface memory for issue implementation. Read only the feature touched by the task.

| Feature | Entry | Verification state |
|---|---|---|
| Shop and product discovery | [shop.md](shop.md) | Baseline route and proof recipe defined; task-specific behavior must be verified live. |
| Mini-Cart | [mini-cart.md](mini-cart.md) | Storefront drawer, editor width path, responsive proof surfaces, and cleanup verified live. |
| Product Filters price currency display | [product-filter-price-currency.md](product-filter-price-currency.md) | Assigned-site LBP and USD evidence on Issue #67818; RTL rendering verified live. |

## Test-verified features

The [test-verified index](test-verified/README.md) contains 68 feature groups harvested from 193 WooCommerce Playwright specs on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. They provide source tests, routes, titles, and steps, and verify the behavior those tests assert. Assigned-site verification is required only for visual or manual behavior, mocks, environment differences, or claims outside those assertions.

After each successful verification, the task records whether this map remains accurate. Manager applies evidence-backed missing or stale entries proposed by the lead; task leads never edit this project context directly. Keep issue-specific selectors, fixtures, and conclusions in task artifacts rather than this map.
