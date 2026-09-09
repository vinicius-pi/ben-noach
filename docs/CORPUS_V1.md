# Corpus v1 — release-approved source stack

## Objective

The v1 corpus must be redistributable, auditable, portable and usable without a paid API or runtime dependency.

A text being visible on Sefaria or another digital library does not by itself authorize bundling. The project releases only concrete versions whose rights status has been checked and recorded.

The build agent must preserve the exact version identity and attribution of every source.

## Required manifest schema

Every bundled source/version must have an entry with at least:

```ts
export type SourceManifestEntry = {
  id: string;
  work: string;
  canonicalRefRange: string;
  versionTitle: string;
  language: string;
  provider: string;
  sourceUrl: string;
  licenseSpdx?: string;
  licenseStatus: "public-domain" | "open-license" | "permission" | "unknown";
  attribution?: string;
  bundleAllowed: boolean;
  offlineAllowed: boolean;
  derivativeAllowed: boolean | "check-license";
  retrievedAt: string;
  checksumSha256: string;
  notes?: string;
};
```

Production validators must reject `bundleAllowed: true` when `licenseStatus` is `unknown`.

## 1. Hebrew Tanakh display text

### Preferred version

**Tanach with Ta'amei Hamikra**

Provider/library metadata: Sefaria

Underlying source: `tanach.us`

Rights status: **Public Domain** according to the Sefaria version metadata examined during the September 2026 audit.

Use:

- v1 Hebrew base display;
- niqqud;
- te'amim/cantillation;
- local static release corpus;
- offline reading.

Requirements:

- record the exact Sefaria version title/identifier used at ingestion;
- preserve pointed/cantillated text without editorial transformation;
- hash normalized release payloads;
- include retrieval timestamp and source URL;
- regression-test Unicode/diacritics.

## 2. English Tanakh translation

### Preferred v1 translation

**The Holy Scriptures: A New Translation — Jewish Publication Society, 1917**

Rights status: **Public Domain**.

Use:

- default verified English translation for the pilot;
- local bundling;
- offline reading.

Why this version:

- Jewish translation provenance;
- no future commercial dependency;
- redistributable baseline suitable for a public open project.

The product may later offer another modern-English version only after version-specific license and editorial-quality review.

### Optional research candidate

**Sefaria Community Translation — English**

Rights status: **CC0** in the Sefaria metadata reviewed during the audit.

Status for v1: `candidate`, not automatically default.

Before public default use, perform editorial consistency/quality review across the pilot corpus.

## 3. Rashi on Torah

### Preferred English baseline

**Rashi, translation by M. Rosenbaum and A. M. Silbermann, 1929–1934**

Rights status: **Public Domain** in the Sefaria version metadata reviewed during the audit.

Use:

- Rashi source/translation for the Genesis pilot;
- local bundling;
- offline reading;
- exact segment-level provenance.

Requirements:

- preserve commentary-segment identity;
- preserve `dibbur hamatchil` where available;
- do not flatten multiple Rashi segments into anonymous verse prose;
- project elucidation remains a separate object.

### Hebrew Rashi

Use a concrete Sefaria Rashi Hebrew version only after its exact version metadata/rights record is written into the manifest.

Do not infer the Hebrew version license from the English translation license.

## 4. Siftei Chakhamim

Siftei Chakhamim is a high-value source for the product's “What question is Rashi answering?” layer.

### Hebrew

An alternate Sefaria Hebrew version identified during the audit is marked **Public Domain**.

Status: approved after the ingestion script records the exact version title and provider metadata.

### English

The Metsudah English version visible through Sefaria is marked **CC BY**.

Status: approved in principle for bundling when:

- the exact CC BY version is recorded;
- attribution is rendered/available as required;
- the manifest validator enforces attribution;
- derivative/reformatting requirements are verified against the concrete license statement.

Project-written beginner elucidation should cite Siftei Chakhamim at claim level where it materially supports the explanation; it should not copy a commercial elucidation.

## 5. Additional Rashi supercommentaries

Potential sources include:

- Mizrachi;
- Gur Aryeh;
- Divrei David;
- additional classical supercommentaries available through Sefaria.

They are **not automatically release-approved as a group**.

For each concrete version:

1. inspect version metadata;
2. record rights status;
3. decide whether text is bundled locally or only deep-linked;
4. include only the minimum source material necessary for the guided pilot.

The Sources layer can deep-link to Sefaria for works whose concrete translation rights are not suitable for local bundling.

## 6. Midrash / Gemara / other Chazal sources

Use only concrete versions whose rights status is approved.

The relationship/reference itself may be stored even when the full source text is not bundled.

Example model:

```ts
{
  relationship: "RASHI_SOURCE",
  from: "Rashi on Genesis 1:1:1",
  to: "Bereshit Rabbah ...",
  localTextAvailable: false,
  externalUrl: "..."
}
```

This lets the product explain source provenance without creating a rights problem.

## 7. Open Hebrew morphology — optional enrichment

### Open Scriptures Hebrew Bible / MorphHB

Repository: `openscriptures/morphhb`

Rights structure reviewed during the audit:

- underlying Westminster Leningrad Codex text: **Public Domain**;
- lemma/morphological annotation data: **CC BY 4.0**.

Approved uses:

- future word inspector;
- lemma mapping;
- morphology;
- word-level identifiers;
- internal alignment/research.

The display Tanakh edition remains the selected release version. Do not silently substitute MorphHB's underlying edition for the public reader merely because morphology is available.

## 8. Open lexicon — optional enrichment

### Brown–Driver–Briggs (BDB)

Approved open candidates identified during the audit:

- Sefaria BDB version: **Public Domain**;
- BibleAquifer BDB Hebrew Lexicon edition: **CC0**;
- OpenScriptures HebrewLexicon: BDB source text Public Domain with project data under CC BY 4.0.

Use:

- deeper lexical source for a future Hebrew-word inspector;
- links from concise beginner glosses;
- never dump full lexicon entries into the default reading surface.

Choose one concrete v1 provider before implementation and record its exact license/provenance.

## 9. Portuguese

Portuguese is a **first-class interface language** from the architecture's first commit.

However, the Sefaria Portuguese Genesis versions inspected in September 2026 included versions with blank/unknown rights metadata.

Therefore:

- do not bundle an unknown-rights Portuguese Tanakh translation into production;
- do not ask an LLM to silently generate a “translation” and present it as scripture;
- localized project UI and project-written beginner elucidation may be authored in Portuguese;
- source quotations shown in Portuguese require a concrete approved translation version;
- if no approved Portuguese source translation exists at v1 launch, show the verified Hebrew + approved English source and clearly indicate that a reviewed Portuguese source translation is pending;
- actively seek a Public Domain, CC0, CC BY, or explicitly permitted Portuguese Jewish Tanakh version for later inclusion.

Portuguese support is a corpus acquisition problem, not a reason to weaken the rights model.

## 10. Project-written elucidation

The project may author original beginner explanations in English and Portuguese.

These are not historical sources and are stored separately.

Every significant interpretive claim should be capable of carrying evidence refs:

```ts
{
  id: "gen-1-1-rashi-question-en-v1",
  type: "EDITORIAL_ELUCIDATION",
  text: "...",
  claims: [
    {
      text: "...",
      evidenceRefs: ["Siftei Chakhamim on Genesis 1:1:..."]
    }
  ],
  status: "sources-verified"
}
```

Noahide normative/application statements additionally follow rabbinic review rules in `docs/CONTENT_GOVERNANCE.md`.

## 11. Runtime source strategy

### Build-time/release-time

Allowed:

- pull approved versions from Sefaria/provider adapters;
- normalize deterministically;
- validate refs/licenses;
- hash;
- commit or generate the approved local corpus according to repository policy.

### Public runtime

The core reader renders from the local release corpus.

Sefaria may be used for:

- outbound deep links;
- optional enrichment where graceful failure exists;
- update/research workflows.

The following journey must work if every external API is unavailable:

`home → Genesis 1:1–5 → READ → UNDERSTAND → locally bundled approved sources → local provenance metadata`.

## 12. Corpus expansion gate

Before Genesis 1:1–5 becomes Genesis 1–11, prove that adding a new passage requires only:

1. adding/ingesting the passage source data;
2. adding commentary/source relationships;
3. adding optional elucidation/review records;
4. passing manifests/schema/tests.

If a new verse requires page-specific React/Astro code, the corpus architecture has failed.

## Release rule

The v1 production build may contain fewer translated/commentary sources than the research environment.

**Rights certainty + provenance + editorial quality outrank source count.**

The complete library remains one click away through Sefaria.