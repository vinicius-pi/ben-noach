import { createHash } from "node:crypto";

/** SHA-256 of UTF-8 bytes. Source payloads are not Unicode-normalized. */
export function sha256Utf8(...parts: string[]): string {
  const hash = createHash("sha256");
  parts.forEach((part, index) => {
    if (index > 0) hash.update("\n");
    hash.update(part, "utf8");
  });
  return hash.digest("hex");
}

export function assertUnchanged(actual: string, expected: string, label: string): void {
  if (actual !== expected) {
    throw new Error(`Checksum mismatch for ${label}: expected ${expected}, got ${actual}`);
  }
}
