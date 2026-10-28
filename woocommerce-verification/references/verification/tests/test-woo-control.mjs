import assert from "node:assert/strict";
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { main } from "../woo-control.mjs";

const temporary = mkdtempSync(join(tmpdir(), "woo-control-"));
const home = join(temporary, "home");
const worktree = join(temporary, "task");
const plugin = join(worktree, "plugins/woocommerce");
const sitePluginDirectory = join(home, "sites/task/wp-content/plugins");
const mappingScript = join(temporary, "site-url.sh");
const evidence = join(temporary, "evidence");
const originalFetch = globalThis.fetch;
const OriginalWebSocket = globalThis.WebSocket;
const originalLog = console.log;

mkdirSync(plugin, { recursive: true });
mkdirSync(sitePluginDirectory, { recursive: true });
writeFileSync(join(worktree, "package.json"), '{"name":"woocommerce-monorepo"}\n');
symlinkSync(plugin, join(sitePluginDirectory, "woocommerce"));
writeFileSync(mappingScript, "#!/bin/sh\nprintf 'http://site.test/task/wp-admin\\n'\n");
chmodSync(mappingScript, 0o755);

let chromeAvailable = true;
let siteAvailable = true;
let shopStatus = 200;
let traceFails = false;
let closedTargets = 0;
const logs = [];

const fakePlaywright = {
  chromium: {
    async launch() {
      let url = "about:blank";
      const tracing = {
        async start() {},
        async stop({ path }) { writeFileSync(path, "trace"); },
      };
      const page = {
        on() {},
        context: () => ({ tracing }),
        async goto(nextUrl) {
          url = nextUrl;
          return { status: () => 200 };
        },
        url: () => url,
        async evaluate() {
          if (url.includes("/product/widget/")) return {
            ready_state: "complete", url, heading: "Widget", product_present: true,
          };
          return {
            ready_state: "complete", url, title: "Shop", heading: "Shop", product_count: 1,
            first_product: { href: "http://site.test/task/product/widget/", text: "Widget" },
          };
        },
        async screenshot({ path }) { writeFileSync(path, "png"); },
      };
      return {
        version: () => "test",
        newPage: async () => page,
        async close() {},
      };
    },
  },
};

class FakeWebSocket extends EventTarget {
  constructor(url) {
    super();
    this.endpoint = String(url);
    this.pageUrl = "about:blank";
    this.navigationId = 0;
    queueMicrotask(() => this.dispatchEvent(new Event("open")));
  }

  message(value) {
    queueMicrotask(() => this.dispatchEvent(new MessageEvent("message", { data: JSON.stringify(value) })));
  }

  send(raw) {
    const request = JSON.parse(raw);
    const reply = (result = {}) => this.message({ id: request.id, result });
    const reject = (message) => this.message({ id: request.id, error: { message } });
    if (request.method === "Browser.getVersion") return reply({ product: "Chrome/Test", protocolVersion: "1.3" });
    if (request.method === "Page.navigate") {
      this.pageUrl = !siteAvailable && request.params.url === "http://site.test/task/"
        ? "chrome-error://chromewebdata/"
        : request.params.url;
      const loaderId = `loader-${++this.navigationId}`;
      reply({ frameId: "frame", loaderId });
      this.message({
        method: "Network.responseReceived",
        params: {
          frameId: "frame", loaderId, type: "Document",
          response: { url: request.params.url, status: request.params.url.endsWith("/shop/") ? shopStatus : 200, statusText: "OK" },
        },
      });
      this.message({ method: "Page.lifecycleEvent", params: { frameId: "frame", loaderId, name: "load" } });
      if (this.pageUrl.endsWith("/shop/")) {
        this.message({ method: "Runtime.consoleAPICalled", params: { type: "error", args: [{ value: "console failure" }] } });
        this.message({ method: "Runtime.exceptionThrown", params: { exceptionDetails: { text: "runtime failure" } } });
        this.message({ method: "Network.requestWillBeSent", params: { requestId: "request", request: { url: "http://site.test/failed" } } });
        this.message({ method: "Network.loadingFailed", params: { requestId: "request", errorText: "net failure" } });
        this.message({ method: "Network.responseReceived", params: { response: { url: "http://site.test/missing", status: 404, statusText: "Not Found" } } });
      }
      return;
    }
    if (request.method === "Runtime.evaluate") {
      if (request.params.expression === "location.href") return reply({ result: { value: this.pageUrl } });
      if (this.pageUrl.includes("/product/widget/")) {
        return reply({ result: { value: {
          ready_state: "complete",
          url: "http://site.test/task/product/widget/",
          heading: "Widget",
          product_present: true,
        } } });
      }
      return reply({ result: { value: {
        ready_state: "complete",
        url: "http://site.test/task/shop/",
        title: "Shop",
        heading: "Shop",
        product_count: 1,
        first_product: { href: "http://site.test/task/product/widget/", text: "Widget" },
      } } });
    }
    if (request.method === "Page.captureScreenshot") return reply({ data: Buffer.from("png").toString("base64") });
    if (request.method === "Tracing.end") {
      if (traceFails) return reject("trace failed");
      reply();
      this.message({ method: "Tracing.tracingComplete", params: { stream: "trace" } });
      return;
    }
    if (request.method === "IO.read") return reply({ data: '{"traceEvents":[]}', eof: true });
    reply();
  }

  close() {
    queueMicrotask(() => this.dispatchEvent(new Event("close")));
  }
}

globalThis.fetch = async (input, options = {}) => {
  const url = new URL(String(input));
  if (url.pathname === "/json/version") {
    if (!chromeAvailable) throw new Error("offline");
    return Response.json({ Browser: "Chrome/Test", webSocketDebuggerUrl: "ws://127.0.0.1:9222/devtools/browser/test" });
  }
  if (url.pathname === "/json/new") {
    return Response.json({ id: "target-1", webSocketDebuggerUrl: "ws://127.0.0.1:9222/devtools/page/target-1" });
  }
  if (url.pathname === "/json/close/target-1" && !options.method) {
    closedTargets += 1;
    return Response.json({ ok: true });
  }
  if (url.hostname === "site.test") return new Response("site", { status: 200 });
  throw new Error(`unexpected fetch: ${url}`);
};
globalThis.WebSocket = FakeWebSocket;
console.log = (message) => logs.push(String(message));

const environment = {
  ...process.env,
  HOME: home,
  WOO_CONTROL_CDP_URL: "http://127.0.0.1:9222",
  WOO_CONTROL_SITE_URL_SCRIPT: mappingScript,
  WOO_CONTROL_SITE_DIR: join(home, "sites/task"),
};

try {
  await main(["list"], { cwd: temporary, environment });
  assert.match(logs.pop(), /^shop\t/);

  chromeAvailable = false;
  await assert.rejects(main(["site-url"], { cwd: worktree, environment: {} }), /local setup must supply WOO_CONTROL_SITE_URL/);
  await assert.rejects(main(["site-url"], { cwd: worktree, environment: { WOO_CONTROL_SITE_URL: "http://site.test/wp-admin" } }), /absolute WOO_CONTROL_SITE_DIR/);
  await assert.rejects(main(["site-url"], { cwd: worktree, environment: { ...environment, WOO_CONTROL_SITE_DIR: "relative" } }), /absolute WOO_CONTROL_SITE_DIR/);
  await main(["site-url"], { cwd: worktree, environment: { ...environment, WOO_CONTROL_SITE_URL: "http://site.test/wp-admin" } });
  await assert.rejects(
    main(["doctor", "--browser", "chrome"], { cwd: worktree, environment }),
    /Chrome remote debugging is unavailable.*authorized Chrome debugging session.*WOO_CONTROL_CDP_URL.*curl -fsS http:\/\/127\.0\.0\.1:9222\/json\/version/s,
  );
  chromeAvailable = true;
  siteAvailable = false;
  await assert.rejects(
    main(["doctor", "--browser", "chrome"], { cwd: worktree, environment }),
    /assigned task site is unavailable in Chrome/,
  );
  siteAvailable = true;

  await main(["doctor", "--browser", "chrome"], { cwd: worktree, environment });
  assert.match(logs.pop(), /woo-control doctor: OK/);

  await main(["run", "shop", "--evidence", evidence, "--browser", "chrome"], { cwd: worktree, environment });
  assert.match(logs.pop(), /woo-control run shop: PASS/);
  assert.equal(closedTargets, 4);
  for (const name of ["shop.png", "product.png", "trace.json", "result.json"]) {
    assert.equal(existsSync(join(evidence, name)), true, name);
  }
  const result = JSON.parse(readFileSync(join(evidence, "result.json"), "utf8"));
  assert.equal(result.ok, true);
  assert.deepEqual(result.assertions.map(({ status }) => status), Array(9).fill("PASS"));
  assert.equal(result.diagnostics.console[0].text, "console failure");
  assert.equal(result.diagnostics.runtime[0].text, "runtime failure");
  assert.equal(result.diagnostics.network[0].error, "net failure");
  assert.equal(result.diagnostics.network[0].url, "http://site.test/failed");
  assert.equal(result.diagnostics.http[0].status, 404);
  assert.equal(result.artifacts.trace, "trace.json");

  shopStatus = 404;
  traceFails = true;
  const failedEvidence = join(temporary, "failed-evidence");
  await assert.rejects(
    main(["run", "shop", "--evidence", failedEvidence, "--browser", "chrome"], { cwd: worktree, environment }),
    /shop-http-status/,
  );
  assert.equal(closedTargets, 6);
  const failed = JSON.parse(readFileSync(join(failedEvidence, "result.json"), "utf8"));
  assert.equal(failed.ok, false);
  assert.equal(failed.assertions.find(({ id }) => id === "shop-http-status").status, "FAIL");
  assert.deepEqual(failed.artifacts, { result: "result.json", failure_screenshot: "failure.png" });
  assert.equal(existsSync(join(failedEvidence, "trace.json")), false);

  chromeAvailable = false;
  await main(["doctor"], { cwd: worktree, environment, playwright: fakePlaywright });
  assert.match(logs.pop(), /Browser: Playwright Chromium test/);
  const playwrightEvidence = join(temporary, "playwright-evidence");
  await main(["run", "shop", "--evidence", playwrightEvidence, "--browser", "playwright"], { cwd: worktree, environment, playwright: fakePlaywright });
  assert.match(logs.pop(), /woo-control run shop: PASS/);
  assert.equal(existsSync(join(playwrightEvidence, "trace.zip")), true);

  // Native mappings must bypass Linux mapping scripts but retain plugin ownership.
  const nativeEnvironment = {
    ...environment, HOME: join(temporary, "unrelated-home"),
    WOO_CONTROL_SITE_URL_SCRIPT: join(temporary, "missing-script"),
    WOO_CONTROL_SITE_URL: "http://site.test/task/wp-admin",
    WOO_CONTROL_SITE_DIR: join(home, "sites/task"),
  };
  await main(["doctor", "--browser", "playwright"], {
    cwd: worktree, environment: nativeEnvironment, playwright: fakePlaywright,
  });
  assert.match(logs.pop(), /woo-control doctor: OK/);
  await assert.rejects(main(["doctor", "--browser", "playwright"], {
    cwd: worktree, environment: { ...nativeEnvironment, WOO_CONTROL_SITE_DIR: join(temporary, "wrong-site") },
    playwright: fakePlaywright,
  }), /plugin link is missing/);

  // A global skill must load the target checkout's browser dependency.
  const taskBrowser = join(worktree, "node_modules/playwright");
  mkdirSync(taskBrowser, { recursive: true });
  writeFileSync(join(taskBrowser, "package.json"), '{"name":"playwright","type":"module","exports":"./index.mjs"}');
  writeFileSync(join(taskBrowser, "index.mjs"), 'export const chromium = { launch() { throw new Error("target-checkout-browser-loaded"); } };');
  await assert.rejects(main(["doctor", "--browser", "playwright"], {
    cwd: worktree, environment: nativeEnvironment,
  }), /target-checkout-browser-loaded/);

  console.log = originalLog;
  console.log("woo-control: OK");
} finally {
  globalThis.fetch = originalFetch;
  globalThis.WebSocket = OriginalWebSocket;
  console.log = originalLog;
  rmSync(temporary, { recursive: true, force: true });
}
