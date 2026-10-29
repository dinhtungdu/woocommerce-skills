# Product Collection linked-product collections

## Sub-features

- Product Collection blocks for **Upsells**, **Cross-Sells**, and **Related Products** that take a product reference.
- Server-rendered collections on pages and the single product template.
- The editor preview, which loads products through the WordPress REST API.

## How to get to it (user POV)

- Shoppers see Related Products and Upsells on a single product page from the theme's Single Product template.
- Merchants insert a Product Collection block, pick a linked-product collection, and choose the reference product in the inspector.

## Driving it with HTTP and Playwright

- Create fixtures with `wp eval-file`: published target products set as upsells and cross-sells and sharing a category, then reference products that link to them. Vary the reference product's status when status is in scope: `publish`, `draft`, `pending`, `private`, `future`, `trash`, and password-protected.
- Create one published page per reference with raw block markup: three `woocommerce/product-collection` blocks for `upsells`, `cross-sells`, and `related`, each with `query.productReference = <ref_id>`, its own `queryId`, a heading such as `COLL-<collection>`, and a `product-template` containing `post-title`.
- Server render: fetch `/?page_id=<page>` with `curl -L` and parse product titles inside each heading's section.
- Editor preview path: call `/wp-json/wp/v2/product?isProductCollectionBlock=true&productCollectionQueryContext[collection]=woocommerce/product-collection/<collection>&productReference=<ref_id>&per_page=50` with a REST nonce from `admin-ajax.php?action=rest-nonce`.
- Build a viewer matrix: guest, customer, a role with `read_private_products`, shop manager, and administrator. Record sorted titles per reference, collection, viewer, and surface, then diff base against head. The issue defines the expected titles per cell.
- Use published references and password-protected references as controls, and fetch the reference product's own single product page per viewer.
- Capture a logged-out full-page Playwright screenshot of a reference page when visible output matters.

## Gotchas

- `?page_id=` redirects to the pretty permalink; curl needs `-L`.
- Trashed fixtures need publishing first, then `wp_trash_post`. Future fixtures need a post date in the future.
- Staff and shoppers can legitimately see different results; keep a staff row in every matrix so the editor preview is proved to still work.
- When the plugin is symlinked to a checkout switched between revisions, wait longer than opcache `revalidate_freq` before the next request.
- Not covered by this entry: cross-sells in a real cart, order and email locations, and a browser editor session.
- Live evidence for this entry: assigned-site base-versus-head matrix of REST and server-rendered results, October 2026.
