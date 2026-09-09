# Content governance

## Objective

The product should be easy enough for a first-time reader and rigorous enough that a rabbi or scholar can inspect exactly where every substantive claim came from.

The governing distinction is:

**source text ≠ editorial explanation ≠ Noahide guidance.**

These layers may appear in one reading experience, but their authority and provenance must remain explicit in the data model.

## Content classes

### 1. CANONICAL_SOURCE

Examples:

- Masoretic Tanakh text;
- explicitly identified biblical edition/version.

Required metadata:

- canonical ref;
- language;
- exact version/edition;
- provider/source;
- license/right status;
- retrieval/update metadata;
- checksum or stable version identifier when available.

### 2. CLASSICAL_COMMENTARY

Examples:

- Rashi;
- Siftei Chakhamim;
- Mizrachi;
- Gur Aryeh;
- Ibn Ezra;
- Ramban;
- Radak;
- Malbim;
- Midrash/Talmud passages used as cited sources.

Required metadata:

- author/work;
- exact canonical ref;
- source version;
- original language;
- translation version if displayed;
- provider;
- license/right status;
- relationship to the base passage (`comments_on`, `source_used_by`, `explains_commentary`, etc.).

Historical/classical wording must remain faithful to the selected edition. Truncation, when necessary for UI, must be visibly marked and allow expansion to the complete selected passage.

### 3. BEGINNER_ELUCIDATION

Modern prose authored for this project.

Possible purposes:

- explain the immediate literary context;
- define a term;
- explain what question motivates Rashi;
- unpack a compressed comment;
- identify the source Rashi is drawing on;
- explain a distinction such as peshat / derash;
- orient a reader who knows Christian terminology but not Jewish textual terminology.

Each block must carry claim-level evidence references.

Minimum structure:

```ts
type EditorialClaim = {
  text: string
  evidenceRefs: SourceRef[]
  status: 'draft' | 'sources-verified' | 'rabbinically-reviewed'
}

type EditorialBlock = {
  id: string
  text: string
  claims: EditorialClaim[]
  author: string
  reviewer?: string
  revision: number
  updatedAt: string
}
```

The prose may be elegant and beginner-friendly. Rigor belongs in the evidence graph, not in making every public sentence read like an academic footnote.

### 4. NOAHIDE_GUIDANCE

Content that tells a Ben Noach what is required, permitted, prohibited, recommended, appropriate, or out-of-scope.

This is the highest-governance layer.

Required fields:

```ts
type NoahideGuidance = {
  id: string
  text: string
  sourceRefs: SourceRef[]
  scope: NoahideScope
  status:
    | 'draft'
    | 'sources-verified'
    | 'rabbinic-review-requested'
    | 'rabbinically-reviewed'
  reviewer?: {
    name: string
    role?: string
    reviewedAt: string
  }
  adoptedPosition?: string
  alternatives?: PositionNote[]
}
```

Noahide normative guidance should not ship publicly as authoritative while still in `draft` or merely `sources-verified` state.

## Noahide scope taxonomy

Use a taxonomy flexible enough to express both universal content and covenantal boundaries without deleting source material.

Recommended starting values:

- `UNIVERSAL_FOUNDATION` — creation, one God, providence, repentance, justice, moral responsibility, etc., where reviewed as universal.
- `NOAHIDE_CORE` — directly tied to the Seven Noahide commandments and their accepted derivatives.
- `NOAHIDE_RELEVANT` — useful for Noahide faith/life without being one of the core legal categories.
- `PESHAT_GUIDE` — classical explanation used to understand the straightforward meaning of Tanakh.
- `ISRAEL_COVENANT_CONTEXT` — a Jewish covenantal obligation/context that may be necessary to understand the passage but is not presented as a Noahide obligation.
- `DISPUTED_SCOPE` — contemporary rabbinic authorities materially differ over whether/how deeply a Ben Noach should study this material.
- `REVIEW_REQUIRED` — classification has not yet been made.

## Torah-study scope: current research position

The project should encode the dispute rather than pretending there is one frictionless contemporary Orthodox formula.

Baseline sources:

- Babylonian Talmud, Sanhedrin 59a;
- Rambam, Mishneh Torah, Hilkhot Melakhim uMilchamot 10:9–10;
- relevant classic commentaries and later responsa;
- contemporary Noahide halakhic literature.

Contemporary examples show different applications:

### AskNoah / Rabbi Moshe Weiner tradition

The published AskNoah guidance permits a faithful Noahide to read the 24 books of Tanakh and use traditional peshat explanation such as Rashi to understand verses, while distinguishing this from deep independent investigation of Torah areas not relevant to Noahide obligations/faith.

Reference:
https://asknoah.org/forum/showthread.php?tid=13

Related summary by Rabbi Moshe Perets:
https://www.noahideacademy.org/post/can-noahides-study-the-jewish-torah

### More restrictive contemporary application

A 2026 Beis Hora'ah / DinOnline answer permits commentary used to clarify simple meaning but frames deeper study of commentaries more restrictively.

Reference:
https://dinonline.org/2026/01/19/noahide-studying-tanakh-commentaries/

Project consequence:

- the default product can be designed around Tanakh + peshat + carefully selected Rashi explanation;
- deeper Oral Torah and supercommentary exposure should be scope-classified;
- the project's final policy should be adopted by named rabbinic reviewers rather than inferred by software authors;
- where the policy is disputed, the data model should retain alternative positions and the public interface can state which policy this edition follows.

## Rashi handling

### Public reader

When Rashi is included:

- identify him clearly;
- display the selected source/translation faithfully;
- explain unfamiliar terms separately;
- explain the motivating textual question when supported by supercommentaries;
- link to fuller sources.

### Elucidation method

Preferred evidence order:

1. Rashi's own wording and dibbur hamatchil;
2. source explicitly used by or linked to Rashi;
3. Siftei Chakhamim for the motivating textual difficulty when appropriate;
4. Mizrachi / Gur Aryeh / other supercommentaries where the point needs depth or where significant alternatives exist;
5. modern editorial synthesis, explicitly labeled as this edition's elucidation.

ArtScroll/Koren may serve as proof that elucidation is a legitimate modern editorial genre, but their copyrighted elucidation text must not be used as source material unless licensed.

## Comparative Christian/Muslim readings

Comparative interpretation can be useful later, especially in Isaiah/Psalms/Genesis, but the base product is constructive rather than polemical.

Recommended architecture:

`Tanakh → Jewish textual context → classical commentary → beginner understanding → optional Later Readings`

A `Later Readings` module may contain:

- the later claim/interpretation;
- the relevant translation or textual issue;
- Jewish reading in context;
- primary sources;
- optional Tovia Singer / Jews for Judaism / other Orthodox explanatory media where rights allow linking/embedding.

The module should critique propositions and readings, not humiliate readers or religious populations.

## Translation governance

Every displayed translation is a distinct version with its own rights status.

Rules:

- never infer that “available on Sefaria” means reusable;
- store license metadata per version;
- prefer public-domain or clearly compatible Creative Commons text for bundled/static content;
- if rights are uncertain, link rather than reproduce;
- machine translation may be used only as draft editorial support unless an explicit translation workflow and review policy approves public use;
- preserve Hebrew as the canonical anchor.

## Source providers

### Sefaria

Preferred source infrastructure where version licensing permits.

Use:

- canonical refs;
- text/version APIs;
- links/cross-references;
- catalogue metadata;
- topic/source discovery;
- deep links.

Official repositories:
https://github.com/Sefaria/Sefaria-Project
https://github.com/Sefaria/Sefaria-Export
https://github.com/Sefaria/sefaria-mcp

Developer portal:
https://developers.sefaria.org/

### ALHATORAH

Use as a research/design benchmark and outbound reference where useful. Their terms restrict automated access/reuse; no scraping pipeline should target it without explicit permission.

### Open Siddur / open fonts and texts

May be useful for font and public-domain/open textual assets, with license inspection per asset.

## Provenance manifest

Create a machine-readable `content/source-manifest.*` containing every third-party version shipped or cached in the product.

Suggested fields:

```ts
type SourceManifestEntry = {
  id: string
  work: string
  refRange?: string
  author?: string
  language: string
  versionTitle: string
  provider: string
  providerUrl: string
  license: string
  licenseUrl?: string
  attribution?: string
  bundled: boolean
  retrievedAt?: string
  sourceRevision?: string
}
```

CI should fail if bundled third-party textual content lacks a manifest entry.

## Review UI

Create a private/development review mode that lets a rabbinic/editorial reviewer inspect a passage without using GitHub directly.

For each block show compact status controls:

- source verified;
- citations resolve;
- editorial explanation reviewed;
- Noahide scope reviewed;
- license verified.

Reviewer actions:

- approve;
- request correction;
- add source;
- mark scope category;
- mark disputed;
- leave note.

The initial implementation can persist review fixtures locally/repository-side rather than immediately building authentication/database complexity. The data model should allow a future authenticated workflow.

## Public trust language

Before formal rabbinic governance exists, public surfaces should use accurate language such as:

- “Independent project”;
- “Source-verified”; 
- “Rabbinic review pending”;
- “Reviewed by Rabbi X” only after explicit review.

Avoid generic “kosher approved” language without a named authority and scope.

## Release gate for a passage

A passage is public-release eligible when:

1. canonical text/version is verified;
2. translation rights are verified;
3. quoted commentary version/rights are verified;
4. every beginner-elucidation claim resolves to evidence;
5. every Noahide normative statement has required rabbinic review;
6. disputed positions are represented according to adopted editorial policy;
7. all outbound deep links resolve;
8. content renders correctly in each supported language;
9. source and editorial layers remain visually distinguishable;
10. no LLM-only factual or halakhic assertion remains in production content.
