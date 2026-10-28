#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { lstat, mkdir, readFile, readdir, realpath, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const CDP_TIMEOUT_MS = 5_000;
const NAVIGATION_TIMEOUT_MS = 30_000;
const DEFAULT_CDP_URL = "http://127.0.0.1:9222";
const FEATURE = "shop";
const PRODUCT_LINK_SELECTOR = 'a[href*="/product/"]';

class WooControlError extends Error {
  constructor(message, kind = "runtime") {
    super(message);
    this.kind = kind;
  }
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.closing = false;
    socket.addEventListener("message", (event) => this.receive(event.data));
    socket.addEventListener("close", () => this.rejectPending(new Error("browser protocol connection closed")));
    socket.addEventListener("error", () => this.rejectPending(new Error("browser protocol connection failed")));
  }

  static async connect(url, timeout = CDP_TIMEOUT_MS) {
    let socket;
    try { socket = new WebSocket(url); }
    catch { throw new Error("browser protocol connection failed"); }
    await new Promise((accept, reject) => {
      const timer = setTimeout(() => {
        socket.close();
        reject(new Error("browser protocol connection timed out"));
      }, timeout);
      const done = (callback) => () => { clearTimeout(timer); callback(); };
      socket.addEventListener("open", done(accept), { once: true });
      socket.addEventListener("error", done(() => reject(new Error("browser protocol connection failed"))), { once: true });
    });
    return new CdpClient(socket);
  }

  receive(raw) {
    let message;
    try { message = JSON.parse(String(raw)); } catch { return; }
    if (message.id) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      clearTimeout(pending.timer);
      if (message.error) pending.reject(new Error(message.error.message || "browser protocol command failed"));
      else pending.resolve(message.result ?? {});
      return;
    }
    for (const listener of this.listeners.get(message.method) ?? []) listener(message.params ?? {});
  }

  send(method, params = {}, timeout = CDP_TIMEOUT_MS) {
    const id = this.nextId++;
    return new Promise((resolvePromise, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, timeout);
      this.pending.set(id, { resolve: resolvePromise, reject, timer });
      try { this.socket.send(JSON.stringify({ id, method, params })); }
      catch (error) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(error);
      }
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) ?? new Set();
    listeners.add(listener);
    this.listeners.set(method, listeners);
    return () => listeners.delete(listener);
  }

  waitFor(method, predicate = () => true, timeout = CDP_TIMEOUT_MS) {
    let remove;
    let timer;
    const promise = new Promise((resolvePromise, reject) => {
      remove = this.on(method, (params) => {
        if (!predicate(params)) return;
        clearTimeout(timer);
        remove();
        resolvePromise(params);
      });
      timer = setTimeout(() => {
        remove();
        reject(new Error(`${method} timed out`));
      }, timeout);
    });
    return { promise, cancel: () => { clearTimeout(timer); remove(); } };
  }

  rejectPending(error) {
    if (this.closing) return;
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
  }

  close() {
    this.closing = true;
    this.socket.close();
  }
}

function usage() {
  return `usage:
  woo-control doctor [--browser playwright|chrome]
  woo-control list
  woo-control site-url
  woo-control run shop --evidence <directory> [--browser playwright|chrome]`;
}

function chromeUnavailable() {
  return new WooControlError(
    "Chrome remote debugging is unavailable.\n\n" +
    "Use an authorized Chrome debugging session. Check WOO_CONTROL_CDP_URL " +
    "(default http://127.0.0.1:9222) and browser access before retrying.\n\n" +
    "Read-only endpoint check:\n\n  curl -fsS http://127.0.0.1:9222/json/version\n\n" +
    "Then run the project-owned verifier with doctor --browser chrome.",
    "chrome",
  );
}

async function findWooRoot(start) {
  let directory = resolve(start);
  while (true) {
    try {
      const packageJson = JSON.parse(await readFile(join(directory, "package.json"), "utf8"));
      if (packageJson.name === "woocommerce-monorepo") return directory;
    } catch (error) {
      if (error.code !== "ENOENT" && !(error instanceof SyntaxError)) throw error;
    }
    const parent = dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }
  throw new WooControlError("run this command from a WooCommerce task worktree");
}

function assignedSite(root, environment) {
  const script = environment.WOO_CONTROL_SITE_URL_SCRIPT;
  if (!environment.WOO_CONTROL_SITE_URL && !script) {
    throw new WooControlError("local setup must supply WOO_CONTROL_SITE_URL or WOO_CONTROL_SITE_URL_SCRIPT", "site");
  }
  if (!environment.WOO_CONTROL_SITE_DIR || !isAbsolute(environment.WOO_CONTROL_SITE_DIR)) {
    throw new WooControlError("local setup must supply an absolute WOO_CONTROL_SITE_DIR", "site");
  }
  const result = environment.WOO_CONTROL_SITE_URL
    ? { status: 0, stdout: environment.WOO_CONTROL_SITE_URL }
    : spawnSync(script, [], { cwd: root, encoding: "utf8", env: environment });
  if (result.error || result.status !== 0) {
    const detail = result.stderr?.trim();
    throw new WooControlError(`assigned task-site mapping is unavailable${detail ? `: ${detail}` : ""}`, "site");
  }
  const adminUrl = result.stdout.trim().split(/\r?\n/).at(-1);
  let parsed;
  try { parsed = new URL(adminUrl); } catch { throw new WooControlError("assigned task-site mapping returned an invalid URL", "site"); }
  if (!/^https?:$/.test(parsed.protocol) || !/\/wp-admin\/?$/.test(parsed.pathname)) {
    throw new WooControlError("assigned task-site mapping did not return a wp-admin URL", "site");
  }
  const siteUrl = new URL(parsed.href);
  siteUrl.pathname = siteUrl.pathname.replace(/\/wp-admin\/?$/, "/");
  siteUrl.search = "";
  siteUrl.hash = "";
  return { adminUrl: parsed.href, siteUrl: siteUrl.href, siteDir: environment.WOO_CONTROL_SITE_DIR };
}

async function verifyPluginLink(root, siteDir) {
  const link = join(siteDir, "wp-content/plugins/woocommerce");
  const expected = join(root, "plugins/woocommerce");
  let metadata;
  try { metadata = await lstat(link); }
  catch { throw new WooControlError(`WooCommerce plugin link is missing: ${link}`, "site"); }
  if (!metadata.isSymbolicLink()) throw new WooControlError(`WooCommerce plugin path is not a symlink: ${link}`, "site");
  let actualTarget;
  let expectedTarget;
  try { [actualTarget, expectedTarget] = await Promise.all([realpath(link), realpath(expected)]); }
  catch { throw new WooControlError("WooCommerce plugin symlink target is unavailable", "site"); }
  if (actualTarget !== expectedTarget) {
    throw new WooControlError(`WooCommerce plugin link targets ${actualTarget}, expected ${expectedTarget}`, "site");
  }
  return actualTarget;
}

function endpointUrl(environment) {
  let endpoint;
  try { endpoint = new URL(environment.WOO_CONTROL_CDP_URL || DEFAULT_CDP_URL); }
  catch { throw new WooControlError("WOO_CONTROL_CDP_URL is invalid", "usage"); }
  if (!/^https?:$/.test(endpoint.protocol)) throw new WooControlError("WOO_CONTROL_CDP_URL must use http or https", "usage");
  endpoint.pathname = endpoint.pathname.replace(/\/$/, "");
  endpoint.search = "";
  endpoint.hash = "";
  return endpoint;
}

function cdpHttpUrl(endpoint, path) {
  return new URL(path, `${endpoint.origin}/`);
}

function cdpWebSocketUrl(raw, endpoint) {
  const url = new URL(raw);
  if (["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
    url.hostname = endpoint.hostname;
    url.port = endpoint.port;
  }
  return url.href;
}

async function cdpJson(endpoint, path, options = {}) {
  let response;
  try {
    response = await fetch(cdpHttpUrl(endpoint, path), { ...options, signal: AbortSignal.timeout(CDP_TIMEOUT_MS) });
  } catch { throw chromeUnavailable(); }
  if (!response.ok) throw chromeUnavailable();
  try { return await response.json(); }
  catch { throw chromeUnavailable(); }
}

async function verifyBrowser(endpoint) {
  const version = await cdpJson(endpoint, "/json/version");
  if (typeof version.webSocketDebuggerUrl !== "string") throw chromeUnavailable();
  let client;
  try {
    client = await CdpClient.connect(cdpWebSocketUrl(version.webSocketDebuggerUrl, endpoint));
    const protocol = await client.send("Browser.getVersion");
    return { product: protocol.product || version.Browser || "unknown", protocol: protocol.protocolVersion || "unknown" };
  } catch { throw chromeUnavailable(); }
  finally { client?.close(); }
}

async function preflight(cwd, environment, browserMode, playwright) {
  const root = await findWooRoot(cwd);
  const site = assignedSite(root, environment);
  const plugin = await verifyPluginLink(root, site.siteDir);
  if (browserMode === "playwright") {
    const browser = await verifySiteInPlaywright(site.siteUrl, playwright);
    return { root, site, browser, plugin, browserMode };
  }
  const endpoint = endpointUrl(environment);
  const browser = await verifyBrowser(endpoint);
  await verifySiteInBrowser(endpoint, site.siteUrl);
  return { root, site, endpoint, browser, plugin, browserMode };
}

async function verifySiteInPlaywright(siteUrl, playwright) {
  let browser;
  try {
    browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();
    const response = await page.goto(siteUrl, { waitUntil: "load", timeout: NAVIGATION_TIMEOUT_MS });
    const actual = new URL(page.url());
    const expected = new URL(siteUrl);
    if (actual.origin !== expected.origin || !actual.pathname.startsWith(expected.pathname) || !response || response.status() >= 400) {
      throw new Error(response && response.status() >= 400 ? `HTTP ${response.status()}` : "browser could not load the assigned URL");
    }
    return { product: `Playwright Chromium ${browser.version()}`, protocol: "playwright" };
  } catch (error) {
    throw new WooControlError(`assigned task site is unavailable in Playwright: ${siteUrl} (${error.message})`, "site");
  } finally {
    await browser?.close();
  }
}

async function createTarget(endpoint) {
  const target = await cdpJson(endpoint, "/json/new?about:blank", { method: "PUT" });
  if (typeof target.id !== "string" || typeof target.webSocketDebuggerUrl !== "string") throw chromeUnavailable();
  return { ...target, webSocketDebuggerUrl: cdpWebSocketUrl(target.webSocketDebuggerUrl, endpoint) };
}

async function closeTarget(endpoint, id) {
  let response;
  try { response = await fetch(cdpHttpUrl(endpoint, `/json/close/${encodeURIComponent(id)}`), { signal: AbortSignal.timeout(CDP_TIMEOUT_MS) }); }
  catch { throw new WooControlError(`could not close browser tab ${id}`); }
  await response.body?.cancel();
  if (!response.ok) throw new WooControlError(`could not close browser tab ${id}`);
}

function attachDiagnostics(client) {
  const diagnostics = { console: [], runtime: [], network: [], http: [] };
  const requests = new Map();
  const boundedPush = (name, value) => { if (diagnostics[name].length < 200) diagnostics[name].push(value); };
  client.on("Runtime.consoleAPICalled", ({ type, args = [], stackTrace }) => boundedPush("console", {
    type,
    text: args.map((argument) => argument.value === undefined ? argument.description : String(argument.value)).join(" ").slice(0, 2_000),
    url: stackTrace?.callFrames?.[0]?.url || null,
  }));
  client.on("Runtime.exceptionThrown", ({ exceptionDetails = {} }) => boundedPush("runtime", {
    text: exceptionDetails.exception?.description || exceptionDetails.text || "runtime exception",
    url: exceptionDetails.url || null,
    line: exceptionDetails.lineNumber ?? null,
  }));
  client.on("Network.requestWillBeSent", ({ requestId, request }) => requests.set(requestId, request?.url || null));
  client.on("Network.loadingFinished", ({ requestId }) => requests.delete(requestId));
  client.on("Network.loadingFailed", ({ requestId, errorText, canceled, blockedReason }) => {
    boundedPush("network", {
      request_id: requestId, url: requests.get(requestId) || null, error: errorText,
      canceled: Boolean(canceled), blocked_reason: blockedReason || null,
    });
    requests.delete(requestId);
  });
  client.on("Network.responseReceived", ({ response = {} }) => {
    if (response.status >= 400) boundedPush("http", { url: response.url, status: response.status, status_text: response.statusText });
  });
  return diagnostics;
}

async function verifySiteInBrowser(endpoint, siteUrl) {
  const target = await createTarget(endpoint);
  let client;
  let failure;
  try {
    client = await CdpClient.connect(target.webSocketDebuggerUrl);
    await Promise.all([
      client.send("Page.enable"),
      client.send("Page.setLifecycleEventsEnabled", { enabled: true }),
      client.send("Runtime.enable"),
      client.send("Network.enable"),
    ]);
    const navigation = await navigate(client, siteUrl);
    const loadedUrl = await evaluate(client, "location.href");
    const expected = new URL(siteUrl);
    let actual;
    try { actual = new URL(loadedUrl); } catch {}
    if (!actual || actual.origin !== expected.origin || !actual.pathname.startsWith(expected.pathname) ||
        !Number.isFinite(navigation.status) || navigation.status >= 400) {
      throw new Error(Number.isFinite(navigation.status) && navigation.status >= 400 ? `HTTP ${navigation.status}` : "browser could not load the assigned URL");
    }
  } catch (error) {
    failure = new WooControlError(`assigned task site is unavailable in Chrome: ${siteUrl} (${error.message})`, "site");
  }
  client?.close();
  try { await closeTarget(endpoint, target.id); }
  catch (error) { failure ??= error; }
  if (failure) throw failure;
}

async function navigate(client, url) {
  const responses = new Map();
  const lifecycle = [];
  let navigation;
  let acceptLoad;
  let rejectLoad;
  const loaded = new Promise((accept, reject) => { acceptLoad = accept; rejectLoad = reject; });
  loaded.catch(() => {});
  const timer = setTimeout(() => rejectLoad(new Error("Page.lifecycleEvent timed out")), NAVIGATION_TIMEOUT_MS);
  const removeResponseListener = client.on("Network.responseReceived", ({ frameId, loaderId, type, response }) => {
    if (type === "Document") responses.set(`${frameId}:${loaderId}`, response);
  });
  const removeLifecycleListener = client.on("Page.lifecycleEvent", (event) => {
    lifecycle.push(event);
    if (navigation && event.name === "load" && event.frameId === navigation.frameId && event.loaderId === navigation.loaderId) {
      clearTimeout(timer);
      acceptLoad();
    }
  });
  try {
    navigation = await client.send("Page.navigate", { url }, NAVIGATION_TIMEOUT_MS);
    if (navigation.errorText) throw new Error(navigation.errorText);
    if (!navigation.frameId || !navigation.loaderId) throw new Error("browser did not start a top-level document load");
    if (lifecycle.some(({ frameId, loaderId, name }) =>
      name === "load" && frameId === navigation.frameId && loaderId === navigation.loaderId)) {
      clearTimeout(timer);
      acceptLoad();
    }
    await loaded;
    return { status: responses.get(`${navigation.frameId}:${navigation.loaderId}`)?.status ?? null };
  } catch (error) {
    throw new WooControlError(`navigation failed for ${url}: ${error.message}`);
  } finally {
    clearTimeout(timer);
    removeResponseListener();
    removeLifecycleListener();
  }
}

async function evaluate(client, expression) {
  const response = await client.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, CDP_TIMEOUT_MS);
  if (response.exceptionDetails) throw new WooControlError(response.exceptionDetails.exception?.description || response.exceptionDetails.text || "page evaluation failed");
  return response.result?.value;
}

async function screenshot(client, path) {
  const result = await client.send("Page.captureScreenshot", {
    format: "png", fromSurface: true, captureBeyondViewport: true,
  }, NAVIGATION_TIMEOUT_MS);
  if (typeof result.data !== "string") throw new WooControlError("browser did not return screenshot data");
  await writeFile(path, Buffer.from(result.data, "base64"), { mode: 0o600 });
}

async function stopTrace(client, path) {
  const completed = client.waitFor("Tracing.tracingComplete", () => true, NAVIGATION_TIMEOUT_MS);
  completed.promise.catch(() => {});
  try { await client.send("Tracing.end", {}, NAVIGATION_TIMEOUT_MS); }
  catch (error) { completed.cancel(); throw error; }
  const { stream } = await completed.promise;
  if (!stream) throw new WooControlError("browser did not return trace data");
  const chunks = [];
  while (true) {
    const chunk = await client.send("IO.read", { handle: stream }, NAVIGATION_TIMEOUT_MS);
    chunks.push(chunk.base64Encoded ? Buffer.from(chunk.data || "", "base64") : Buffer.from(chunk.data || "", "utf8"));
    if (chunk.eof) break;
  }
  await client.send("IO.close", { handle: stream });
  await writeFile(path, Buffer.concat(chunks), { mode: 0o600 });
}

function attachPlaywrightDiagnostics(page) {
  const diagnostics = { console: [], runtime: [], network: [], http: [] };
  const boundedPush = (name, value) => { if (diagnostics[name].length < 200) diagnostics[name].push(value); };
  page.on("console", (message) => boundedPush("console", { type: message.type(), text: message.text().slice(0, 2_000), url: message.location().url || null }));
  page.on("pageerror", (error) => boundedPush("runtime", { text: error.message, url: null, line: null }));
  page.on("requestfailed", (request) => boundedPush("network", {
    request_id: null, url: request.url(), error: request.failure()?.errorText || "request failed", canceled: false, blocked_reason: null,
  }));
  page.on("response", (response) => {
    if (response.status() >= 400) boundedPush("http", { url: response.url(), status: response.status(), status_text: response.statusText() });
  });
  return diagnostics;
}

async function playwrightNavigate(page, url) {
  try {
    const response = await page.goto(url, { waitUntil: "load", timeout: NAVIGATION_TIMEOUT_MS });
    return { status: response?.status() ?? null };
  } catch (error) {
    throw new WooControlError(`navigation failed for ${url}: ${error.message}`);
  }
}

function assertion(results, id, expected, actual, passed) {
  results.push({ id, status: passed ? "PASS" : "FAIL", expected, actual });
  if (!passed) throw new WooControlError(`${id}: expected ${expected}, got ${JSON.stringify(actual)}`);
}

async function runShop(context, evidenceDir) {
  await mkdir(evidenceDir, { recursive: true, mode: 0o700 });
  if ((await readdir(evidenceDir)).length) throw new WooControlError(`evidence directory is not empty: ${evidenceDir}`);
  const startedAt = new Date().toISOString();
  const assertions = [];
  const artifacts = { result: "result.json" };
  const target = await createTarget(context.endpoint);
  let client;
  let diagnostics = { console: [], runtime: [], network: [], http: [] };
  let failure;
  let traceStarted = false;
  let productUrl = null;

  try {
    client = await CdpClient.connect(target.webSocketDebuggerUrl);
    diagnostics = attachDiagnostics(client);
    await Promise.all([
      client.send("Page.enable"),
      client.send("Page.setLifecycleEventsEnabled", { enabled: true }),
      client.send("Runtime.enable"),
      client.send("Network.enable"),
    ]);
    await client.send("Tracing.start", {
      categories: "devtools.timeline,blink.user_timing,disabled-by-default-devtools.screenshot",
      transferMode: "ReturnAsStream",
    });
    traceStarted = true;

    const shopUrl = new URL("shop/", context.site.siteUrl).href;
    const shopNavigation = await navigate(client, shopUrl);
    const shop = await evaluate(client, `(() => {
      const links = [...document.querySelectorAll(${JSON.stringify(PRODUCT_LINK_SELECTOR)})]
        .map(link => ({ href: link.href, text: link.textContent.trim() }))
        .filter((link, index, all) => link.href && all.findIndex(other => other.href === link.href) === index);
      return {
        ready_state: document.readyState,
        url: location.href,
        title: document.title,
        heading: document.querySelector('h1')?.textContent.trim() || '',
        product_count: links.length,
        first_product: links[0] || null,
      };
    })()`);
    assertion(assertions, "shop-navigation", shopUrl, shop?.url, shop?.url === shopUrl);
    assertion(assertions, "shop-http-status", "200-399", shopNavigation.status, shopNavigation.status >= 200 && shopNavigation.status < 400);
    assertion(assertions, "shop-document-loaded", "complete", shop?.ready_state, shop?.ready_state === "complete");
    assertion(assertions, "shop-heading-present", "non-empty heading", shop?.heading, Boolean(shop?.heading));
    assertion(assertions, "shop-products-present", "at least one product link", shop?.product_count, Number.isSafeInteger(shop?.product_count) && shop.product_count > 0);
    await screenshot(client, join(evidenceDir, "shop.png"));
    artifacts.shop_screenshot = "shop.png";

    productUrl = shop.first_product.href;
    const productNavigation = await navigate(client, productUrl);
    const product = await evaluate(client, `(() => ({
      ready_state: document.readyState,
      url: location.href,
      heading: document.querySelector('h1')?.textContent.trim() || '',
      product_present: Boolean(document.querySelector('.product, .wp-block-woocommerce-product-details')),
    }))()`);
    assertion(assertions, "product-navigation", productUrl, product?.url, product?.url === productUrl);
    assertion(assertions, "product-http-status", "200-399", productNavigation.status, productNavigation.status >= 200 && productNavigation.status < 400);
    assertion(assertions, "product-heading-present", "non-empty heading", product?.heading, Boolean(product?.heading));
    assertion(assertions, "product-surface-present", true, product?.product_present, product?.product_present === true);
    await screenshot(client, join(evidenceDir, "product.png"));
    artifacts.product_screenshot = "product.png";
  } catch (error) {
    failure = error;
    if (client) {
      try { await screenshot(client, join(evidenceDir, "failure.png")); artifacts.failure_screenshot = "failure.png"; } catch {}
    }
  }

  if (client && traceStarted) {
    try {
      await stopTrace(client, join(evidenceDir, "trace.json"));
      artifacts.trace = "trace.json";
    } catch (error) { failure ??= error; }
  }
  client?.close();
  try { await closeTarget(context.endpoint, target.id); }
  catch (error) { failure ??= error; }

  const result = {
    schema_version: 1,
    feature: FEATURE,
    ok: !failure,
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    site_url: context.site.siteUrl,
    product_url: productUrl,
    assertions,
    diagnostics,
    artifacts,
    error: failure?.message || null,
  };
  await writeFile(join(evidenceDir, artifacts.result), `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  if (failure) throw new WooControlError(`shop verification failed: ${failure.message}; evidence: ${evidenceDir}`);
  return result;
}

async function runShopPlaywright(context, evidenceDir, playwright) {
  await mkdir(evidenceDir, { recursive: true, mode: 0o700 });
  if ((await readdir(evidenceDir)).length) throw new WooControlError(`evidence directory is not empty: ${evidenceDir}`);
  const startedAt = new Date().toISOString();
  const assertions = [];
  const artifacts = { result: "result.json" };
  let browser;
  let page;
  let diagnostics = { console: [], runtime: [], network: [], http: [] };
  let failure;
  let traceStarted = false;
  let productUrl = null;

  try {
    browser = await playwright.chromium.launch({ headless: true });
    page = await browser.newPage();
    diagnostics = attachPlaywrightDiagnostics(page);
    await page.context().tracing.start({ screenshots: true, snapshots: true });
    traceStarted = true;

    const shopUrl = new URL("shop/", context.site.siteUrl).href;
    const shopNavigation = await playwrightNavigate(page, shopUrl);
    const shop = await page.evaluate((selector) => {
      const links = [...document.querySelectorAll(selector)]
        .map(link => ({ href: link.href, text: link.textContent.trim() }))
        .filter((link, index, all) => link.href && all.findIndex(other => other.href === link.href) === index);
      return {
        ready_state: document.readyState, url: location.href, title: document.title,
        heading: document.querySelector("h1")?.textContent.trim() || "",
        product_count: links.length, first_product: links[0] || null,
      };
    }, PRODUCT_LINK_SELECTOR);
    assertion(assertions, "shop-navigation", shopUrl, shop?.url, shop?.url === shopUrl);
    assertion(assertions, "shop-http-status", "200-399", shopNavigation.status, shopNavigation.status >= 200 && shopNavigation.status < 400);
    assertion(assertions, "shop-document-loaded", "complete", shop?.ready_state, shop?.ready_state === "complete");
    assertion(assertions, "shop-heading-present", "non-empty heading", shop?.heading, Boolean(shop?.heading));
    assertion(assertions, "shop-products-present", "at least one product link", shop?.product_count, Number.isSafeInteger(shop?.product_count) && shop.product_count > 0);
    await page.screenshot({ path: join(evidenceDir, "shop.png"), fullPage: true });
    artifacts.shop_screenshot = "shop.png";

    productUrl = shop.first_product.href;
    const productNavigation = await playwrightNavigate(page, productUrl);
    const product = await page.evaluate(() => ({
      ready_state: document.readyState, url: location.href,
      heading: document.querySelector("h1")?.textContent.trim() || "",
      product_present: Boolean(document.querySelector(".product, .wp-block-woocommerce-product-details")),
    }));
    assertion(assertions, "product-navigation", productUrl, product?.url, product?.url === productUrl);
    assertion(assertions, "product-http-status", "200-399", productNavigation.status, productNavigation.status >= 200 && productNavigation.status < 400);
    assertion(assertions, "product-heading-present", "non-empty heading", product?.heading, Boolean(product?.heading));
    assertion(assertions, "product-surface-present", true, product?.product_present, product?.product_present === true);
    await page.screenshot({ path: join(evidenceDir, "product.png"), fullPage: true });
    artifacts.product_screenshot = "product.png";
  } catch (error) {
    failure = error;
    if (page) {
      try { await page.screenshot({ path: join(evidenceDir, "failure.png"), fullPage: true }); artifacts.failure_screenshot = "failure.png"; } catch {}
    }
  }

  if (traceStarted) {
    try {
      await page.context().tracing.stop({ path: join(evidenceDir, "trace.zip") });
      artifacts.trace = "trace.zip";
    } catch (error) { failure ??= error; }
  }
  try { await browser?.close(); }
  catch (error) { failure ??= error; }

  const result = {
    schema_version: 1,
    feature: FEATURE,
    ok: !failure,
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    site_url: context.site.siteUrl,
    product_url: productUrl,
    assertions,
    diagnostics,
    artifacts,
    error: failure?.message || null,
  };
  await writeFile(join(evidenceDir, artifacts.result), `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  if (failure) throw new WooControlError(`shop verification failed: ${failure.message}; evidence: ${evidenceDir}`);
  return result;
}

async function loadPlaywright(override, cwd) {
  if (override) return override;
  // pnpm links Playwright only into plugins/woocommerce, and ESM import() never searches global node_modules.
  const globalRoot = spawnSync("npm", ["root", "-g"], { encoding: "utf8" }).stdout?.trim();
  const bases = [join(cwd, "package.json"), join(cwd, "plugins", "woocommerce", "package.json")];
  if (globalRoot) bases.push(join(dirname(globalRoot), "noop.js"), join(globalRoot, "@playwright", "cli", "package.json"));
  for (const base of bases) {
    for (const name of ["playwright", "@playwright/test"]) {
      try {
        const module = await import(pathToFileURL(createRequire(base).resolve(name)).href);
        return module.chromium ? module : module.default; // CommonJS re-exports land on default
      } catch (error) {
        if (error.code !== "MODULE_NOT_FOUND") throw error;
      }
    }
  }
  try { return await import("playwright"); }
  catch { throw new WooControlError("Playwright is not installed in the task checkout, globally, or in the bundled CLI. Install it globally (npm i -g playwright) or run npm ci in the installed verification resource directory, then install its Chromium browser when authorized.", "playwright"); }
}

function parseBrowserArguments(args) {
  if (args.length === 0) return "playwright";
  if (args.length === 2 && args[0] === "--browser" && ["chrome", "playwright"].includes(args[1])) return args[1];
  throw new WooControlError(usage(), "usage");
}

function parseRunArguments(args) {
  if (args[0] !== FEATURE) throw new WooControlError(`unknown feature: ${args[0] || "(missing)"}\n${usage()}`, "usage");
  if (!args[2] || args[1] !== "--evidence") throw new WooControlError(usage(), "usage");
  return { evidenceDir: resolve(args[2]), browserMode: parseBrowserArguments(args.slice(3)) };
}

export async function main(args = process.argv.slice(2), options = {}) {
  const cwd = options.cwd || process.cwd();
  const environment = options.environment || process.env;
  if (args.length === 1 && ["--help", "-h"].includes(args[0])) {
    console.log(usage());
    return;
  }
  const command = args.shift();
  if (command === "list" && args.length === 0) {
    console.log("shop\tShop archive, product cards, and single-product navigation");
    return;
  }
  if (command === "site-url" && args.length === 0) {
    console.log(assignedSite(await findWooRoot(cwd), environment).adminUrl);
    return;
  }
  if (command === "doctor") {
    const browserMode = parseBrowserArguments(args);
    const playwright = browserMode === "playwright" ? await loadPlaywright(options.playwright, cwd) : null;
    const context = await preflight(cwd, environment, browserMode, playwright);
    console.log(`woo-control doctor: OK\nBrowser: ${context.browser.product}${context.endpoint ? `\nCDP: ${context.endpoint.href}` : ""}\nSite: ${context.site.siteUrl}\nWooCommerce: ${context.plugin}`);
    return;
  }
  if (command === "run") {
    const { evidenceDir, browserMode } = parseRunArguments(args);
    const playwright = browserMode === "playwright" ? await loadPlaywright(options.playwright, cwd) : null;
    const context = await preflight(cwd, environment, browserMode, playwright);
    const result = browserMode === "playwright"
      ? await runShopPlaywright(context, evidenceDir, playwright)
      : await runShop(context, evidenceDir);
    console.log(`woo-control run shop: PASS\nEvidence: ${join(evidenceDir, result.artifacts.result)}`);
    return;
  }
  throw new WooControlError(usage(), "usage");
}

const invokedPath = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`woo-control: ${message}`);
    process.exitCode = error?.kind === "usage" ? 2 : 1;
  });
}
