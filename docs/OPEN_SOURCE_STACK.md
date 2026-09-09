# Open-source, zero-lock-in technical stack

## Objective

Ben Noach must remain buildable, deployable, auditable and transferable without depending on a paid SaaS, proprietary UI kit, proprietary database, proprietary font, closed search service, or a single hosting vendor.

The default architecture is therefore:

> **static-first + local corpus + small interactive islands + open standards + permissive dependencies + provider adapters**

A future rabbinic/nonprofit steward should be able to clone the repository, build it on a normal machine, host the generated files almost anywhere, and continue the project without buying a commercial dependency.

## Framework decision

### Preferred baseline: Astro 7.x, current patched stable release

At the September 2026 research checkpoint, Astro 7.2 is current. The build agent must verify the latest patched stable 7.x release and current security notes immediately before scaffolding.

Why Astro fits this product:

- MIT licensed;
- designed for content-driven websites;
- static output is the default;
- minimal client JavaScript by default;
- supports React islands only where interaction needs them;
- built-in i18n routing;
- content collections with schema validation;
- built-in CSP support in modern releases;
- built-in font tooling;
- portable deployment across static hosts;
- official GitHub Pages deployment path;
- no requirement for a Vercel/Cloudflare runtime;
- excellent fit for a reader where most content should remain document-like HTML.

Primary documentation:

- https://astro.build/
- https://docs.astro.build/
- https://docs.astro.build/en/guides/deploy/github/
- https://docs.astro.build/en/guides/internationalization/

### Rendering target

Use:

```text
output: static
```

for v1 unless a concrete required feature cannot be implemented safely without a server.

The public reader, guided paths, glossary, source pages and v1 review visualization should all be capable of static output.

### Interactive islands

Use React only for interaction that materially benefits from a client component, such as:

- mobile study Drawer;
- desktop study rail state;
- appearance controls;
- local reading progress/bookmarks;
- search UI;
- optional word inspector;
- review tools in development/editor mode.

Do not hydrate the entire reader merely because React is available.

## UI primitive decision

### Base UI (`@base-ui/react`)

Preferred accessible primitive family for the small number of composite widgets that genuinely need it.

Reasons:

- MIT licensed;
- unstyled/headless;
- stable Drawer built on the same Dialog foundation;
- strong focus/keyboard behavior;
- gesture/snap-point support appropriate to the mobile study sheet;
- avoids combining several competing overlay systems.

Source:

- https://github.com/mui/base-ui
- https://base-ui.com/react/components/drawer

Use Base UI as **behavior infrastructure**, not as a visual design system.

### Native elements first

Prefer native HTML for:

- links;
- buttons;
- details/disclosure where semantics fit;
- headings;
- navigation;
- forms;
- progress;
- text selection.

A dependency is justified when it removes real accessibility/input complexity.

## Styling

Preferred:

- CSS custom properties for design tokens;
- scoped `.astro` styles or CSS Modules;
- modern native CSS (`clamp`, logical properties, container queries where useful);
- no required utility framework.

Tailwind is MIT and legally acceptable, but it is not necessary for this product. The build agent may use it only if it demonstrably improves implementation without producing a generic component vocabulary or inflating dependency surface.

The final design system belongs to the project, not to a component framework.

## Content architecture

Use Astro Content Collections plus schema validation for repository-backed content.

Store canonical content as data, not JSX/page-specific code.

Recommended collections/domain objects:

- `passages`
- `textVersions`
- `commentaryWorks`
- `commentarySegments`
- `elucidations`
- `sourceLinks`
- `topics`
- `guidedPaths`
- `glossary`
- `reviewRecords`
- `licenses`
- `providers`

All content entries must pass schema validation at build time.

## Primary corpus strategy

The public product must work even if Sefaria is temporarily unreachable.

### Local corpus is the shipped source of truth

For passages included in a release:

1. ingest only versions explicitly approved by the rights manifest;
2. preserve exact source/version/provenance metadata;
3. store normalized release data locally;
4. hash source payloads;
5. render from local content at runtime.

### Sefaria is an enrichment/deep-library provider

Use a typed Sefaria adapter for:

- reference normalization/verification;
- version metadata;
- source links;
- research-time retrieval;
- update comparison;
- outbound `Open in Sefaria` links.

The beginner reader must not fail because Sefaria has an outage.

Do not copy or fork Sefaria's GPL application code into the project merely to access its texts.

Each Sefaria text version is governed by its own rights metadata.

## Open Hebrew data

### Display text

For v1, prefer the Sefaria version **Tanach with Ta'amei Hamikra**, sourced from tanach.us and marked Public Domain, for the pointed/cantillated Hebrew display text.

Record the exact Sefaria version identifier and retrieval provenance.

### Word-level morphology

Open Scriptures Hebrew Bible (OSHB / MorphHB) is approved as an optional build-time lexical/morphology source:

- WLC underlying text: Public Domain;
- lemma and morphology data: CC BY 4.0;
- complete word-level identifiers/morphological data;
- includes pointing/cantillation data.

Source:

https://github.com/openscriptures/morphhb

Use it for later word-inspector functionality and alignment; do not silently replace the selected project text version with another edition.

### Lexicon

For later Hebrew word inspection, prefer open BDB data.

Approved candidates:

- BibleAquifer/BDBHebrewLexicon — CC0 edition;
- Sefaria BDB version — Public Domain;
- OpenScriptures HebrewLexicon — BDB text Public Domain, project data CC BY 4.0.

The beginner UI should provide a concise project gloss first and expose BDB as the deep lexical source.

## Initial English source stack

Prefer versions with minimal future restrictions.

### Tanakh translation

Primary safe candidate:

**The Holy Scriptures: A New Translation (JPS 1917)**

- Jewish Publication Society;
- Public Domain;
- available through Sefaria/Open Siddur;
- exact wording preserved.

A second optional version may be added only if its license is explicitly approved in the manifest.

The Sefaria Community Translation is CC0 and may be evaluated as an optional modern-English version, but editorial quality/consistency must be reviewed before it becomes a default.

### Rashi

**M. Rosenbaum and A. M. Silbermann, 1929–1934**

- Rashi Hebrew/source and English translation available through Sefaria;
- Sefaria marks the version Public Domain.

This is the preferred no-lock-in English Rashi baseline for the pilot.

### Siftei Chakhamim

- Hebrew alternate version on Sefaria is marked Public Domain;
- Metsudah English version on Sefaria is CC BY.

CC BY content is acceptable when attribution is machine-enforced.

No proprietary/unknown-rights translation may silently replace it.

## Portuguese policy

At the September 2026 checkpoint, several Portuguese Genesis versions visible in Sefaria have `unknown`/blank license metadata.

Therefore:

- Portuguese is first-class in UI/routing from day one;
- unknown-rights Portuguese source text is **not bundled into production**;
- the architecture supports a Portuguese translation as soon as a suitable Public Domain/CC0/CC BY version is verified or permission is obtained;
- project-written Portuguese beginner elucidation can exist separately from translation text and must never be presented as a translation of Tanakh;
- a reviewed project translation may be considered later as its own serious editorial project, never as an automatic LLM substitute.

This avoids building v1 on a rights uncertainty that would later block transfer or public distribution.

## Search

### v1

Use a small local index for:

- canonical refs;
- localized book names;
- aliases (`Genesis`, `Bereshit`, `Gênesis`);
- glossary;
- guided paths/topics.

### scale-up

Preferred open-source static search candidate:

**Pagefind**

- MIT licensed;
- static;
- low-bandwidth;
- requires no hosted search backend.

Source:

https://github.com/CloudCannon/pagefind

Deep full-library search remains a Sefaria handoff unless the project later has a clear reason to own it.

## PWA / offline

Preferred tooling:

**vite-plugin-pwa** — MIT.

PWA support should be license-aware:

- application shell/assets may be cached;
- only source versions with `offlineAllowed: true` in the rights manifest may enter offline caches;
- unknown-rights/remote research responses never enter indiscriminate cache-first strategies;
- cache version changes are tied to corpus manifest hashes.

A PWA is an installation convenience, not an excuse to make the site depend on a service worker.

## Typography

Self-host all fonts used in production.

No runtime call to Google Fonts or another font CDN is required.

Preferred candidates:

### Hebrew

- Frank Ruhl Libre — OFL-1.1;
- Noto Serif Hebrew — OFL-1.1.

Additional open candidates may enter the `/design/type-proof` test only after license verification.

### Latin

- Literata — OFL-1.1, specifically designed for long-form screen reading;
- a high-quality open sans for interface text only if necessary.

Use the typography proof page to choose by rendered evidence, not brand familiarity.

## Package manager / runtime

Use current maintained Node LTS compatible with the chosen Astro release.

Use **pnpm** with Corepack and a committed lockfile.

pnpm is MIT licensed.

Requirements:

- `packageManager` field pinned in `package.json`;
- frozen lockfile in CI;
- no arbitrary postinstall scripts unless reviewed;
- reproducible clean install documented.

## Tests and QA — open-source only

Preferred stack:

- Vitest — MIT;
- Playwright — Apache-2.0;
- axe-core / Playwright integration — MPL-2.0;
- Lighthouse CI — Apache-2.0.

The test commands must run locally. GitHub Actions is orchestration, not the only place quality checks can run.

## Security tooling

Keep the core security checks runnable without a paid GitHub feature.

### Dependency vulnerabilities and licenses

Use **OSV-Scanner** where practical.

It supports both vulnerability scanning and SPDX license allowlists.

Example policy concept:

```text
MIT
Apache-2.0
BSD-2-Clause
BSD-3-Clause
ISC
0BSD
MPL-2.0
CC0-1.0
OFL-1.1
```

Content/data licenses are governed separately and may include approved `CC-BY-4.0`.

### Secret scanning

Use the open-source **gitleaks CLI** (MIT) directly rather than making the repository dependent on the separately licensed hosted Gitleaks GitHub Action.

Run the binary/container/installer in CI according to a pinned verified release.

### GitHub-native extras

For a public repository, CodeQL/Dependabot may be enabled as additional layers, but the project must retain local/open-source commands that provide a meaningful baseline if the repository later moves away from GitHub.

## License admission policy

### Preferred software dependency licenses

Allow by default after normal due diligence:

- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- ISC
- 0BSD
- MPL-2.0

### Font licenses

- OFL-1.1

### Content/data licenses

Preferred:

- Public Domain
- CC0-1.0
- CC-BY-4.0 / compatible attribution licenses

Case-by-case only:

- CC-BY-SA — only when share-alike implications are isolated and intentional.

Avoid bundling in the core release unless explicit project-level approval is recorded:

- `unknown`/blank rights;
- proprietary copyright;
- `NC` restrictions;
- source-available/commercial-free-tier licenses;
- GPL/AGPL runtime libraries;
- LGPL JavaScript dependencies where bundling obligations create ambiguity;
- assets requiring an online license server or API key.

This is intentionally more conservative than what is legally possible. The goal is maximum transferability and minimum future friction.

## Hosting and portability

### Primary free deployment

GitHub Pages is suitable for the public static build while the repository remains public.

Astro has an official GitHub Pages deployment workflow.

### Portability test

The same build output must also be servable by a generic static HTTP server.

Before v1 is considered portable:

1. `pnpm build` must create a self-contained `dist/`;
2. `dist/` must run with a generic static server;
3. no Vercel/Cloudflare-specific runtime API may be required;
4. documented custom-domain deployment must be host-agnostic;
5. an optional minimal Nginx/container recipe may be provided for institutional self-hosting.

## External services

Every external service must have an adapter and an offline/failed state.

Approved conceptual providers:

- Sefaria: source/version metadata, research enrichment, deep links;
- GitHub: source collaboration/CI/Pages deployment.

The public reading journey must not require:

- authentication service;
- hosted database;
- proprietary CMS;
- analytics SaaS;
- hosted search SaaS;
- AI inference API;
- payment service.

## AI policy in the shipped product

Grok/LLMs may be used during development/research/editorial drafting.

The v1 public product does **not** require an AI API at runtime.

This gives the project:

- zero inference cost;
- deterministic output;
- no prompt-injection surface in the public reader;
- no vendor model lock-in;
- reviewable/static editorial content;
- straightforward transfer to another steward.

If AI features are ever added, they must be optional adapters that do not replace the curated reader.

## Final portability gate

The build agent must demonstrate all of the following before the v1 PR is ready:

- a clean build from the repository with no paid credentials;
- a working static build with network disabled after dependencies are installed;
- core Genesis reading works without Sefaria runtime availability;
- no proprietary font/UI package is required;
- dependency licenses pass the allowlist policy;
- every bundled text has approved rights metadata;
- GitHub Pages deployment works or has a complete tested configuration;
- the built `dist/` can be hosted elsewhere unchanged.