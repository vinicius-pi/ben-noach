import { describe, expect, it } from "vitest";
import { ELUCIDATIONS, GLOSSARY } from "../../src/lib/corpus";
import { glossaryForMaterial } from "../../src/lib/glossary";

describe("contextual glossary", () => {
  it("gives Genesis 1:1 the terms needed to read its Rashi", () => {
    const ids = glossaryForMaterial(
      GLOSSARY,
      ELUCIDATIONS.filter((item) => item.verseId === "genesis-1-1"),
    ).map((entry) => entry.id);
    expect(ids).toEqual([
      "rashi",
      "dibbur-hamatchil",
      "peshat",
      "derash",
      "siftei-chakhamim",
      "elohim",
      "tetragrammaton",
    ]);
  });

  it("does not dump the Genesis 1:1 list onto a silent-Rashi verse", () => {
    const ids = glossaryForMaterial(
      GLOSSARY,
      ELUCIDATIONS.filter((item) => item.verseId === "genesis-1-3"),
    ).map((entry) => entry.id);
    expect(ids).toEqual(["rashi"]);
  });

  it("omits the section when the selected material lists no terms", () => {
    expect(glossaryForMaterial(GLOSSARY, [])).toEqual([]);
  });
});
