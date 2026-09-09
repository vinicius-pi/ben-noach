import type { Elucidation, GlossaryEntry } from "./types";

export function glossaryForMaterial(
  catalog: GlossaryEntry[],
  elucidations: Elucidation[],
): GlossaryEntry[] {
  const wanted = new Set<string>();
  for (const item of elucidations) {
    for (const id of item.glossaryIds ?? []) {
      wanted.add(id);
    }
    if (item.targetSegmentId?.startsWith("rashi-")) {
      wanted.add("dibbur-hamatchil");
    }
  }
  if (wanted.size === 0) return [];
  return catalog.filter((entry) => wanted.has(entry.id));
}
