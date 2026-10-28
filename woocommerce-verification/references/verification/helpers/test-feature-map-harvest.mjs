#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { harvest } from "./feature-map-harvest.mjs";

const root = mkdtempSync(join(tmpdir(), "feature-map-harvest-"));
const tests = join(root, "plugins/woocommerce/tests/e2e/tests");
const output = join(root, "tmp/candidates");

try {
  mkdirSync(join(tests, "shop"), { recursive: true });
  mkdirSync(join(tests, "blocks/cart"), { recursive: true });
  writeFileSync(join(tests, "shop/search.spec.ts"), `test.describe( 'Browse shop', () => {\n  test( 'sort products', async ({ page }) => {\n    await test.step( 'Choose price order', async () => page.goto( 'shop/?orderby=price' ) );\n  } );\n} );\n`);
  writeFileSync(join(tests, "blocks/cart/cart.spec.ts"), "test( 'add an item', async ({ page }) => page.goto( `cart/` ) );\n");

  const verifiedRef = "a".repeat(40);
  const result = harvest(root, output, verifiedRef);
  assert.deepEqual({ specs: result.specs, candidates: result.candidates }, { specs: 2, candidates: 2 });
  const manifest = JSON.parse(readFileSync(join(output, "manifest.json"), "utf8"));
  assert.equal(manifest.verified_ref, verifiedRef);
  assert.deepEqual(manifest.candidates.map((item) => item.id), ["cart", "shop"]);
  assert.ok(manifest.candidates.every((item) => item.state === "test-verified"));
  const shop = readFileSync(join(output, "shop.md"), "utf8");
  assert.match(shop, /^# Shop$/m);
  assert.match(shop, /^## Sub-features$/m);
  assert.match(shop, /^## How to get to it \(user POV\)$/m);
  assert.match(shop, /^## Driving it with Playwright$/m);
  assert.match(shop, /^## Gotchas$/m);
  assert.match(shop, /sort products/);
  assert.match(shop, /shop\/\?orderby=price/);
  assert.match(shop, /test-verified on CI-gated trunk revision/);
  assert.throws(() => harvest(root, output, verifiedRef), /not empty/);
  console.log("feature map harvest: OK");
} finally {
  rmSync(root, { recursive: true, force: true });
}
