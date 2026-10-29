# Order tracking and order views

## Sub-features

- The `[woocommerce_order_tracking]` form and the order details it renders.
- The owner's My Account → View order page, including downloads, purchase notes, addresses, and Pay and Cancel actions for pending orders.
- The guest order-received page and its email verification step.
- Shipment tracking details from Fulfillments on the order views.

## How to get to it (user POV)

- A visitor opens a page containing the Order Tracking shortcode, enters the order ID and billing email, and selects **Track**.
- A logged-in customer opens `/my-account/view-order/<order_id>/`.
- A guest opens `/checkout/order-received/<order_id>/?key=<order_key>` in a fresh session.

## Driving it with HTTP and Playwright

- Create a page whose content is `<!-- wp:shortcode -->[woocommerce_order_tracking]<!-- /wp:shortcode -->`.
- Create fixtures with `wp eval-file`: a guest order and an account order for a `customer` user, in pending and completed states. Give them a downloadable product with a purchase note, a billing address, and a customer note so every detail type is present.
- Submit the form over HTTP: GET the page, read the `woocommerce-order-tracking-nonce` hidden field, then POST `orderid`, `order_email`, the nonce, and `track=Track`. For a logged-in viewer, first POST `log`, `pwd`, and `testcookie=1` to `wp-login.php` with a cookie jar.
- Build a viewer matrix: logged-out visitor, the order owner, and another customer, against guest and account orders in each state. For each cell, grep the response for item names, totals, order key, address, `download_file=` links, purchase note, customer note, and login prompt. Request any download link and record its status. The issue defines which details each viewer should see.
- Test the tracking page with and without a `?key=` parameter when the change involves order keys.
- With Playwright, fill `#orderid` and `#order_email`, submit `form.track_order`, and capture a full-page screenshot per matrix cell that matters.
- Check the neighbouring views as regressions: the owner's view-order page for pending and completed orders, and guest order-received after POSTing `email` and `verify=1` to its verification form.

## Gotchas

- Guest order-received shows the email verification form first; use a fresh cookie jar and POST the email to reach the order details.
- Block themes render order-received with blocks. Switch to a classic theme such as Storefront to exercise the shared PHP templates, then restore the theme.
- Shipment tracking only renders with `woocommerce_feature_fulfillments_enabled` set to `yes`. Restore the option afterwards.
- Downloads need an approved download directory and valid download IDs, or every link returns 403.
- When comparing base and head with committed changes, check out the base files explicitly and print the tested revision in the probe output; a no-op `git stash` silently tests head twice.
- Not covered by this entry: REST and Store API order routes, HPOS off, templates overridden by a theme, and the order-not-found error path.
- Live evidence for this entry: assigned-site base-versus-head runs with curl and Playwright screenshots, October 2026.
