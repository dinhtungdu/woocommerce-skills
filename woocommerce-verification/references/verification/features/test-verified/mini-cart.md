# Mini Cart

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- ${ blockData.name } Block
- ${ blockData.name } Block (admin)
- ${ blockData.name } Block (variation attributes)
- Merchant → Mini Cart
- Mini-Cart Block (item data - hidden trailing entries)
- Mini-Cart Block (item data - malformed trailing entries)
- Mini-Cart Block (item data - mixed trailing entries)
- Mini-Cart Block (item data)
- Mini-Cart: classic theme
- Shopper → Notices
- Shopper → Tax
- in FSE editor
- Shopper can add item to cart, and will not see a notice in the mini cart
- Shopper sees SSR error notice in mini cart when product goes out of stock
- User can see tax label and price including tax
- can be inserted in FSE area
- can only be inserted once
- opens the drawer when a classic AJAX add-to-cart button is clicked
- renders filled and empty views in the Mini-Cart template part
- should allow to proceed to the cart page
- should allow to proceed to the checkout page
- should allow to remove a product from the cart
- should allow to update the product quantity
- should close the drawer when clicking on the close button
- should close the drawer when clicking outside the drawer
- should decode HTML entities in item data values
- should decode entities in variation attributes rendered via data-wp-text
- should not render entity-encoded HTML tags as DOM elements
- should open the empty cart drawer
- should open the filled cart drawer

## How to get to it (user POV)

- Candidate route: `/?p=${ testPage.id }`
- Candidate route: `/product/test-variable/`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/mini-cart/mini-cart-block.merchant.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/mini-cart/mini-cart-block.shopper.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/mini-cart/mini-cart-item-data.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/mini-cart/mini-cart.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/mini-cart/mini-cart.classic_theme.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
