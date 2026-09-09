export type Locale = "en" | "pt";

export type ScopeTag =
  | "UNIVERSAL_CREATION"
  | "NOAHIDE_CORE"
  | "EMUNAH"
  | "TESHUVAH_PRAYER"
  | "JUSTICE_ETHICS"
  | "NATIONS_PROPHECY"
  | "ISRAEL_COVENANT_CONTEXT"
  | "JEWISH_PRACTICE_SPECIFIC"
  | "ADVANCED_ORAL_TORAH"
  | "REVIEW_REQUIRED";

export type AddressKind =
  | "humanity"
  | "noah_bnei_noach"
  | "israel_nation"
  | "priests_levites"
  | "specific_person"
  | "prophetic_nations"
  | "hashem_alone";

export type LicenseStatus = "public-domain" | "open-license" | "permission" | "unknown";

export type SourceSpan = {
  kind: "text" | "emphasis" | "lemma";
  text: string;
};

export type Localized = {
  en: string;
  pt: string;
  he?: string;
};

export type CanonicalRef = {
  work: string;
  bookId: string;
  chapter: number;
  verse: number;
  osis: string;
  sefaria: string;
  display: Localized;
};

export type Book = {
  id: string;
  canonicalWork: string;
  sefariaSlug: string;
  division: "torah" | "neviim" | "ketuvim";
  order: number;
  chapterCount: number;
  releasedChapters: number[];
  titles: { he: string; en: string; pt: string; transliteration: string };
  aliases: string[];
};

export type Verse = {
  id: string;
  canonicalRef: CanonicalRef;
  hebrew: { versionId: string; text: string; checksumSha256: string };
  translation: { versionId: string; text: string; checksumSha256: string };
  scopeTags: ScopeTag[];
  address: AddressKind;
  addressNote: Localized;
  sefariaUrl: string;
  payloadChecksumSha256: string;
};

export type Passage = {
  id: string;
  bookId: string;
  chapter: number;
  title: Localized;
  verseIds: string[];
  released: boolean;
  defaultPathId?: string;
};

export type TextVersion = {
  id: string;
  work: string;
  versionTitle: string;
  language: string;
  provider: string;
  sourceUrl: string;
  licenseSpdx?: string | null;
  licenseStatus: LicenseStatus;
  licenseLabel: string;
  attribution: string;
  bundleAllowed: boolean;
  offlineAllowed: boolean;
  derivativeAllowed: boolean | "check-license";
  retrievedAt: string;
  role: string;
  checksumSha256: string;
};

export type CommentaryWork = {
  id: string;
  title: Localized;
  author: string;
  era: string;
  kind: "CLASSICAL_COMMENTARY";
  englishVersionId: string;
  hebrewVersionId: string;
  attributionRequired?: boolean;
};

export type CommentarySegment = {
  id: string;
  workId: string;
  canonicalRef: string;
  sefariaRef: string;
  targetVerseId: string;
  segment: number;
  dibburHamatchil: string;
  languagePair: string;
  hebrew: {
    versionId: string;
    spans: SourceSpan[];
    plain: string;
    checksumSha256: string;
  };
  english: {
    versionId: string;
    spans: SourceSpan[];
    plain: string;
    checksumSha256: string;
  };
  sefariaUrl: string;
  attributionRequired?: boolean;
};

export type EditorialSlot =
  "understanding-the-verse" | "why-rashi" | "understanding-rashi" | "for-bnei-noach";

export type Elucidation = {
  id: string;
  type: "EDITORIAL_ELUCIDATION" | "NOAHIDE_GUIDANCE";
  verseId: string;
  slot: EditorialSlot;
  targetSegmentId?: string;
  status: "draft" | "sources-verified" | "rabbinically-reviewed";
  author: string;
  revision: number;
  updatedAt: string;
  text: Localized;
  claims?: { text: string; evidenceRefs: string[]; status: string }[];
  sourceRefs?: string[];
  scope?: string;
  reviewNote?: string;
  classicalFeature?: string;
};

export type SourceLink = {
  id: string;
  relationship: string;
  from: string;
  to: string;
  localTextAvailable: boolean;
  externalUrl?: string;
  note?: string;
};

export type GlossaryEntry = {
  id: string;
  term: Localized;
  short: Localized;
};

export type GuidedPath = {
  id: string;
  title: Localized;
  status: "partial" | "planned";
  summary: Localized;
  steps: { verseId: string; label: Localized }[];
};

export type ReviewRecord = {
  id: string;
  targetId: string;
  targetKind: string;
  sourceVerified: boolean;
  citationsResolve: boolean;
  rightsVerified: boolean;
  elucidationReviewed: boolean;
  scopeReviewed: boolean;
  rabbinicReview: string;
  contentHash: string;
  notes: string;
};

export type SourceManifestEntry = {
  id: string;
  work: string;
  canonicalRefRange: string;
  versionTitle: string;
  language: string;
  provider: string;
  sourceUrl: string;
  licenseSpdx?: string | null;
  licenseStatus: LicenseStatus;
  licenseLabel: string;
  attribution: string;
  bundleAllowed: boolean;
  offlineAllowed: boolean;
  derivativeAllowed: boolean | "check-license";
  retrievedAt: string;
  checksumSha256: string;
  notes?: string;
};

export type StudyMode = "read" | "understand" | "sources";

export type AppearanceState = {
  textScale: "s" | "m" | "l" | "xl";
  showHebrew: boolean;
  showTranslation: boolean;
};

export type ReaderPayload = {
  locale: Locale;
  passage: Passage;
  book: Book;
  verses: Verse[];
  segments: CommentarySegment[];
  elucidations: Elucidation[];
  links: SourceLink[];
  glossary: GlossaryEntry[];
  versions: TextVersion[];
  works: CommentaryWork[];
};
