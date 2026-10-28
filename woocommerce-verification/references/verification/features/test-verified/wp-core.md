# WordPress Core

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- Can create a new page
- Can create a new post
- can create new page
- can create new post
- logged-in customer can comment on a post

## How to get to it (user POV)

- Candidate route: `${ postSlug }/`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/wp-core/create-page.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/wp-core/create-post.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/wp-core/post-comments.spec.ts`

Candidate test steps:

- disable Jetpack comments if Jetpack is installed and active

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
