# Product Gallery

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- ${ blockData.name }
- Frontend navigation
- Product Gallery Thumbnails block
- Zoom while hovering setting
- block availability
- open pop-up when clicked option
- with previous and next buttons
- with thumbnails
- within pop-up
- Variable product gallery: classic Add to Cart Form preserves the parent gallery between variations
- Variable product gallery: featured → variation → cleared
- block has opinionated layout on mobile
- enables pop-up by default and opens it on the frontend
- is available only in supported Single Product contexts
- renders as expected
- selects thumbnails and keeps the active viewer in sync
- should be enabled by default
- should change the image when the user click on the previous or next button
- should display the same selected image when the pop-up is opened
- should not open dialog when the setting is disable on the frontend
- should not work on frontend when is disabled
- should persistently display the block when navigating back to the template without a page reload
- should work on frontend when is enabled
- thumbnail size settings work correctly
- thumbnails are scrollable and last thumbnail is reachable
- updates thumbnail selection during a native swipe

## How to get to it (user POV)

- Derive the user entry point from the source specs during live verification.

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/product-gallery/inner-blocks/product-gallery-large-image/product-gallery-large-image.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-gallery/inner-blocks/product-gallery-thumbnails/product-gallery-thumbnails.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-gallery/product-gallery.block_theme.spec.ts`

Candidate test steps:

- for selected image
- in editor
- in frontend
- styles are not applied to other images

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
