# Product Filters counts and filter-data cache

## Sub-features

- Initial figures for Price, Attribute, Taxonomy, Rating, and Status filters, including option counts when **Show counts** is on.
- The shared filter-data cache and how its entries are filled, read, and invalidated.
- Store API collection data used by filter blocks.

## How to get to it (user POV)

Open a product archive that contains Product Filters, such as `/shop/` or `/product-category/<slug>/`. The Product Catalog and category templates are edited in **Appearance → Editor**.

## Driving it with HTTP and WP-CLI

- Create fixtures with `wp eval-file`: categories and simple products with a shared attribute, distinct prices, stock statuses, and colours, so each filter's figure shows which products it counted. Add an approved review when rating counts are in scope. Vary product status when visibility is in scope.
- Copy the Product Catalog template into the needed template, add the filters, and turn on `showCounts` for the Rating and Status filters.
- Log in each viewer over HTTP through `wp-login.php` with a cookie jar and confirm the `wordpress_logged_in_*` cookie. Use a visitor with no cookies, a customer, a shop manager, and an administrator.
- Read each filter block's server-rendered `data-wp-context` JSON for price range and counts, and record which fixture products the page lists.
- For cache behavior, clear the cache with `wp eval 'wc_get_container()->get( Automattic\WooCommerce\Internal\ProductFilters\CacheController::class )->invalidate_filter_data_cache();'`, load the page as one viewer, then read it as each other viewer. Repeat with the order reversed. The issue defines each viewer's expected figures.
- Cross-check with `/wp-json/wc/store/v1/products/collection-data?calculate_price_range=true&calculate_stock_status_counts=true&calculate_taxonomy_counts=product_cat&category=<term_id>`.
- For an upgrade path, fill the cache on base, switch to head without clearing it, and read again.

## Gotchas

- The filter cache is skipped when `WP_DEBUG` is on. Check `wp config get WP_DEBUG` and the object cache in use before trusting a cache result.
- The first viewer after invalidation owns the cache entry. Saving any product clears it.
- Empty results are not stored as cache hits, so a page with no visible products behaves differently from one with some.
- Store API prices are in minor units; `1000` is 10.00 in a two-decimal currency.
- The default Shop template does not enable counts for every filter; confirm `showCounts` before reading a null count as a result.
- The server-rendered context is the initial state only. Use a browser to verify the visible numbers after hydration.
- Not covered by this entry: external object caches, classic-theme widget areas, tag and brand filters, and visible browser output.
- Live evidence for this entry: assigned-site base-versus-head viewer matrix over HTTP, October 2026.
