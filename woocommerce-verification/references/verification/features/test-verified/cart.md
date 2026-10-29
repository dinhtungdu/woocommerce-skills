# Cart

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- Add to Cart behavior
- Cart Store
- Merchant → Shipping
- Shopper → Cart Extension Callbacks
- Shopper → Cart block
- Shopper → Coupon
- Shopper → Notice Templates
- Shopper → Shipping
- Shopper → Taxes
- Shopper → Translations
- 1. With shipping methods for the default location, shipping methods for _any_ location, and local pickup enabled, the shopper sees shipping rates and pickup options - rates are selected default
- 10. With shipping methods for the default location, no shipping methods for _any_ other location, local pickup disabled, and shipping costs require address enabled, the shopper sees shipping rates only after entering an address
- 12. With no shipping methods for the default location, no shipping methods for _any_ other location, local pickup disabled, and shipping requires address enabled the shopper sees no shipping and no pickup rates
- 2. With shipping methods for the default location, shipping methods for _any_ location, local pickup disabled, and shipping costs requires address disabled, the shopper sees shipping rates only
- 4. With shipping methods for the default location, no shipping methods for _any_ other location, local pickup disabled, and shipping costs require address disabled, the shopper sees shipping rates only after entering an address
- 6. With no shipping methods for the default location, but shipping methods for _any_ other location, local pickup disabled, and shipping costs require address disabled, the shopper sees shipping rates only after entering an address
- 7. With no shipping methods for the default location, no shipping methods for _any_ other location, local pickup enabled the shopper sees local pickup rates only
- 8. With no shipping methods for the default location, no shipping methods for _any_ other location, local pickup disabled the shopper sees no shipping and no pickup rates
- 9. With shipping methods for the default location, shipping methods for _any_ other location, local pickup disabled and shipping requires address enabled, shopper sees shipping rates immediately.
- Custom error code creates exception
- Guest user does not see shipping rates until full address is entered
- Invalid callback namespace creates notice
- Logged in user can apply single-use coupon and place order
- Logged in user cannot apply single-use coupon twice
- Merchant can hide shipping costs before address is entered
- Products with updated prices should not display a discount label
- The discount label is only visible next to the discounted product
- User can proceed to checkout
- User can remove a product from cart
- User can see Cross-Sells products block

## How to get to it (user POV)

- Candidate route: `cart/`
- Candidate route: `shop`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/cart/cart-block.shopper.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/cart/cart-checkout-block-coupons.shopper.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/cart/cart-checkout-block-extension-callbacks.shopper.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/cart/cart-checkout-block-notices.shopper.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/cart/cart-checkout-block-notices.shopper.classic_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/cart/cart-checkout-block-shipping.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/cart/cart-checkout-block-taxes.shopper.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/cart/cart-checkout-block-translations.shopper.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/cart/cart-store.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/cart/add-to-cart.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/cart/cart.spec.ts`

Candidate test steps:

- add product to cart
- can add another product to cart
- can increase quantity
- can proceed to checkout and return
- can remove the first product
- can remove the last product
- click undo to restore product
- empty cart is displayed
- one product in cart is displayed
- remove product again after undo
- remove product and verify undo link appears
- verify undo link disappears after navigation

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
