# Shop

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- Cart > Redirect to cart from shop
- Search, browse by categories and sort items in the shop
- can redirect user to cart from detail page
- can redirect user to cart from shop page
- should let user browse products by categories
- should let user search the store
- should let user sort the products in the shop

## How to get to it (user POV)

- Candidate route: `shop/`
- Candidate route: `shop/?s=${ products[ 0 ].name }`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/shop/cart-redirection.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/shop/shop-search-browse-sort.spec.ts`

Candidate test steps:

- Ensure the category page contains all the relevant products
- Go to the shop and perform the search
- Open a product and browse to its category via the breadcrumb
- Sort by price high to low
- Sort by price low to high

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
