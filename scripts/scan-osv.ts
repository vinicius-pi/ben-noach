import { existsSync, mkdirSync, chmodSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ALLOW_MISSING = process.argv.includes("--allow-missing");
const VERSION = process.env.OSV_SCANNER_VERSION ?? "v2.2.3";
const CACHE_DIR = join(process.cwd(), ".cache", "osv-scanner");
const CACHED_BIN = join(CACHE_DIR, `osv-scanner-${VERSION}`);

if (!existsSync("pnpm-lock.yaml")) {
  console.error("missing pnpm-lock.yaml");
  process.exit(1);
}

function which(bin: string): string | null {
  const path = process.env.PATH ?? "";
  for (const dir of path.split(":")) {
    const candidate = join(dir, bin);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function platformAsset(): { url: string } {
  const platform = process.platform;
  const arch = process.arch;
  const os =
    platform === "linux"
      ? "linux"
      : platform === "darwin"
        ? "darwin"
        : platform === "win32"
          ? "windows"
          : null;
  const cpu = arch === "x64" ? "amd64" : arch === "arm64" ? "arm64" : null;
  if (!os || !cpu) {
    throw new Error(`unsupported platform ${platform}/${arch} for osv-scanner`);
  }
  const filename = `osv-scanner_${os}_${cpu}${platform === "win32" ? ".exe" : ""}`;
  return {
    url: `https://github.com/google/osv-scanner/releases/download/${VERSION}/${filename}`,
  };
}

function ensureScanner(): string {
  const fromPath = which("osv-scanner");
  if (fromPath) return fromPath;
  if (existsSync(CACHED_BIN)) return CACHED_BIN;

  const { url } = platformAsset();
  mkdirSync(CACHE_DIR, { recursive: true });
  const downloadPath = join(CACHE_DIR, "osv-scanner.download");
  console.log(`osv-scanner not on PATH; downloading official ${VERSION} from GitHub releases`);
  execFileSync("curl", ["-fsSL", "-o", downloadPath, url], { stdio: "inherit" });
  execFileSync("cp", [downloadPath, CACHED_BIN]);
  chmodSync(CACHED_BIN, 0o755);
  return CACHED_BIN;
}

let scanner: string;
try {
  scanner = ensureScanner();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (ALLOW_MISSING) {
    console.warn(`osv-scanner unavailable (${message}); scan:osv:local is not a release gate.`);
    process.exit(0);
  }
  console.error("OSV scan failed closed: official scanner could not be resolved.");
  console.error(message);
  console.error(
    "Install https://github.com/google/osv-scanner/releases or fix network, then re-run.",
  );
  process.exit(1);
}

try {
  execFileSync(scanner, ["scan", "--lockfile", "pnpm-lock.yaml"], { stdio: "inherit" });
} catch (error) {
  const status = (error as { status?: number | null }).status;
  if (status === undefined || status === null) {
    if (ALLOW_MISSING) {
      console.warn("osv-scanner failed to execute; scan:osv:local is not a release gate.");
      process.exit(0);
    }
    console.error("OSV scan failed closed: scanner did not execute.");
    process.exit(1);
  }
  process.exit(status || 1);
}
