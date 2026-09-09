import type { ScopeTag } from "./types";

export const SCOPE_LABELS: Record<ScopeTag, { en: string; pt: string }> = {
  UNIVERSAL_CREATION: { en: "Universal / creation", pt: "Universal / criação" },
  NOAHIDE_CORE: { en: "Noahide core", pt: "Núcleo noahide" },
  EMUNAH: { en: "Emunah", pt: "Emuná" },
  TESHUVAH_PRAYER: { en: "Teshuvah / prayer", pt: "Teshuvá / oração" },
  JUSTICE_ETHICS: { en: "Justice / ethics", pt: "Justiça / ética" },
  NATIONS_PROPHECY: { en: "The nations / prophecy", pt: "As nações / profecia" },
  ISRAEL_COVENANT_CONTEXT: { en: "Israel covenant context", pt: "Contexto da aliança de Israel" },
  JEWISH_PRACTICE_SPECIFIC: {
    en: "Jewish-specific practice",
    pt: "Prática especificamente judaica",
  },
  ADVANCED_ORAL_TORAH: { en: "Advanced Oral Torah", pt: "Torá Oral avançada" },
  REVIEW_REQUIRED: { en: "Review required", pt: "Revisão necessária" },
};

export const ADDRESS_LABELS = {
  humanity: { en: "Humanity / universal", pt: "Humanidade / universal" },
  noah_bnei_noach: { en: "Noah / Bnei Noach", pt: "Noé / Bnei Noach" },
  israel_nation: { en: "Israel as a nation", pt: "Israel como nação" },
  priests_levites: { en: "Priests / Levites", pt: "Sacerdotes / levitas" },
  specific_person: {
    en: "A specific biblical person or group",
    pt: "Uma pessoa ou grupo bíblico específico",
  },
  prophetic_nations: { en: "Prophetic future / the nations", pt: "Futuro profético / as nações" },
  hashem_alone: { en: "God alone", pt: "Somente Deus" },
} as const;

export function isBeginnerDefault(tag: ScopeTag): boolean {
  return (
    tag === "UNIVERSAL_CREATION" ||
    tag === "NOAHIDE_CORE" ||
    tag === "EMUNAH" ||
    tag === "TESHUVAH_PRAYER" ||
    tag === "JUSTICE_ETHICS" ||
    tag === "NATIONS_PROPHECY"
  );
}
