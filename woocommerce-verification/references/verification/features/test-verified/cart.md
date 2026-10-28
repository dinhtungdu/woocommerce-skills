# Cart

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

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
- Logged in user can apply single-use coupon and place order
- Merchant can hide shipping costs before address is entered
- Shopper can switch between shipping and local pickup while preserving the effective selected rate
- Shopper sees no matching rates until a complete address reveals the zone rate
- User can add, update, remove, and proceed from the cart
- User can see Cross-Sells products block
- User can update product quantity
- User can view translated Cart block
- User can view translated Checkout block
- can add and remove products, increase quantity and proceed to checkout - ${ name }
- can undo product removal in classic cart
- coupon inline notice is visible
- custom block notice templates, except for coupon errors, are visible by template overwrite
- default block notice templates, except for coupon errors, are visible by filter
- should be able to navigate and remove item from mini cart using keyboard
- should refresh nonce from Store API and use it for cart mutations

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

- Add product to cart and open mini cart
- Verify and interact with remove button
- Verify cart is empty
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
