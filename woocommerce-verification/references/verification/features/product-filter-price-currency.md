# Product Filters price currency display

## Sub-features

- The Price Filter slider shows configured currency position for RTL-script symbols in editable inputs and read-only ranges.
- Active price-filter chips show the same position after changing the minimum price.
- Product Catalog editor preview mirrors storefront input and read-only views.
- Latin-currency input retains its original formatted value.

## How to get to it (user POV)

- Set WooCommerce Settings → General currency to Lebanese pound (LBP), position **Left with space**; open a storefront product catalog or the Product Catalog template containing Product Filters → Price Filter.
- Toggle **Show input fields** in the Price Filter block inspector for the read-only variant.

## Driving it with Playwright

- Use the assigned site's Shop archive (or `/?post_type=product` with plain permalinks) and Site Editor → Product Catalog. Assert visual prefix placement and numeric editable values.
- Enter a minimum price; assert URL, input, and active chip agree with no browser errors. Verify both read-only storefront and editor variants.
- Switch to USD and confirm the original input formatting remains. Restore currency and template settings.

## Gotchas

- The private Product Filters JS formatter takes over after hydration; PHP supplies initial strings. Browser state is needed to prove placement, not string assertions alone.
- Product Catalog template IDs vary by theme/site; find it through Site Editor, not a hard-coded ID.
- Assigned-site LBP input, read-only/chip, editor, edit round-trip, and USD regression evidence: Issue #67818 artifacts.
