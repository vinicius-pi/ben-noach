import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const PATTERNS = [
  /AKIA[0-9A-Z]{16}/,
  /ghp_[A-Za-z0-9]{20,}/,
  /xai-[A-Za-z0-9]{20,}/,
  /-----BEGIN (?:RSA )?PRIVATE KEY-----/,
];

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (["node_modules", "dist", ".git", ".astro", "tmp-ingest", "coverage"].includes(entry))
      continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (stat.size < 1_000_000) acc.push(full);
  }
  return acc;
}

let failed = false;
for (const file of walk(".")) {
  const text = readFileSync(file, "utf8");
  for (const pattern of PATTERNS) {
    if (pattern.test(text) && !file.endsWith("scan-secrets.ts")) {
      console.error(`possible secret in ${file}`);
      failed = true;
    }
  }
}

if (existsSync("gitleaks.toml") || process.env.CI) {
  try {
    execFileSync("gitleaks", ["detect", "--no-git", "--source", ".", "-v"], { stdio: "inherit" });
  } catch (error) {
    if ((error as { status?: number }).status === undefined) {
      console.warn("gitleaks CLI not installed; local regex scan used");
    } else {
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("secret scan ok");
