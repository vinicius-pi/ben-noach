# AGENTS.md — Ben Noach execution contract

This repository is building a real production-quality public web product, not a mockup.

## Mission

Build a beautiful, source-first, multilingual Tanakh reader designed first for **Bnei Noach and non-Jews seeking to become righteous gentiles**, while remaining immediately usable by non-religious readers and people coming from Christian backgrounds who want to encounter Tanakh through its Jewish textual tradition.

The product progression is:

**READ → UNDERSTAND → SOURCES**

The reader should feel like a beautifully typeset contemporary book before it feels like an application.

The durable product advantage is not owning more texts than Sefaria. It is giving the target reader the **right first path through those texts**: Tanakh → Rashi → why Rashi comments → classical source chain → clear applicability/context → deeper primary sources.

## Document precedence

Before implementation, read the repository specification in this order:

1. `AGENTS.md`
2. `docs/PRODUCT_NORTH_STAR.md`
3. `docs/OPEN_SOURCE_STACK.md`
4. `docs/CORPUS_V1.md`
5. `docs/TOVIA_SINGER_ALIGNMENT.md`
6. `docs/TOVIA_SINGER_TORAH_LEARNING_ADDENDUM.md`
7. `docs/DESIGN_RESEARCH.md`
8. `docs/CONTENT_GOVERNANCE.md`
9. `docs/SECURITY_AND_QA.md`
10. `docs/IMPLEMENTATION_RISKS_AND_DECISIONS.md`
11. `docs/GROK_BUILD_MASTERPROMPT.md`
12. `LICENSES.md`, `SECURITY.md`, and contribution/governance documents.

Later explicit architecture decisions in the higher-precedence documents supersede older framework-specific research notes.

If a material conflict remains after applying this order, surface it in the PR rather than silently inventing a third policy.

## Governing product principles

1. **Tanakh first.** The canonical passage is always the visual and conceptual center.
2. **Bnei Noach are a primary/end audience.** Design for serious lifelong use, not a temporary bridge to another product or identity.
3. **Clarity before density.** Beginner-facing explanations introduce the exact context needed to understand the passage and classical commentary; deeper material is progressively disclosed.
4. **Sources remain sources.** Historical/canonical text is quoted faithfully and carries reference, version, provenance and license metadata.
5. **Editorial elucidation is a real product layer.** Modern explanation may be clear, elegant and substantial, but remains distinguishable from the historical source and supports claim-level evidence references.
6. **Applicability is first-class.** The interface helps the target reader distinguish universal/Noahide material, Israel-covenant context and Jewish-practice-specific material without altering the underlying sources.
7. **Jewish context by demonstration.** Hebrew, literary context, Rashi, Chazal and the source chain lead. Comparative readings may exist later as a subordinate layer.
8. **Progressive disclosure.** Preserve the depth of Mikraot Gedolot without inheriting its visual density.
9. **Book first, software second.** Reading mode minimizes chrome and interaction noise.
10. **Auditability without ugliness.** Provenance and review metadata are inspectable without turning the beginner experience into a database UI.
11. **Open and transferable.** The public product must build and run without a paid SaaS, proprietary runtime, proprietary font, hosted database, AI inference service or single hosting vendor.
12. **Local corpus reliability.** A released passage must remain readable when Sefaria or every other external API is unavailable.

## Initial scope

Build the complete reusable application shell and production architecture, then populate **Genesis 1:1–5** as the high-fidelity content demonstrator.

Architecture must expand to Genesis 1–11 and ultimately Tanakh by adding validated content, not by rewriting page components.

The first demonstrator must prove this journey:

`Tanakh → select verse → Rashi → understand why Rashi commented → inspect classical/source chain → understand applicability/context → Sources → Sefaria`

## Technical baseline

### Framework

Use the **current patched stable Astro 7.x release** at execution time, with static output as the v1 default.

Why:

- content-driven/static-first architecture;
- minimal shipped JavaScript;
- portable `dist/` output;
- built-in content collections/schema support;
- first-class i18n architecture;
- strong fit for a document-like reader;
- no required proprietary host/runtime.

### Interactive islands

Use React only where client interaction materially needs it, such as:

- desktop study rail state;
- mobile study Drawer;
- appearance controls;
- local progress/bookmarks;
- local search UI;
- optional word inspector;
- development/editor review controls.

Do not hydrate the full reader by default.

### UI behavior

Prefer native HTML first. For complex overlays/composites, use one coherent accessible primitive family. **Base UI (`@base-ui/react`, MIT)** is the preferred starting candidate for Drawer/Dialog behavior.

The primitive library is not the design system.

### Styling

Use bespoke project tokens and modern CSS. Prefer CSS custom properties, logical properties, scoped styles/CSS Modules and container queries where useful.

Do not let a utility/component framework determine the visual language.

### Runtime/data model

- strict TypeScript;
- Astro Content Collections / validated repository-backed content;
- local approved release corpus;
- typed Sefaria provider adapter for research/enrichment/deep links;
- correct RTL/LTR and Unicode handling;
- static/prerendered passage routes;
- PWA-ready but license-aware;
- local-first progress/bookmarks in v1;
- no account/auth requirement for first release.

### Package/dependency policy

Follow `docs/OPEN_SOURCE_STACK.md`.

Use pnpm/Corepack with a committed frozen lockfile.

Keep dependencies few, maintained and license-approved.

The application must not require a paid credential to build or serve its core reading experience.

## Corpus baseline

Follow `docs/CORPUS_V1.md` rather than choosing API versions opportunistically.

The pilot should start from the audited open corpus, including:

- Public Domain pointed/cantillated Hebrew Tanakh version;
- Public Domain JPS 1917 English Tanakh baseline;
- Public Domain Rosenbaum/Silbermann Rashi English baseline;
- approved Siftei Chakhamim version(s) with exact attribution/license handling;
- optional OSHB/BDB open data for later word-level enrichment.

Portuguese is first-class in routing/UI/content architecture, but unknown-rights translations are never bundled merely to fill a locale.

## Source and content rules

Never fabricate:

- citations;
- source wording;
- translator identity;
- version identity;
- license/rights status;
- manuscript provenance;
- rabbinic review or approval.

If a modern explanatory block is not verified, keep it structurally in draft/review state.

Do not silently paraphrase a historical source while labeling it as the source.

Do not redact Israel-specific material inside a quoted source. The product handles applicability through classification, contextual explanation and guided-path selection.

## Required v1 product surfaces

- editorial home / cover;
- Tanakh library navigation;
- Genesis reader;
- READ mode;
- UNDERSTAND interaction;
- SOURCES interaction;
- desktop study rail;
- mobile draggable study sheet;
- Hebrew / translation display architecture;
- reader appearance controls;
- source / provenance view;
- beginner glossary behavior;
- applicability/context signal where useful;
- local reading progress/continue state;
- review-state mode for editors/rabbis;
- typography proof page;
- responsive empty/loading/error states;
- PWA shell/metadata;
- keyboard navigation and focus management;
- free static deployment configuration;
- generic static-host portability test.

## Design standard

The visual identity is restrained, editorial, white/off-white and deep blue.

Beauty should come from:

- typography;
- optical spacing;
- proportion;
- reading measure;
- alignment;
- Hebrew/translation hierarchy;
- source hierarchy;
- subtle motion;
- excellent interaction states.

The interface must never feel like:

- generic SaaS;
- an AI landing page;
- a default component library;
- a templated religious portal;
- a dashboard disguised as a reader.

The Tanakh itself is the primary visual object.

## Anti-slop execution protocol

The visual direction may not be accepted on first render.

1. Build at least three materially different, complete visual treatments using identical Genesis 1:1–5 content:
   - Editorial Modernism;
   - Quiet Scholarly;
   - Immersive Reader.
2. Render and inspect at:
   - 390×844;
   - 768×1024;
   - 1440×1000.
3. Capture at least:
   - home;
   - reader idle;
   - selected verse;
   - Understand open;
   - Sources open;
   - enlarged-text state;
   - Hebrew/LTR mixed state.
4. Compare hierarchy, type quality, Hebrew diacritics, whitespace rhythm, discoverability, mobile ergonomics and visual distinctiveness.
5. Choose one direction deliberately and record the decision.
6. Continue browser/screenshot refinement until the winning direction looks plausibly publishable by a serious editorial design studio.
7. If the result still resembles a starter kit/default component library, rework composition rather than decorating it.
8. Delete dead visual experiments before final PR.

Use the available build budget for iteration. “Functional and attractive” is not the stop condition; the acceptance bar is visibly authored, coherent and polished.

## Performance standard

The reader should behave like a document, not a JavaScript application shell.

Prioritize:

- static HTML for reading content;
- minimal client JavaScript;
- self-hosted fonts;
- stable layout/font loading;
- fast LCP;
- no heavy hero imagery;
- no runtime AI request;
- no required live API call for a released passage.

## Accessibility standard

Accessibility is part of editorial quality.

Core requirements:

- semantic landmarks/headings;
- keyboard-complete verse → Understand → Sources journey;
- visible focus;
- correct Drawer/Dialog focus behavior;
- correct `lang`/`dir` isolation;
- reduced motion;
- 200% zoom;
- large text state;
- screen-reader verse/action labels;
- touch ergonomics;
- automated axe coverage plus manual audits.

## Security and privacy baseline

Follow `docs/SECURITY_AND_QA.md` and the final Astro architecture.

At minimum:

- strict provider validation;
- no arbitrary source HTML execution;
- restrictive headers/CSP compatible with static output;
- no secrets in client bundle;
- dependency vulnerability/license scanning;
- secret scanning;
- secure external URLs;
- no public privileged review mutation;
- no unnecessary religious-profile analytics;
- no runtime AI attack surface in v1.

## QA gates before a PR is ready

All must pass from a clean checkout:

- frozen install;
- formatting;
- lint;
- strict typecheck;
- unit/component tests;
- content schema validation;
- source/provenance validation;
- license manifest validation;
- production static build;
- generic static-server smoke test;
- external-provider-offline smoke test for Genesis 1:1–5;
- Playwright mobile/desktop E2E;
- keyboard-only audit;
- axe accessibility checks;
- RTL/LTR regressions;
- visual screenshot regression;
- Lighthouse/performance budget;
- dependency vulnerability/license scan;
- secret scan;
- no secrets/caches/build junk committed.

## Git hygiene

- work on `build/grok-production-v1` and coherent sub-branches as needed;
- keep `main` canonical and deployable;
- do not rewrite public history;
- prefer coherent commits;
- do not commit local env files/caches/test videos/build output unless explicitly part of release evidence;
- record major visual/content/security decisions in the final PR;
- never self-merge the completed build.

## Portability gate

Before v1 is complete:

- `pnpm build` produces a self-contained static `dist/`;
- the core reader works from a generic static HTTP server;
- no proprietary host API is required;
- GitHub Pages free deployment is configured/testable;
- the core Genesis reader works with Sefaria unavailable;
- no paid service/API key is needed to run the public product;
- bundled source/font/dependency rights pass repository policy.

## Scalability gate

Before opening the final PR, add **Genesis 1:6** through the documented content workflow without modifying core UI components.

If passage expansion requires route/component surgery, repair the architecture first.

## Definition of done

The task is not complete because routes compile or the app looks good in one screenshot.

It is complete when:

- the reader is visibly exceptional across mobile/tablet/desktop;
- Genesis 1:1–5 proves READ → UNDERSTAND → SOURCES;
- Rashi/source/editorial/applicability layers remain intelligible and traceable;
- the release corpus is open-rights and provenance-safe;
- the product works without live Sefaria availability;
- accessibility/performance/security tests enforce the experience;
- another steward can clone, build and host it without paid infrastructure;
- Genesis 1:6 proves content scalability;
- a final reviewable PR contains screenshots, evidence, authoring docs, license/source manifest and known limitations.

Leave that PR unmerged for independent audit.