# Order

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- Bulk edit orders
- Customer Review Request — Review Order page
- Edit order
- Edit order > Downloadable product permissions
- Order item quantity validation
- WooCommerce Merchant Flow: Orders > Customer Payment Page
- WooCommerce Orders > Add new order
- WooCommerce Orders > Apply Coupon
- WooCommerce Orders > Filter Order by Status
- WooCommerce Orders > Hidden columns on small screens
- WooCommerce Orders > Refund and restock an order item
- Keyboard — a text-only row sends focus to its rating and links the error
- Keyboard — dismissing the disabled-products notice keeps focus on the page
- Keyboard — submitting moves focus into the thank-you view
- Reflow — the page fits a 640px and a 320px viewport and stays operable
- Scenario 1 — happy path: rate a product, submit, see thank-you in place
- Scenario 2 — refresh after partial submit pre-fills the submitted row
- Star control — arrow keys follow the visual order and the fill tracks the selection
- Variations — submitting one variation leaves the sibling row open (per-variation tracking)
- Variations — two variations of one parent render two distinct rows with their attribute summaries
- WP-CLI preserves the pending rewrite flush only when the active theme is skipped
- can add a product without an extra click or rogue search box
- can add and delete order notes
- can add downloadable product permissions to order with product
- can add downloadable product permissions to order without product
- can apply a coupon
- can bulk update order status
- can copy billing address to shipping address
- can create a simple guest order
- can create an order for an existing customer

## How to get to it (user POV)

- Candidate route: `checkout/order-received/${ order.id }/?key=${ order.order_key }`
- Candidate route: `wp-admin/admin.php?page=wc-orders`
- Candidate route: `wp-admin/admin.php?page=wc-orders&action=edit&id=${ doubleClickOrderId }`
- Candidate route: `wp-admin/admin.php?page=wc-orders&action=edit&id=${ noProductOrderId }`
- Candidate route: `wp-admin/admin.php?page=wc-orders&action=edit&id=${ order.id }`
- Candidate route: `wp-admin/admin.php?page=wc-orders&action=edit&id=${ orderId }`
- Candidate route: `wp-admin/admin.php?page=wc-orders&action=edit&id=${ secondOrderId }`
- Candidate route: `wp-admin/admin.php?page=wc-orders&action=new`
- Candidate route: `wp-admin/edit.php?post_type=shop_order`
- Candidate route: `wp-admin/post.php?post=${ orderId }&action=edit`
- Candidate route: `wp-admin/post.php?post=${ orderToCancel }&action=edit`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/order/create-order.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/order/customer-payment-page.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/order/order-bulk-edit.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/order/order-coupon.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/order/order-edit.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/order/order-grace-period.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/order/order-item-quantity-validation.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/order/order-list-hidden-columns-small-screen.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/order/order-refund.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/order/order-status-filter.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/order/review-order-page.spec.ts`

Candidate test steps:

- Load the billing address and then copy it to the shipping address
- Load the billing and shipping addresses
- Load the customer payment page
- Open our second test order and select the customer we just created.
- Open our test order and select the customer we just created.
- Save the order and confirm addresses saved
- Select payment method and pay for the order
- Update the shipping method name
- Verify the order received page
- navigate to order confirmation page
- simulate cookies cleared, but within 10 minute grace period
- simulate cookies cleared, outside 10 minute window
- supply incorrect email address for the order, error
- supply the correct email address for the order, display order confirmation

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
