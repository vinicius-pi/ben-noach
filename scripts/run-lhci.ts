import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const port = process.env.LHCI_PORT ?? "4173";
const origin = `http://127.0.0.1:${port}`;
const base = `${origin}/ben-noach`;
const outDir = join(root, "lhci");
const evidencePath = join(root, "docs", "evidence", "lighthouse.md");

const MIN_SCORE = {
  performance: 0.9,
  accessibility: 0.95,
  "best-practices": 0.9,
  seo: 0.9,
} as const;

type Form = "desktop" | "mobile";

const RUNS: { slug: string; url: string; form: Form }[] = [
  { slug: "home-desktop", url: `${base}/en/`, form: "desktop" },
  { slug: "reader-desktop", url: `${base}/en/read/genesis/1/`, form: "desktop" },
  { slug: "reader-mobile", url: `${base}/en/read/genesis/1/`, form: "mobile" },
];

function resolveChrome(): string {
  const candidates = [
    process.env.CHROME_PATH,
    (() => {
      try {
        return chromium.executablePath();
      } catch {
        return "";
      }
    })(),
    "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ].filter((value): value is string => Boolean(value));
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(
      "Chrome not found. Set CHROME_PATH or run `pnpm exec playwright install chromium`.",
    );
  }
  return found;
}

function resolveLighthouse(): string {
  try {
    const require = createRequire(join(root, "node_modules/@lhci/cli/package.json"));
    return require.resolve("lighthouse/cli/index.js");
  } catch {
    const nested = join(root, "node_modules/.pnpm/node_modules/.bin/lighthouse");
    if (existsSync(nested)) return nested;
    throw new Error("lighthouse CLI not found (expected via @lhci/cli).");
  }
}

async function waitFor(url: string, attempts = 80): Promise<void> {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* still booting */
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`preview did not become ready at ${url}`);
}

function killPort(): void {
  spawnSync("sh", ["-c", `fuser -k ${port}/tcp >/dev/null 2>&1 || true`], { stdio: "ignore" });
}

type CategoryScores = Record<keyof typeof MIN_SCORE, number>;

type Report = {
  slug: string;
  url: string;
  form: Form;
  categories: CategoryScores;
  fcp: string;
  lcp: string;
  cls: string;
  bytes: string;
};

function readScores(jsonPath: string, slug: string, url: string, form: Form): Report {
  const lhr = JSON.parse(readFileSync(jsonPath, "utf8")) as {
    categories: Record<string, { score: number | null }>;
    audits: Record<string, { displayValue?: string; numericValue?: number }>;
  };
  const categories = {
    performance: lhr.categories.performance?.score ?? 0,
    accessibility: lhr.categories.accessibility?.score ?? 0,
    "best-practices": lhr.categories["best-practices"]?.score ?? 0,
    seo: lhr.categories.seo?.score ?? 0,
  };
  return {
    slug,
    url,
    form,
    categories,
    fcp: lhr.audits["first-contentful-paint"]?.displayValue ?? "n/a",
    lcp: lhr.audits["largest-contentful-paint"]?.displayValue ?? "n/a",
    cls: lhr.audits["cumulative-layout-shift"]?.displayValue ?? "n/a",
    bytes: lhr.audits["total-byte-weight"]?.displayValue ?? "n/a",
  };
}

function formatScore(score: number): string {
  return String(Math.round(score * 100));
}

function writeEvidence(reports: Report[], chrome: string): void {
  const lines = [
    "# Lighthouse evidence",
    "",
    `Chrome: \`${chrome}\``,
    "Runner: `lighthouse` CLI (`scripts/run-lhci.ts`), not `lhci autorun`.",
    "Flags: `--headless=new --no-sandbox --disable-dev-shm-usage`.",
    "Thresholds: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90.",
    "",
    "| Page | Form | P | A | BP | SEO | FCP | LCP | CLS | Bytes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const report of reports) {
    const c = report.categories;
    lines.push(
      `| ${report.slug} | ${report.form} | ${formatScore(c.performance)} | ${formatScore(c.accessibility)} | ${formatScore(c["best-practices"])} | ${formatScore(c.seo)} | ${report.fcp} | ${report.lcp} | ${report.cls} | ${report.bytes} |`,
    );
  }
  lines.push(
    "",
    "JSON/HTML reports: `lhci/` (gitignored).",
    "",
    "Lighthouse may log CSP violations from styles it injects into the page. Those are auditor artifacts, not shipped product styles. Product React islands do not use inline `style=` attributes.",
    "",
  );
  mkdirSync(join(root, "docs", "evidence"), { recursive: true });
  writeFileSync(evidencePath, `${lines.join("\n")}\n`);
}

if (!existsSync(join(root, "dist"))) {
  console.error("lhci: dist/ missing — run pnpm build first");
  process.exit(1);
}

const chrome = resolveChrome();
const lighthouse = resolveLighthouse();
mkdirSync(outDir, { recursive: true });
killPort();

const preview = spawn(
  "pnpm",
  ["exec", "astro", "preview", "--host", "127.0.0.1", "--port", port, "--force"],
  {
    stdio: "inherit",
    env: process.env,
  },
);

let failed = false;
const reports: Report[] = [];

try {
  await waitFor(`${base}/en/`);
  for (const run of RUNS) {
    const outputPath = join(outDir, run.slug);
    const args = [
      lighthouse,
      run.url,
      "--output=json",
      "--output=html",
      `--output-path=${outputPath}`,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--skip-audits=uses-http2",
      `--chrome-path=${chrome}`,
      "--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage --disable-gpu",
      "--quiet",
    ];
    if (run.form === "desktop") {
      args.push("--preset=desktop");
    } else {
      args.push(
        "--form-factor=mobile",
        "--screenEmulation.mobile",
        "--screenEmulation.width=390",
        "--screenEmulation.height=844",
        "--screenEmulation.deviceScaleFactor=3",
        "--throttling-method=simulate",
      );
    }
    console.log(`lighthouse ${run.slug} ${run.url}`);
    const result = spawnSync(process.execPath, args, {
      stdio: "inherit",
      env: { ...process.env, CHROME_PATH: chrome },
    });
    if (result.status !== 0) {
      console.error(`lighthouse failed for ${run.slug}`);
      failed = true;
      continue;
    }
    const jsonPath = `${outputPath}.report.json`;
    const report = readScores(jsonPath, run.slug, run.url, run.form);
    reports.push(report);
    for (const [category, min] of Object.entries(MIN_SCORE) as [keyof typeof MIN_SCORE, number][]) {
      const score = report.categories[category];
      const ok = score >= min;
      console.log(
        `  ${category}: ${formatScore(score)} ${ok ? "ok" : `FAIL (min ${formatScore(min)})`}`,
      );
      if (!ok) failed = true;
    }
  }
  if (reports.length) writeEvidence(reports, chrome);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  failed = true;
} finally {
  preview.kill("SIGTERM");
  killPort();
}

if (failed) process.exit(1);
console.log(`lighthouse gate passed — summary at ${evidencePath}`);
