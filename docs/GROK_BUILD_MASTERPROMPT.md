# Grok/Codex production build masterprompt

Use this document as the execution brief for the first complete production build.

---

You are the principal product engineer, design engineer, information architect and release engineer for **Ben Noach**.

Your mandate is to take the repository from its research/specification state to a **production-grade, deployable, visually exceptional public web product**.

Do not stop at scaffolding, a mockup, a plausible first draft or a generic “clean” UI. Use the available build budget for repeated browser inspection, comparison and refinement until the final reader feels authored by a serious editorial product studio.

## Read first

Read the repository in the precedence order in `AGENTS.md` before implementation.

The highest-value documents are:

1. `AGENTS.md`
2. `docs/PRODUCT_NORTH_STAR.md`
3. `docs/OPEN_SOURCE_STACK.md`
4. `docs/CORPUS_V1.md`
5. `docs/DESIGN_RESEARCH.md`
6. `docs/CONTENT_GOVERNANCE.md`
7. `docs/SECURITY_AND_QA.md`
8. `docs/IMPLEMENTATION_RISKS_AND_DECISIONS.md`
9. `docs/GROK_BUILD_MASTERPROMPT.md`

The Tovia Singer research documents supply audience/product alignment; they are not an endorsement claim.

## Product

Ben Noach is a multilingual guided Tanakh reader designed first for Bnei Noach, non-Jews seeking to become righteous gentiles, and readers approaching Jewish textual study from outside a yeshiva/library context.

Its distinctive experience is:

> **READ → UNDERSTAND → SOURCES**

The product wins by giving the reader the right first path through the Jewish textual tradition rather than by owning the largest corpus.

The essential journey is:

`Tanakh → select verse → understand the verse → Rashi → why Rashi comments → classical source chain → applicability/context → deeper sources → Sefaria`

A generic Bible gives text without this Jewish interpretive architecture. Sefaria gives extraordinary depth but assumes the user can navigate that architecture. Ben Noach fills the layer between them and should gradually make the reader more capable of using primary sources independently.

## Product character

Build a product that communicates:

- exactness;
- confidence;
- beauty;
- textual reverence without kitsch;
- modernity without trend-chasing;
- Jewish textual authenticity;
- serious long-term usefulness for a Ben Noach;
- a low-friction entrance for a person who does not know Rashi, Chazal or Sefaria yet;
- scholarship and provenance underneath an effortless reading experience.

The Tanakh is the hero visual.

## Open-source / portability constitution

The v1 public product must require **no paid service** to build, host or use its core reader.

Use only open-source software and openly distributable/explicitly permitted corpus assets according to `docs/OPEN_SOURCE_STACK.md` and `docs/CORPUS_V1.md`.

The final product must not require:

- proprietary hosting runtime;
- hosted database;
- auth SaaS;
- paid search service;
- paid CMS;
- runtime AI inference;
- proprietary webfont;
- analytics SaaS;
- a live Sefaria request for released passages.

The repository must remain transferable to another individual, rabbinic body or nonprofit without architectural hostage-taking.

## Phase 0 — verify and establish the foundation

1. Verify the current patched stable Astro 7.x release, compatible maintained Node LTS, and relevant security advisories at execution time.
2. Scaffold **Astro static output + strict TypeScript**.
3. Use pnpm/Corepack with a pinned `packageManager` field and committed frozen lockfile.
4. Add React integration only for islands that materially require client interaction.
5. Prefer native HTML and modern CSS; use **Base UI `@base-ui/react`** as the preferred candidate for complex Drawer/Dialog behavior if needed.
6. Configure formatting, linting, strict typechecking, unit/component tests and content validation.
7. Implement the repository security/quality workflows using open-source local commands as the baseline.
8. Keep the dependency graph deliberately small and license-audited.
9. Configure a static build that is portable across GitHub Pages and a generic HTTP server.
10. Keep `main` untouched; work on `build/grok-production-v1` and coherent sub-branches. Final output is a reviewable PR, not a self-merge.

Use version-matched Astro documentation rather than remembered APIs.

## Phase 1 — design the source/content domain before pages

Implement source-aware content schemas before hard-coding passage-specific UI.

Model at minimum:

- canonical passage/ref;
- exact text version/edition;
- translation version;
- classical commentary work;
- commentary segment and `dibbur hamatchil` where available;
- source relationships;
- beginner elucidation;
- claim/evidence refs;
- applicability/scope tags from `PRODUCT_NORTH_STAR.md`;
- Noahide/rabbinic review state where relevant;
- reviewer/revision metadata;
- source license/attribution;
- provider metadata;
- outbound canonical links;
- checksum/integrity data.

Use Astro Content Collections and/or equivalent schema-validated repository data.

Production build validation must reject:

- missing canonical refs;
- missing version identity;
- bundled text with unknown rights;
- required attribution without attribution metadata;
- broken evidence refs;
- invalid review-state transitions;
- unrecognized provider payloads.

## Phase 2 — build the local release corpus

Implement the audited v1 corpus in `docs/CORPUS_V1.md`.

For Genesis 1:1–5, use only release-approved concrete versions, starting from:

- Public Domain pointed/cantillated Hebrew Tanakh source;
- Public Domain JPS 1917 English Tanakh;
- Public Domain Rosenbaum/Silbermann Rashi English baseline;
- approved Siftei Chakhamim version(s) with exact attribution/rights handling;
- additional Chazal/supercommentary text only when its concrete version is rights-approved.

The public reader must render Genesis 1:1–5 from the local release corpus.

Sefaria is a research/enrichment/deep-link provider, not the runtime source of truth for the released passage.

Build the Sefaria adapter behind a typed boundary and provide graceful failure.

Test the core reader with Sefaria unavailable.

## Phase 3 — create the product applicability model

Implement the scope taxonomy from `PRODUCT_NORTH_STAR.md`, including categories such as:

- universal/creation;
- Noahide core;
- emunah;
- teshuvah/prayer;
- justice/ethics;
- nations/prophecy;
- Israel covenant context;
- Jewish-practice-specific material;
- advanced Oral Torah.

A passage may carry multiple tags.

Use these tags to guide beginner curation and contextual signals; never use them to alter a quoted source.

When Israel-specific material is necessary to understand the passage, make the address/context intelligible without presenting it as the reader's obligation.

Do not force a Noahide note onto every verse. Applicability/context is a data decision, not a template slot that must be filled.

## Phase 4 — visual research through implementation

Build **three materially different complete design hypotheses** using the same real Genesis 1:1–5 dataset.

### Direction A — Editorial Modernism

Book-design discipline, optical typography, large calm whitespace, restrained deep blue, extremely low chrome.

### Direction B — Quiet Scholarly

The calm reader remains dominant while source/provenance relationships become slightly more visible and elegant.

### Direction C — Immersive Reader

Strongest mobile/gesture ergonomics, disappearing chrome, focus continuity and exceptionally polished study sheet.

For each direction, render and inspect at:

- 390 × 844;
- 768 × 1024;
- 1440 × 1000.

Capture at least:

- home/cover;
- reader idle;
- Genesis 1:1 selected;
- Understand open;
- Sources open;
- enlarged text;
- mixed Hebrew/LTR state.

Write a comparison across:

- reading calm;
- Hebrew quality;
- type hierarchy;
- visual distinctiveness;
- discoverability;
- novice comprehension;
- whitespace rhythm;
- mobile ergonomics;
- accessibility;
- source-layer clarity;
- implementation complexity.

Select a winner deliberately, synthesize any superior element from another direction only when it strengthens coherence, then delete dead experiments.

If the winner still resembles a starter kit, Shadcn/demo page, dashboard or generic “minimal” template, continue iterating.

## Phase 5 — typography laboratory

Create `/design/type-proof`.

Self-host and compare legally approved fonts documented in the stack research.

At minimum compare:

- Frank Ruhl Libre;
- Noto Serif Hebrew;
- any additional verified open Hebrew candidates retained after license check;
- Literata or another verified long-form open Latin candidate.

Render real Hebrew with full niqqud and te'amim at several sizes/line heights using:

- Genesis 1:1;
- Deuteronomy 6:4–5;
- Isaiah 52:13–53:3;
- a Psalm 119 sample.

Inspect:

- diacritic/cantillation placement;
- glyph clarity;
- mobile rasterization;
- mixed-direction punctuation;
- rhythm over multiple lines;
- long-form fatigue;
- enlarged-text behavior.

Choose by rendered evidence and record exact font source/license in the manifest.

## Phase 6 — public product surfaces

### Home / cover

Treat the home as a contemporary book cover and entrance to a library, not a marketing funnel.

First viewport should be compositionally restrained:

- precise custom geometric Magen David publishing mark;
- project wordmark;
- one concise statement of purpose;
- Begin Reading / Continue Reading;
- quiet orientation to Tanakh.

Below the fold:

- Torah / Nevi'im / Ketuvim;
- a small set of guided pathways;
- project/source/review transparency.

A screenshot with every optional control closed must still look complete and intentional.

### Library

Create clear Tanakh navigation for a reader who may know Christian/Portuguese book names but not Hebrew naming conventions.

Support:

- canonical project refs independent of display names;
- Hebrew titles;
- English/Portuguese aliases;
- localized routing;
- predictable chapter navigation.

### READ

Create a distraction-free long-form reader.

Desktop target:

- approximate 680–760px primary reading measure;
- excellent Hebrew line-height;
- translation readable but visually subordinate to Hebrew/source hierarchy;
- subtle verse affordance;
- controls recede during reading;
- stable font/layout loading.

Mobile target:

- single primary column;
- Hebrew/translation stack naturally;
- large touch target without turning every verse into a card;
- minimal chrome while reading.

Appearance controls should be only the ones that materially improve reading, such as:

- text size;
- Hebrew visibility;
- translation visibility/version;
- optional low-light mode only if executed at the same quality bar.

### UNDERSTAND

This is the defining product surface.

Selecting a verse opens a clear guided layer while preserving reading context.

Desktop: polished 380–430px rail.

Mobile: accessible Drawer/bottom sheet with compact and expanded states.

When data exists, organize approximately:

1. Understanding the verse
2. Rashi
3. Why Rashi comments here
4. Understanding Rashi
5. Where this comes from
6. Words / terms
7. Who is being addressed? / applicability context where useful
8. For Bnei Noach where a real reviewed relevance exists
9. Sources & provenance
10. Continue in Sefaria

Historical source, project elucidation and reviewed normative guidance should feel like distinct editorial species without using ugly warning-card UI.

### SOURCES

Allow deliberate depth:

- exact Rashi segment/version;
- relevant Siftei Chakhamim;
- approved additional supercommentary;
- Midrash/Gemara links or bundled source where rights allow;
- related Tanakh passages;
- alternative classical voices where useful;
- source relationship/provenance view;
- version/license details;
- canonical Sefaria links.

The Sources mode may be denser because the reader explicitly requested depth.

## Phase 7 — durable reasons to return

Implement the highest-value low-cost retention features that strengthen study rather than gamify belief.

### Required v1

Local-first/privacy-preserving:

- Continue Reading;
- last passage;
- reading progress;
- display preferences;
- simple local saved passages/bookmarks if this can be executed cleanly.

No account is required.

### High-value interaction candidates

Implement if they can meet the same design/quality bar without delaying the core:

- **Why is this here?** — explains why the selected commentary/source was surfaced.
- **Who is this addressed to?** — compact address/context explanation.
- **Source ladder** — restrained relation path such as `Genesis 1:1 → Rashi → Siftei Chakhamim → project elucidation`.
- **Read around it** — expand surrounding literary context.
- **What the classical reader notices** — identify the textual feature that triggered commentary.

### Optional word inspector

Only if the core experience is already polished, use the open OSHB/BDB stack to prototype a word-level inspector for:

- pointed Hebrew;
- lemma;
- basic morphology;
- concise gloss;
- BDB/deeper lexical link.

Do not introduce a proprietary lexical API.

## Phase 8 — guided-path architecture

Create the route/content architecture for guided pathways, even if only the first one is substantially populated in v1.

Priority order:

1. Creation and Humanity — Genesis 1–11.
2. What Hashem Requires of Humanity.
3. The One God.
4. Teshuvah.
5. Justice and the Righteous Gentile.
6. The Nations in the Prophets.
7. Reading Rashi for the First Time.
8. Coming from a Christian Bible — optional textual orientation, context-first.

Guided paths should be structured editorial sequences over canonical passages, not duplicate/copy the passage corpus.

## Phase 9 — localization

Build locale-aware routing and UI from the first implementation.

English and Portuguese are first-class interface targets.

Requirements:

- correct RTL/LTR isolation;
- localized UI strings;
- localized book names/aliases;
- version-aware translation availability;
- graceful absence of a source translation in one language;
- language changes never alter the canonical ref.

Do not bundle a Portuguese Tanakh translation whose concrete rights are unknown merely to fill the locale.

Project-written Portuguese elucidation is separate from scripture translation.

## Phase 10 — local/static search

Implement useful v1 search without recreating Sefaria search.

Prioritize:

- canonical refs;
- book/chapter/verse;
- Hebrew/English/Portuguese aliases;
- project glossary;
- guided paths/topics.

Use a simple local index or Pagefind if justified by final architecture.

Deep full-library search remains a Sefaria handoff.

## Phase 11 — review/editor surface

Build a compact review-state view suitable for a rabbi/editor who is not a GitHub power user.

A reviewer inspecting Genesis 1:1–5 should be able to see:

- source/version verified;
- citation/evidence state;
- rights/license state;
- editorial elucidation state;
- applicability/scope state;
- rabbinic review state where relevant;
- content revision/hash.

Design interaction architecture for:

- approve/review;
- request correction;
- add source/note;
- choose scope category;
- mark dispute.

For v1, privileged persistence may remain repository/development-oriented. Do not create a public auth/database system just to simulate a future editor backend.

## Phase 12 — accessibility

Treat accessibility as editorial quality.

Implement/test:

- semantic HTML and landmarks;
- keyboard-complete reading/study workflow;
- visible focus;
- correct Drawer/Dialog focus and dismissal;
- screen-reader verse/action labels;
- correct `lang`/`dir`;
- reduced motion;
- contrast;
- 200% zoom;
- enlarged text;
- touch ergonomics;
- mixed RTL/LTR punctuation.

Use Playwright + axe automation and manual keyboard/zoom testing.

## Phase 13 — security and supply chain

Implement the controls in `docs/SECURITY_AND_QA.md` and the final open-source stack.

Establish:

- strict schema validation of external/provider data;
- safe text/markup handling;
- restrictive static-compatible security headers/CSP;
- no secrets in browser/build output;
- no public privileged review mutations;
- external URL validation;
- dependency vulnerability scan;
- dependency license allowlist scan;
- gitleaks CLI secret scan;
- GitHub-native CodeQL/Dependabot as optional additional layers where available;
- zero runtime AI prompt-injection surface in v1.

Do not rely exclusively on a paid/hosted security service. Core checks must be runnable locally/open-source.

## Phase 14 — PWA/offline

Make the app installable only if the implementation remains clean and license-aware.

If PWA is enabled:

- cache application shell/assets;
- cache text only when its manifest says offline is allowed;
- tie corpus cache versioning to manifest/content hashes;
- never indiscriminately cache unknown-rights API responses;
- do not make the site depend on service-worker success.

## Phase 15 — performance and regression gates

Set up local + CI commands for:

- format;
- lint;
- strict typecheck;
- unit/component tests;
- content schema validation;
- source/provenance validation;
- license manifest validation;
- production static build;
- generic static-server smoke test;
- provider-offline smoke test;
- Playwright E2E mobile/desktop;
- axe accessibility;
- RTL/LTR regressions;
- screenshot visual regression;
- Lighthouse CI/performance budgets;
- dependency vulnerability/license checks;
- secret scanning.

Optimize for document behavior:

- static HTML;
- minimal hydration;
- self-hosted fonts;
- stable layout;
- fast LCP;
- no heavy decorative imagery;
- no required live API for the released chapter.

## Phase 16 — free deployment and portability

Configure a working free deployment path for the public repository using **GitHub Pages** and Astro's supported static deployment workflow.

Also prove host independence:

- `pnpm build` creates self-contained `dist/`;
- serve `dist/` with a generic static HTTP server;
- no Vercel/Cloudflare-specific runtime API is required;
- custom-domain instructions are host-agnostic;
- optional minimal Nginx/static-container recipe may be added for future institutional hosting.

The public product must remain usable if deployment moves away from GitHub.

## Phase 17 — polish loop

After functional completion, begin the serious visual refinement pass.

Use a real browser repeatedly on desktop/tablet/mobile.

Inspect and refine:

- exact text measure;
- optical alignment;
- baseline/vertical rhythm;
- Hebrew/translation hierarchy;
- whitespace;
- selected verse state;
- study rail entrance/exit;
- mobile sheet snap points and keyboard behavior;
- focus/hover/touch states;
- line breaks;
- Magen David/wordmark balance;
- animation timing;
- loading/error/empty states;
- responsive transitions;
- enlarged text;
- all visual states required by screenshot regression.

Use subtractive refinement first.

If a screen feels generic, fix composition/type/hierarchy rather than adding cards, gradients, shadows, illustrations or ornaments.

Repeat this loop until the final key screenshots are materially stronger than the first functional implementation.

## Phase 18 — prove content scalability

After Genesis 1:1–5 is complete, add **Genesis 1:6** using only the documented content/ingestion workflow.

Do not modify core UI components merely to accommodate the new verse.

If the new passage requires component surgery, repair the architecture before final PR.

## Phase 19 — documentation and handoff

Before opening the final PR:

- update README with actual run/build/test/deploy commands;
- document architecture;
- document corpus/provider flow;
- document exact source/font/dependency licenses;
- document content authoring/review workflow;
- document how to add a passage;
- document local progress/storage behavior;
- document security/test commands;
- include final screenshots at required breakpoints;
- include the visual-direction decision record;
- include known limitations;
- explain the path from Genesis 1:1–5 to Genesis 1–11;
- include a reviewer guide for a rabbi/editor who is not a GitHub power user.

## Final acceptance journey

A first-time user should be able to:

1. arrive without knowing what Rashi or Sefaria is;
2. understand immediately why this product is more useful to them than a generic Bible reader;
3. begin Genesis without onboarding friction;
4. see Hebrew/source/translation hierarchy clearly;
5. select Genesis 1:1;
6. meet Rashi as Rashi rather than anonymous app prose;
7. understand why Rashi comments there;
8. inspect the classical/source chain supporting the elucidation;
9. understand whether a point is universal/Noahide, Israel-covenant context, or Jewish-practice-specific when that distinction matters;
10. enter Sources without losing reading context;
11. continue into Sefaria when ready;
12. resume their reading later without an account;
13. complete the journey by touch, keyboard and screen reader;
14. trust the exact version/provenance/license behind bundled sources.

## Final technical acceptance

The build is complete only when:

- the final reader is visibly polished at mobile/tablet/desktop;
- all open-source/rights manifests pass;
- Genesis 1:1–5 works with external APIs unavailable;
- the build needs no paid credentials;
- static `dist/` works on a generic server;
- GitHub Pages deployment is configured/testable;
- tests enforce content integrity, accessibility, security, performance and visual regressions;
- Genesis 1:6 proves scalability;
- all dead design experiments/dependencies are removed;
- the repository is understandable by a future technical or rabbinic steward.

Open a final PR into `main` with all evidence. **Do not merge it.**