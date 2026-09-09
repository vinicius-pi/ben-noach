import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

if (!existsSync("pnpm-lock.yaml")) {
  console.error("missing pnpm-lock.yaml");
  process.exit(1);
}

try {
  execFileSync("osv-scanner", ["scan", "--lockfile", "pnpm-lock.yaml"], { stdio: "inherit" });
} catch (error) {
  const status = (error as { status?: number }).status;
  if (status === undefined) {
    console.warn("osv-scanner CLI not installed locally; CI must run the official scanner.");
    process.exit(0);
  }
  process.exit(status || 1);
}
