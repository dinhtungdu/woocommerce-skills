# Cart Store

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- Add to cart respects cart-line identity
- Mutation Batcher
- ProductButton in-cart count
- as a guest
- cross-cutting side effects fire once per cycle
- known-line quantity change (Mini-Cart stepper)
- variation handling (Add to Cart with Options)
- with a meta-differentiated line present
- without a meta-differentiated line
- Both a standalone and a meta line — only the standalone increments
- Existing standalone line — add increments it
- Genuine rejection (cart outcome) — leaves the cart unchanged and surfaces the error
- Meta line present, no standalone — add creates a new line, meta line unchanged, no error notice
- N concurrent successful adds fire each effect exactly once
- Not in cart — add creates a new line, no error notice
- Re-adding a variation increments its line; adding a different variation creates a new line
- Saved-for-later / wishlist meta-only add (cart outcome) — keyless add creates a new standalone line with no error notice
- Stepper updates the exact line with no spurious notice and no extra line
- a concurrent remove-only cycle fires one sync event and no legacy event
- a mixed successful/failed add cycle fires each effect once and preserves the failed item
- awaited calls produce separate batch requests
- cart state is correct after batched operations
- counts a child after its parent is removed from the Mini-Cart
- counts a child when its declared parent product is drafted
- counts a child whose declared parent is not in the cart
- does not count a child cart line in the add to cart button
- mixed sync and async calls produce expected batch grouping
- total batch failure rolls back product button UI to pre-failure state

## How to get to it (user POV)

- Candidate route: `/?add-to-cart=${ capId }`
- Candidate route: `/?add-to-cart=${ productId }`
- Candidate route: `/product/v-neck-t-shirt/`
- Candidate route: `/shop/`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/cart-store/cart-line-identity.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/cart-store/mutation-batcher.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/cart-store/parent-item-key.block_theme.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
