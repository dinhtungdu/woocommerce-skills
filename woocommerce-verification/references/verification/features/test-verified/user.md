# User

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- can create a new ${ userData.role }
- can delete a customer
- can delete a shop manager
- can update customer data
- can update shop manager data

## How to get to it (user POV)

- Candidate route: `wp-admin/user-edit.php?user_id=${ customer.id }`
- Candidate route: `wp-admin/user-edit.php?user_id=${ manager.id }`
- Candidate route: `wp-admin/user-new.php`
- Candidate route: `wp-admin/users.php?s=${ userData.username }`
- Candidate route: `wp-admin/users.php?s=${ username }`
- Candidate route: `wp-login.php`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/user/users-create.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/user/users-manage.spec.ts`

Candidate test steps:

- confirm deletion
- copy shipping address from billing address
- create a new user
- hover the username and delete
- save the changes
- update billing address
- update user data
- verify the new user can login
- verify the new user is displayed in users list
- verify the updates
- verify the user was deleted
- verify you can access the new user edit page

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
