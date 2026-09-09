# Grok/Codex production build masterprompt

Use this document as the execution brief for the first complete build.

---

You are the principal product engineer and design engineer for **Ben Noach**.

Your mandate is to take the repository from its current research/specification state to a **production-grade, deployable, visually exceptional web product**.

Read `AGENTS.md` and every file in `docs/` before implementation. Treat those documents as the project's design, content-integrity, rabbinic-governance, and security constitution.

## Product

Ben Noach is a multilingual guided Tanakh reader for people who are new to Jewish textual study, especially Bnei Noach, non-religious readers, and people coming from Christian backgrounds who want to encounter the Hebrew Bible through Jewish sources.

Its experience is:

> **READ → UNDERSTAND → SOURCES**

The public reader feels like a beautifully typeset contemporary book. The deeper system carries source identity, versioning, licenses, evidence links, commentary relationships, and Noahide review status.

The application should be compelling enough that a serious rabbi, editor, designer, or engineer can inspect it and immediately see both care and restraint.

## Product character

Create a product that communicates:

- reverence without kitsch;
- confidence without aggression;
- accessibility without simplification of the sources;
- modernity without trend-chasing;
- Jewish textual authenticity without requiring prior yeshiva vocabulary;
- dignity for the righteous gentile path;
- transparent scholarship underneath an effortless reading experience.

The primary interaction is not marketing. It is a person reading Genesis, selecting a verse, meeting Rashi, understanding why Rashi commented, seeing where the explanation comes from, receiving reviewed Noahide context where applicable, and then opening the primary sources when ready.

## Phase 0 — repository and framework foundation

Establish a clean production foundation.

1. Verify the current patched Active LTS release of Next.js at build time, including the latest security patch.
2. Scaffold a Next.js App Router + strict TypeScript application.
3. Use a deterministic package manager/lockfile workflow.
4. Configure formatting, linting, strict typechecking and tests.
5. Create a clean module/domain architecture around reader, content, sources, review, design system, localization, and provider adapters.
6. Add GitHub Actions gates described in `docs/SECURITY_AND_QA.md`.
7. Add Dependabot and security/static-analysis workflow appropriate to the final stack.
8. Keep the dependency graph intentionally small.
9. Preserve `main` as canonical; implement on the current build branch and leave a reviewable PR rather than self-merging.

Use current Next.js agent-ready documentation from the installed framework/version while working. Prefer version-matched docs over remembered API patterns.

## Phase 1 — content and provenance architecture

Implement the source-aware content model before hard-coding page copy.

Model at minimum:

- canonical passage;
- text version/edition;
- translation version;
- classical commentary;
- commentary relationships;
- beginner elucidation;
- claim/evidence refs;
- Noahide scope;
- rabbinic review status;
- reviewer metadata;
- source license/attribution;
- provider metadata;
- outbound canonical links.

Create runtime validation for content/provider payloads.

Create a source manifest and CI validators so production content cannot silently lose provenance.

Create real fixture/content objects for Genesis 1:1–5 using only sources whose provenance and rights status are known. Preserve any unreviewed modern explanatory/religious prose as explicit draft content in development/review state.

## Phase 2 — design exploration before convergence

Produce three complete visual hypotheses using identical Genesis 1:1–5 data.

### Direction A — Editorial Modernism

Emphasize book design, optical typography, large calm whitespace, restrained blue, strong reading measure, minimal persistent chrome.

### Direction B — Quiet Scholarly

Retain the calm reader while making provenance and source relationships slightly more legible for study-oriented users.

### Direction C — Immersive Reader

Emphasize gesture/mobile ergonomics, disappearing chrome, focus state, continuity of reading, and an exceptionally polished study sheet.

Build these as isolated routes/branches/components that can be compared without contaminating the final design system.

For each direction render and inspect screenshots at:

- 390 × 844
- 768 × 1024
- 1440 × 1000

Capture:

- home/cover;
- reader idle;
- Genesis 1:1 selected;
- Understand open;
- Sources open;
- enlarged text;
- bilingual Hebrew/LTR state.

Write a short comparison in the repository explaining which direction wins and why. Converge deliberately into one final design system, then remove dead experiments.

## Phase 3 — typography laboratory

Create `/design/type-proof`.

Render real Hebrew with full niqqud and te'amim using legally usable candidate fonts documented in `docs/DESIGN_RESEARCH.md`.

Test at several sizes and line heights:

- Genesis 1:1;
- Deuteronomy 6:4–5;
- Isaiah 52:13–53:3;
- Psalm 119 sample.

Inspect:

- diacritic placement;
- glyph clarity;
- mobile rendering;
- mixed-direction punctuation;
- rhythm over multiple lines;
- readability at enlarged settings.

Select the final typography system from rendered evidence. Document the chosen font license and source in the manifest/repository.

## Phase 4 — public product surfaces

### Home

Create an editorial cover rather than a marketing funnel.

The first viewport should contain approximately:

- a small precise Magen David publishing mark;
- project wordmark;
- one concise description;
- Begin Reading / Continue Reading;
- quiet orientation to Tanakh.

Further down, provide:

- Torah / Nevi'im / Ketuvim entry;
- a small number of guided paths;
- project/source/review transparency.

Create a custom geometric SVG mark that is crisp at small sizes and feels like a publishing imprint.

### Library

Create clear Tanakh navigation that works for a beginner while preserving traditional book structure.

Support localized book names and Hebrew titles.

### READ

Create an immersive long-form reader.

Desktop target:

- reading measure roughly 680–760px;
- excellent Hebrew line-height;
- translation that reads naturally without visually competing with Hebrew;
- subtle verse affordances;
- receding navigation controls;
- stable layout with font loading.

Mobile target:

- one primary reading column;
- natural Hebrew/translation stacking;
- touch-friendly verse selection;
- minimal top/bottom chrome while reading.

Support appearance controls with the smallest useful set: text size, Hebrew/translation visibility, and any additional option justified by testing.

### UNDERSTAND

Selecting a verse opens the unique value layer.

Desktop: open a polished 380–430px study rail while preserving a readable main text measure.

Mobile: open an accessible draggable/expandable study sheet with compact and expanded states.

When data exists, organize content in this hierarchy:

- Understanding the verse
- Rashi
- What question is Rashi answering?
- Understanding Rashi
- Where this comes from
- Terms
- For Bnei Noach
- Sources & provenance
- Continue in Sefaria

Keep historical source blocks and modern explanation visually distinct with typography and small metadata signals rather than alarm-like badges.

### SOURCES

Provide deliberate depth:

- full selected Rashi source/version;
- relevant supercommentary;
- Midrash/Talmud source links;
- alternative classical voices where useful;
- provenance/version/license details;
- source graph or relationship list;
- canonical Sefaria links.

The Sources view may be denser because the user explicitly chose depth.

## Phase 5 — localization architecture

Build locale-aware routing and content architecture from the start.

English and Portuguese should be first-class interface targets even if the initial verified content corpus is not equally complete in both languages.

Requirements:

- correct RTL/LTR isolation;
- localized UI strings;
- localized book names;
- version-aware translations;
- graceful absence of a translation/commentary in one language;
- language selection that never changes the underlying canonical ref.

Keep translation licensing version-specific.

## Phase 6 — review mode

Build an editor/rabbinic review surface that can initially work against repository-backed content.

A reviewer should be able to inspect Genesis 1:1–5 and see compact states for:

- source verified;
- citations/evidence resolve;
- license verified;
- editorial explanation status;
- Noahide scope status;
- rabbinic review status.

Create interaction architecture for:

- approve;
- request correction;
- add source/note;
- choose scope category;
- mark dispute.

For the first implementation, privileged persistence can remain development/repository-oriented. Architect it so authenticated persistence can be added later without changing public content types.

## Phase 7 — source integration

Create a typed provider boundary for Sefaria.

Support:

- canonical ref normalization;
- exact version metadata;
- text retrieval where license policy permits;
- link/cross-reference retrieval;
- outbound deep links;
- caching appropriate to largely stable text data;
- graceful upstream failure.

Use Sefaria's API/MCP/export ecosystem according to its documented terms and per-version licensing.

Keep research-only providers such as ALHATORAH outside automated ingestion unless explicit permission exists.

## Phase 8 — accessibility

Treat text accessibility as a core product feature.

Implement and test:

- semantic HTML/landmarks;
- keyboard-complete reader/study workflow;
- visible focus;
- correct dialog/sheet focus behavior;
- screen-reader verse/action labels;
- correct `dir`/language attributes;
- reduced motion;
- sufficient contrast;
- 200% zoom;
- large text states;
- touch ergonomics.

Add Playwright + axe tests for core states and perform manual keyboard/zoom audits.

## Phase 9 — security

Implement the read-only architecture and controls in `docs/SECURITY_AND_QA.md`.

Establish:

- validated external-provider boundaries;
- safe source-markup normalization;
- restrictive security headers;
- a Content Security Policy matched to the final rendering strategy;
- secret-safe configuration;
- no privileged review mutations exposed publicly;
- dependency/static-analysis security checks;
- secure handling of external links/URLs.

Run an adversarial pass before the PR is ready.

## Phase 10 — performance and quality gates

Set up CI for:

- formatting;
- lint;
- strict typecheck;
- unit/component tests;
- content-integrity validation;
- production build;
- Playwright E2E desktop/mobile;
- axe accessibility;
- visual screenshot regression;
- Lighthouse CI/performance budgets;
- dependency/security scanning.

Optimize the core reader so it behaves like a document:

- minimal client JavaScript;
- stable font/layout loading;
- fast LCP;
- no unnecessary heavy imagery;
- no global hydration for content that can stay server-rendered/static.

## Phase 11 — polish loop

Use a real browser repeatedly after the implementation is functionally complete.

Inspect every key state on desktop, tablet and mobile.

Refine:

- exact text measure;
- baseline and vertical rhythm;
- Hebrew/translation hierarchy;
- whitespace;
- study rail entrance/exit;
- mobile sheet ergonomics;
- hover/focus/selected states;
- line breaks;
- Magen David/wordmark optical balance;
- animation timing;
- loading transitions;
- empty/error states.

Prefer subtractive refinement. If a screen feels generic or busy, improve composition, typography and hierarchy before adding visual elements.

## Phase 12 — documentation and handoff

Before opening the final PR:

- update README with real run/build/deploy instructions;
- document architecture;
- document source/provider flow;
- document content authoring/review workflow;
- document fonts and licenses;
- document test/security commands;
- include screenshots of the final key states;
- include known limitations;
- explain how to expand Genesis 1:1–5 to Genesis 1–11;
- include a short reviewer guide suitable for a rabbi/editor who is not a GitHub power user.

## Final acceptance test

A new reader should be able to:

1. arrive without knowing what Rashi or Sefaria is;
2. begin Genesis immediately;
3. understand how Hebrew/source/translation relate;
4. select Genesis 1:1;
5. meet Rashi as Rashi rather than as anonymous app prose;
6. understand the question Rashi is addressing;
7. see the source chain behind the explanation;
8. distinguish editorial elucidation from historical source;
9. see Noahide relevance only with its correct review status;
10. enter Sources and continue into Sefaria when ready;
11. complete the same journey comfortably by touch, keyboard and screen reader;
12. trust that the product knows the difference between a source, an explanation, and a ruling.

The build is complete when this experience is polished, tested, secure, provenance-safe, responsive, and deployable — not merely when routes compile.
