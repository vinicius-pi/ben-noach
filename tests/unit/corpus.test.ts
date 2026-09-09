import { describe, expect, it } from "vitest";
import { sha256Utf8 } from "../../src/lib/checksum";
import { COMMENTARY_SEGMENTS, ELUCIDATIONS, SOURCE_MANIFEST, VERSES } from "../../src/lib/corpus";

describe("corpus integrity", () => {
  it("includes Genesis 1:1–6 from the content workflow", () => {
    expect(VERSES.map((verse) => verse.canonicalRef.verse).sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("checksums match stored Hebrew/English", () => {
    for (const verse of VERSES) {
      expect(sha256Utf8(verse.hebrew.text)).toBe(verse.hebrew.checksumSha256);
      expect(sha256Utf8(verse.translation.text)).toBe(verse.translation.checksumSha256);
    }
  });

  it("keeps Rashi segmented with dibbur hamatchil", () => {
    const rashi11 = COMMENTARY_SEGMENTS.filter(
      (segment) => segment.targetVerseId === "genesis-1-1" && segment.workId === "rashi-on-genesis",
    );
    expect(rashi11.length).toBe(3);
    expect(rashi11[0]?.dibburHamatchil).toContain("בראשית");
  });

  it("does not invent Rashi for Genesis 1:3", () => {
    expect(
      COMMENTARY_SEGMENTS.filter(
        (segment) =>
          segment.targetVerseId === "genesis-1-3" && segment.workId === "rashi-on-genesis",
      ),
    ).toHaveLength(0);
  });

  it("rejects unknown-rights bundles", () => {
    expect(
      SOURCE_MANIFEST.every((entry) => !(entry.bundleAllowed && entry.licenseStatus === "unknown")),
    ).toBe(true);
  });

  it("elucidation claims have evidence", () => {
    for (const eluc of ELUCIDATIONS) {
      for (const claim of eluc.claims ?? []) {
        expect(claim.evidenceRefs.length).toBeGreaterThan(0);
      }
    }
  });
});
