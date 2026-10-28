# Product Image Gallery

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- ${ blockData.name } editor
- ${ blockData.name } frontend
- aligns the active slide when the gallery width is fractional
- can be migrated to the Product Gallery block
- should not switch to the next image when the user cursor is focused on the rating with keyboard
- should not switch to the next image when the user cursor is focused on the tabs with keyboard
- should switch to the next image when the user cursor is focused on tabs with touch event
- shows the Add to Cart + Options compatibility notice and can be migrated to the Product Gallery block

## How to get to it (user POV)

- Derive the user entry point from the source specs during live verification.

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/product-image-gallery/product-image-gallery.block_theme.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
