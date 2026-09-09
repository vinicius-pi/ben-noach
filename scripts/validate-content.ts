import { createHash } from "node:crypto";
import {
  SOURCE_LINKS,
  SOURCE_MANIFEST,
  TEXT_VERSIONS,
  VERSES,
  COMMENTARY_SEGMENTS,
  ELUCIDATIONS,
} from "../src/lib/corpus";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function sha256Utf8(...parts: string[]): string {
  const hash = createHash("sha256");
  parts.forEach((part, index) => {
    if (index > 0) hash.update("\n");
    hash.update(part, "utf8");
  });
  return hash.digest("hex");
}

for (const entry of SOURCE_MANIFEST) {
  if (entry.bundleAllowed && entry.licenseStatus === "unknown") {
    fail(`Bundled unknown-rights source: ${entry.id}`);
  }
  if (!entry.versionTitle || !entry.sourceUrl || !entry.checksumSha256) {
    fail(`Incomplete manifest: ${entry.id}`);
  }
}

const ids = new Set<string>();
for (const verse of VERSES) {
  if (ids.has(verse.id)) fail(`Duplicate verse id ${verse.id}`);
  ids.add(verse.id);
  const actualHe = sha256Utf8(verse.hebrew.text);
  const actualEn = sha256Utf8(verse.translation.text);
  const actualBoth = sha256Utf8(verse.hebrew.text, verse.translation.text);
  if (actualHe !== verse.hebrew.checksumSha256) fail(`Hebrew checksum ${verse.id}`);
  if (actualEn !== verse.translation.checksumSha256) fail(`English checksum ${verse.id}`);
  if (actualBoth !== verse.payloadChecksumSha256) fail(`Payload checksum ${verse.id}`);
  if (!verse.hebrew.text.includes("\u05d0") && verse.canonicalRef.bookId === "genesis") {
    fail(`Hebrew missing alef-range glyphs: ${verse.id}`);
  }
}

for (const segment of COMMENTARY_SEGMENTS) {
  if (ids.has(segment.id)) fail(`Duplicate id ${segment.id}`);
  ids.add(segment.id);
  if (!VERSES.some((verse) => verse.id === segment.targetVerseId)) {
    fail(`Segment ${segment.id} points at missing verse`);
  }
}

for (const eluc of ELUCIDATIONS) {
  const refs = [
    ...(eluc.claims ?? []).flatMap((claim) => claim.evidenceRefs),
    ...(eluc.sourceRefs ?? []),
  ];
  for (const ref of refs) {
    const known =
      VERSES.some((verse) => verse.id === ref) ||
      COMMENTARY_SEGMENTS.some((segment) => segment.id === ref) ||
      SOURCE_LINKS.some((link) => link.to === ref);
    if (!known) fail(`Broken evidence ref ${ref} on ${eluc.id}`);
  }
  if (
    eluc.type === "NOAHIDE_GUIDANCE" &&
    eluc.status === "rabbinically-reviewed" &&
    !eluc.reviewNote
  ) {
    fail(`Reviewed guidance missing reviewer metadata: ${eluc.id}`);
  }
}

for (const version of TEXT_VERSIONS) {
  if (version.language === "pt" && version.licenseStatus === "unknown" && version.bundleAllowed) {
    fail("Unknown-rights Portuguese translation bundled");
  }
}

console.log(
  `content ok: ${VERSES.length} verses, ${COMMENTARY_SEGMENTS.length} segments, ${ELUCIDATIONS.length} elucidations`,
);
