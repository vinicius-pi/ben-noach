import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
].filter((value): value is string => Boolean(value));

const chromePath = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
const env = {
  ...process.env,
  ...(chromePath ? { CHROME_PATH: chromePath } : {}),
};

/**
 * Full release gate. Every step listed here actually runs.
 * CI maps the same steps onto parallel jobs; this command is the
 * sequential, locally reproducible contract.
 *
 * Not run by `pnpm qa` (that remains the fast inner loop).
 */
const steps: { name: string; cmd: string[] }[] = [
  { name: "format check", cmd: ["pnpm", "format:check"] },
  { name: "lint", cmd: ["pnpm", "lint"] },
  { name: "Astro / TypeScript check", cmd: ["pnpm", "check"] },
  { name: "unit tests", cmd: ["pnpm", "test"] },
  { name: "content integrity", cmd: ["pnpm", "validate:content"] },
  { name: "license validation", cmd: ["pnpm", "validate:licenses"] },
  { name: "provider validation", cmd: ["pnpm", "validate:providers"] },
  { name: "secret scan", cmd: ["pnpm", "scan:secrets"] },
  { name: "OSV / dependency vulnerability scan", cmd: ["pnpm", "scan:osv"] },
  { name: "production build", cmd: ["pnpm", "build"] },
  { name: "generic static-host smoke", cmd: ["pnpm", "smoke:static"] },
  {
    name: "Playwright desktop/mobile E2E + axe",
    cmd: ["pnpm", "test:e2e"],
  },
  {
    name: "deterministic visual regression",
    cmd: ["pnpm", "test:visual"],
  },
  { name: "Lighthouse CI", cmd: ["pnpm", "lhci"] },
];

console.log("qa:full — sequential release gate\n");
for (const [index, step] of steps.entries()) {
  console.log(`[${index + 1}/${steps.length}] ${step.name}`);
  console.log(`$ ${step.cmd.join(" ")}`);
  const [command, ...args] = step.cmd;
  if (!command) {
    console.error(`qa:full misconfigured step: ${step.name}`);
    process.exit(1);
  }
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env,
  });
  const status = result.status ?? 1;
  if (status !== 0) {
    console.error(`\nqa:full FAILED at: ${step.name}`);
    process.exit(status);
  }
}

console.log("\nqa:full passed — all listed gates ran.");
