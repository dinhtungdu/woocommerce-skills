# WooCommerce Feature Map

Compact, verified user-surface memory for issue implementation. Read only the feature touched by the task.

| Feature | Entry | Verification state |
|---|---|---|
| Shop and product discovery | [shop.md](shop.md) | Baseline route and proof recipe defined; task-specific behavior must be verified live. |
| Mini-Cart | [mini-cart.md](mini-cart.md) | Storefront drawer, editor width path, responsive proof surfaces, and cleanup verified live. |
| Product Filters price currency display | [product-filter-price-currency.md](product-filter-price-currency.md) | Assigned-site LBP and USD evidence on Issue #67818; RTL rendering verified live. |
| Product Filters counts and filter-data cache | [product-filter-counts-cache.md](product-filter-counts-cache.md) | Server-rendered filter figures and cache fill order across four viewers verified live over HTTP; browser output untested. |
| Product Collection linked-product collections | [product-collection-linked-products.md](product-collection-linked-products.md) | Upsells, Cross-Sells, and Related by reference status and viewer verified live over REST and server render; cart and editor UI untested. |
| Downloads and download permissions | [downloads.md](downloads.md) | Download handler links for guests and customers verified live over HTTP with the `force` method; admin screens untested. |
| Order tracking and order views | [order-tracking.md](order-tracking.md) | Tracking form, My Account view-order, and guest order-received verified live per viewer with HTTP and Playwright; REST untested. |

## Test-verified features

The [test-verified index](test-verified/README.md) contains 69 feature groups harvested from 201 WooCommerce Playwright specs on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. They provide source tests, routes, titles, and steps, and verify the behavior those tests assert. Assigned-site verification is required only for visual or manual behavior, mocks, environment differences, or claims outside those assertions.

After each successful live verification, the task checks whether this map remains accurate and proposes any missing or stale entry with its evidence. The weekly learning routine publishes accepted proposals; tasks never edit this map directly. Keep issue-specific selectors, fixtures, and conclusions in task artifacts rather than this map.
