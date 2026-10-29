# Product Filters

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- ${ blockData.name }
- Multiple instances
- Overlay
- With default display style
- With show counts enabled
- woocommerce/product-filter-active - Frontend
- woocommerce/product-filter-attribute - Frontend
- woocommerce/product-filters - Frontend
- Dropdown Core colors and borders override theme CSS and preserve separate corners
- Dropdown defaults allow theme CSS overrides in either load order
- Dropdown inherits and updates the ancestor background without explicit colors
- Dropdown summary retains active selections hidden by another filter
- Dropdown updates results on each checkbox selection and supports keyboard dismissal
- Escape dismisses the Dropdown before the filter overlay
- On mobile, overlay can be open and close.
- With attribute filters applied it shows the correct active filters
- With price filters applied it shows the correct active filters
- With rating filters applied it shows the correct active filters
- With stock filters applied it shows the correct active filters
- Without any filters selected, active block should not be rendered
- block is added in Editor
- filter is working inside overlay
- renders current product counts for every attribute
- selects and clears an attribute while keeping URL, products, and controls in sync
- should add correct layout CSS class when modifying layout settings
- should display the correct inspector layout controls
- should display the correct inspector style controls
- shows the Product Filters inner-block structure and List View names
- syncs active filters between Product Filters blocks

## How to get to it (user POV)

- Candidate route: `/shop`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/product-filters/active-filter-frontend.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-filters/attribute-filter-editor.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-filters/attribute-filter-frontend.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-filters/price-filter-editor.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-filters/product-filters-frontend.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-filters/product-filters.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-filters/rating-filter-editor.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-filters/removable-chips-editor.block_theme.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
