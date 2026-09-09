import { describe, expect, it } from "vitest";
import {
  isAllowedExternalHost,
  normalizeBookAlias,
  parseCanonicalRef,
  verseId,
} from "../../src/lib/refs";

describe("refs", () => {
  it("normalizes book aliases", () => {
    expect(normalizeBookAlias("Bereshit")).toBe("genesis");
    expect(normalizeBookAlias("Gênesis")).toBe("genesis");
    expect(normalizeBookAlias("Tehillim")).toBe("psalms");
  });

  it("parses canonical refs", () => {
    expect(parseCanonicalRef("Genesis 1:1")).toEqual({ bookId: "genesis", chapter: 1, verse: 1 });
    expect(parseCanonicalRef("Bereshit 1")).toEqual({ bookId: "genesis", chapter: 1 });
  });

  it("builds verse ids", () => {
    expect(verseId("genesis", 1, 6)).toBe("genesis-1-6");
  });

  it("rejects non-https hosts", () => {
    expect(isAllowedExternalHost("http://www.sefaria.org/Genesis.1.1", ["www.sefaria.org"])).toBe(
      false,
    );
    expect(isAllowedExternalHost("https://evil.example/Genesis", ["www.sefaria.org"])).toBe(false);
    expect(isAllowedExternalHost("https://www.sefaria.org/Genesis.1.1", ["www.sefaria.org"])).toBe(
      true,
    );
  });
});
