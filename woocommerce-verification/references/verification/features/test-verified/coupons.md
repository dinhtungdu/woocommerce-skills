# Coupons

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- Cart & Checkout Restricted Coupons
- Cart Block Applying Coupons
- Cart applying coupons
- Coupon management
- accepted coupon surfaces success in cart and checkout
- applies a coupon via the cart block form
- applies a coupon via the classic cart form
- can create a product-restricted coupon through the admin form
- email-restricted coupon can be used by the right customer but only once
- prevents cart block applying coupon with usage limit
- rejected coupon surfaces its error in cart and checkout

## How to get to it (user POV)

- Candidate route: `cart/`
- Candidate route: `wp-admin/post-new.php?post_type=shop_coupon`
- Candidate route: `wp-admin/post.php?post=${ coupon.id }&action=edit`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/coupons/cart-block-coupons.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/coupons/cart-checkout-coupons.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/coupons/cart-checkout-restricted-coupons.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/coupons/coupons.spec.ts`

Candidate test steps:

- cart
- checkout
- fill the rendered coupon form
- publish the coupon
- verify persisted product restriction

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
