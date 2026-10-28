#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TESTS = "plugins/woocommerce/tests/e2e/tests";
const HERE = dirname(fileURLToPath(import.meta.url));
const FEATURES = resolve(HERE, "../features");

const fail = (message) => { throw new Error(message); };
const unique = (values) => [...new Set(values.filter(Boolean))].sort();
const escapeMarkdown = (value) => value.replaceAll("`", "\\`");
const title = (id) => id.split("-").map((word) => ({ api: "API", js: "JS", wp: "WordPress" }[word] ?? `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)).join(" ");

function options(argv) {
  const usage = "usage: feature-map-harvest.mjs [--repo PATH] [--output PATH] [--verified-ref SHA]";
  const result = { repository: process.cwd(), output: null, verifiedRef: null };
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index];
    const value = argv[index + 1];
    if (!value) fail(usage);
    if (option === "--repo") result.repository = resolve(value);
    else if (option === "--output") result.output = resolve(value);
    else if (option === "--verified-ref" && /^[a-f0-9]{40}$/i.test(value)) result.verifiedRef = value.toLowerCase();
    else fail(usage);
  }
  result.output ??= resolve(result.repository, "tmp/verification/feature-map-candidates");
  return result;
}

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return files(path);
    return entry.isFile() && /\.spec\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

function strings(source, expression) {
  return [...source.matchAll(expression)].map((match) => match[2].replace(/\\([\\'"`])/g, "$1").trim()).filter(Boolean);
}

function inspect(path, root) {
  const source = readFileSync(path, "utf8");
  const file = relative(root, path).replaceAll("\\", "/");
  const parts = file.split("/");
  const id = parts[0] === "blocks" && parts.length > 2 ? parts[1] : parts[0];
  return {
    id,
    file,
    suites: strings(source, /\btest\.describe(?:\.(?:only|skip))?\s*\(\s*(['"`])([^'"`\n]+)\1/g),
    tests: strings(source, /\btest(?:\.(?:only|skip|fixme))?\s*\(\s*(['"`])([^'"`\n]+)\1/g),
    steps: strings(source, /\btest\.step\s*\(\s*(['"`])([^'"`\n]+)\1/g),
    routes: strings(source, /\b(?:page\.)?goto\s*\(\s*(['"`])([^'"`\n]+)\1/g),
  };
}

function bullet(values, empty) {
  return values.length ? values.map((value) => `- ${value}`).join("\n") : `- ${empty}`;
}

function candidate(group, verifiedRef) {
  const tests = unique(group.flatMap((entry) => entry.tests));
  const suites = unique(group.flatMap((entry) => entry.suites));
  const steps = unique(group.flatMap((entry) => entry.steps));
  const routes = unique(group.flatMap((entry) => entry.routes));
  const sourceFiles = unique(group.map((entry) => entry.file));
  const paths = sourceFiles.map((file) => `\`${TESTS}/${file}\``);
  const status = verifiedRef
    ? `test-verified on CI-gated trunk revision \`${verifiedRef}\``
    : "test-defined; verify the exact-revision result before relying on it";
  return `# ${title(group[0].id)}\n\n> Status: ${status}. The cited tests verify the behavior they assert.\n\n## Sub-features\n\n${bullet([...suites, ...tests].slice(0, 30).map(escapeMarkdown), "No static Playwright titles were extracted; inspect the source specs.")}\n\n## How to get to it (user POV)\n\n${bullet(routes.slice(0, 20).map((route) => `Candidate route: \`${escapeMarkdown(route)}\``), "Derive the user entry point from the source specs during live verification.")}\n\n## Driving it with Playwright\n\nSource specs:\n\n${bullet(paths, "No source specs found.")}\n\nCandidate test steps:\n\n${bullet(steps.slice(0, 30).map(escapeMarkdown), "Use the source test titles and accessible selectors as the initial drive recipe.")}\n\nThe cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.\n\n## Gotchas\n\n- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.\n- Dynamic routes and generated fixture values require resolution before manual use.\n- Keep issue-specific selectors and conclusions in task artifacts.\n`;
}

export function harvest(repository, output, verifiedRef = null) {
  const testRoot = resolve(repository, TESTS);
  if (!existsSync(testRoot) || !statSync(testRoot).isDirectory()) fail(`WooCommerce Playwright tests not found at ${testRoot}`);
  if (existsSync(output) && readdirSync(output).length) fail(`output directory is not empty: ${output}`);
  mkdirSync(output, { recursive: true });
  const inspected = files(testRoot).sort().map((path) => inspect(path, testRoot));
  const grouped = Map.groupBy(inspected, (entry) => entry.id);
  const manifest = [...grouped.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([id, group]) => ({
    id,
    title: title(id),
    specs: group.length,
    tests: unique(group.flatMap((entry) => entry.tests)).length,
    state: verifiedRef ? "test-verified" : "test-defined",
    mapped: existsSync(join(FEATURES, `${id}.md`)),
    file: `${id}.md`,
  }));
  for (const item of manifest) writeFileSync(join(output, item.file), candidate(grouped.get(item.id), verifiedRef), "utf8");
  const rows = manifest.map((item) => `| [${item.title}](${item.file}) | ${item.specs} | ${item.tests} | ${item.mapped ? "existing map entry" : item.state} |`).join("\n");
  const provenance = verifiedRef
    ? `The cited tests are committed on CI-gated trunk revision \`${verifiedRef}\`; they verify the behavior they assert.`
    : "These drafts identify automated coverage; verify the exact-revision result before relying on it.";
  writeFileSync(join(output, "README.md"), `# WooCommerce ${verifiedRef ? "test-verified" : "test-backed"} Feature Map\n\nGenerated from \`${TESTS}\`. ${provenance} Use assigned-site verification only for visual/manual behavior, mocks, environment differences, or claims outside the assertions.\n\n| Feature | Specs | Tests | State |\n|---|---:|---:|---|\n${rows}\n`, "utf8");
  writeFileSync(join(output, "manifest.json"), `${JSON.stringify({ schema_version: 1, source: TESTS, verified_ref: verifiedRef, candidates: manifest }, null, 2)}\n`, "utf8");
  return { specs: inspected.length, candidates: manifest.length, mapped: manifest.filter((item) => item.mapped).length, verified_ref: verifiedRef, output };
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  try {
    const input = options(process.argv.slice(2));
    process.stdout.write(`${JSON.stringify(harvest(input.repository, input.output, input.verifiedRef))}\n`);
  } catch (error) {
    process.stderr.write(`feature-map-harvest: ${error.message}\n`);
    process.exitCode = 1;
  }
}
