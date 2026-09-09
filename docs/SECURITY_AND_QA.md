# Security and QA baseline

## Security posture

The first public release is primarily a **static, read-only content application**. Preserve that small attack surface.

The highest-value assets are:

- integrity of displayed sacred/classical text;
- integrity of version identity, attribution and provenance;
- integrity of editorial/review state;
- availability of the reader even when external providers fail;
- privacy of local reading state and any future reviewer/user accounts;
- build/deployment credentials.

A secure build that displays the wrong sacred text, wrong version attribution or false review status is a failed build. Content integrity and application security are equal release gates.

## Framework baseline

Use the **current patched stable Astro 7.x release** and compatible maintained Node LTS at implementation time.

Do not pin framework versions from a research checkpoint without checking current release/security documentation immediately before scaffolding.

The v1 deployment model is static output. React is used only for interactive islands that materially require it.

Security consequences of this architecture:

- most reading routes ship as static HTML;
- no application server is required for core use;
- no database/authentication surface exists in v1;
- no runtime AI endpoint exists;
- released passages render from a local approved corpus rather than arbitrary upstream responses;
- CSP/headers can be designed for a narrow static origin set.

## Architecture principles

### Read-only core

For the first release:

- no public user-generated HTML;
- no public file upload;
- no arbitrary URL fetcher;
- no open LLM/chat endpoint;
- no hosted database requirement;
- no payment subsystem;
- no public admin mutation surface;
- no user account requirement.

Reading progress/bookmarks are local-first.

Review/editor workflow begins as repository-backed structured data and development/review tooling.

### Local release corpus

A released passage is rendered from locally validated corpus data defined by `docs/CORPUS_V1.md`.

This prevents:

- runtime provider outages from breaking the reader;
- upstream version changes silently changing released text;
- an API returning a different translation without a project release event;
- unknown-rights responses entering the public bundle by accident.

Every release source should have deterministic provenance metadata and a checksum.

### External-provider boundary

Treat Sefaria and every other provider as an untrusted network boundary even when they are authoritative research/content sources.

Use:

- typed provider adapters;
- runtime schema validation;
- timeouts and bounded retries in research/build tooling;
- explicit allowed hosts;
- canonical-ref validation;
- exact version identifiers;
- deterministic normalization;
- safe fallback states;
- update comparison rather than silent replacement.

The public application must never become an unrestricted proxy to Sefaria or another host.

### Rendering safety

External source data may contain markup. Transform it at the provider/ingestion boundary into an explicit safe representation.

If source HTML is supported:

1. parse/normalize at ingestion;
2. retain only the minimal semantic subset needed for text;
3. remove scripts, handlers, styles, forms, embeds and executable URLs;
4. validate links against allowed protocols/hosts where applicable;
5. store/render normalized data instead of repeatedly trusting upstream HTML.

Prefer structured component rendering over arbitrary HTML insertion.

## Browser security policy

Implement/test a restrictive policy appropriate to static Astro deployment.

At minimum evaluate:

- `Content-Security-Policy`;
- `Strict-Transport-Security` in production HTTPS deployments;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy`;
- `Permissions-Policy` denying unused capabilities;
- `frame-ancestors` policy;
- cross-origin policies only where their compatibility trade-offs are understood.

Use Astro's current CSP/security facilities where appropriate, but test the generated static output and deployment host behavior rather than assuming a framework setting is sufficient.

Keep these CSP sources narrow:

- `script-src`;
- `connect-src`;
- `font-src`;
- `img-src`;
- `frame-src`.

Self-host production fonts.

The base reader should not require third-party scripts.

Embedding external media should be an explicit feature with an explicit policy change.

## Secrets/configuration

- Keep `.env*` files out of Git except documented examples containing no credentials.
- Public client variables never contain secrets.
- Prefer providers requiring no credentials for v1.
- GitHub/deployment secrets are used only if a later workflow genuinely requires them.
- Debug/review query parameters may reveal non-sensitive local review state but never grant privileged mutation rights.
- Scan repository history/current diff for secrets before release.

## Dependency and supply-chain policy

Follow `docs/OPEN_SOURCE_STACK.md`.

Required baseline:

- pnpm lockfile committed;
- Corepack/package-manager version pinned;
- deterministic `pnpm install --frozen-lockfile`;
- small dependency graph;
- no arbitrary/unreviewed install scripts;
- OSV-Scanner or equivalent open vulnerability scan;
- software-license allowlist check;
- gitleaks CLI secret scan;
- Dependabot for npm/GitHub Actions while on GitHub;
- CodeQL as an additional GitHub-native layer for the public repository where available;
- pinned/reviewed CI action versions;
- explicit review of large transitive dependency additions.

Do not make security depend exclusively on a commercial SaaS or paid GitHub feature. The meaningful baseline must run locally or in ordinary CI.

Before release, an independent Codex Security scan may be run as a supplementary review if connected; it does not replace the local/open gates.

## Dependency-license drift

A package's version, ownership or license may change.

Controls:

- lock exact resolved versions;
- record direct dependency licenses;
- scan the resolved dependency graph in CI;
- fail on licenses outside the repository allowlist unless an explicit reviewed exception exists;
- treat a newly introduced GPL/AGPL/source-available/proprietary runtime dependency as an architecture decision, not a normal patch.

## Source/content-license drift

Text-provider metadata can also change.

Controls:

- release manifests freeze exact version identity and rights metadata;
- update tooling compares provider metadata to the local manifest;
- rights changes do not silently modify a historical release;
- bundling requires explicit `bundleAllowed` state;
- offline cache requires explicit `offlineAllowed` state.

## Authentication strategy

The initial public reader has no account system.

If reviewer/user accounts are introduced later:

- use a mature open authentication library/provider strategy rather than custom passwords;
- authorize every mutation server-side;
- reviewer role is separate from ordinary reader role;
- record reviewer identity, revision/hash and timestamp;
- protect state-changing requests according to the chosen session model;
- rate-limit authentication/mutation endpoints;
- maintain an audit trail for approval changes.

This future system is not needed to prove v1.

## Privacy

Default to minimal collection.

v1 requires no third-party analytics.

If telemetry is later introduced, answer aggregate product/performance questions without building a sensitive religious-profile dataset.

Do not collect a declared religion/former religion merely to personalize the reader.

Local progress/bookmarks should remain local unless a future explicit sync feature warrants accounts and a new privacy review.

## Accessibility as release engineering

Accessibility is part of correctness because the core product is text and study.

Required baseline:

- semantic headings/landmarks;
- complete keyboard access;
- visible focus;
- correct Drawer/Dialog focus management;
- screen-reader labels for verse actions;
- RTL/LTR semantics;
- sufficient contrast;
- reduced-motion support;
- 200% zoom without loss of content/function;
- touch targets appropriate to mobile;
- readable measure and adjustable type;
- no content meaning encoded only by color.

### Automated accessibility

Use Playwright + axe on core states.

Pair automated checks with:

- manual keyboard pass;
- zoom pass;
- screen-reader spot checks;
- real-device/mobile testing.

Automated accessibility scores are not a substitute for interaction review.

## Visual regression and anti-slop QA

The product is typography/layout-driven, so visual regression is a functional test.

Required screenshot matrix:

- home;
- library;
- reader idle;
- selected verse/focus;
- Understand rail/sheet;
- Sources view;
- Hebrew only;
- translation only;
- bilingual;
- enlarged text;
- mobile/tablet/desktop;
- loading/error/empty states.

Use Playwright deterministic screenshots as the default local/open solution.

Human-review baseline changes. An autonomous agent should never broadly approve its own unexplained visual diffs.

## Performance budgets

A reading application should load like a document.

Use Lighthouse CI and explicit budgets.

Initial targets for representative static routes:

- Performance ≥ 95 in controlled CI;
- Accessibility ≥ 98 plus separate axe gate;
- Best Practices ≥ 95;
- SEO ≥ 95 for public routes;
- LCP ≤ 2.5s under mobile-like conditions;
- CLS ≤ 0.05;
- intentionally small hydrated JavaScript;
- no large hero imagery in the initial viewport.

Tune final thresholds after stable baselines exist, but do not game Lighthouse by degrading the product.

## Test layers

### Unit

Test:

- canonical-ref normalization;
- source-manifest validation;
- source checksum validation;
- review-state transitions;
- license rules;
- applicability/scope taxonomy;
- deep-link generation;
- translation/version selection;
- provider normalization;
- locale/book aliases.

### Content/domain

Test:

- every bundled source has manifest metadata;
- every bundled source has approved rights state;
- required attribution exists;
- every evidence ref resolves;
- no reviewed block lacks valid reviewer/revision metadata;
- no duplicate canonical/content IDs;
- Hebrew fixtures retain deterministic hashes;
- commentary segments retain target identity;
- unknown-rights Portuguese versions do not enter production bundles.

### Component

Test:

- verse rendering;
- RTL/LTR mixtures;
- study rail;
- mobile Drawer;
- source attribution;
- applicability/context UI;
- provenance UI;
- appearance controls;
- local continue-reading behavior;
- keyboard interactions.

### E2E

Playwright flows:

1. open Genesis 1;
2. select Genesis 1:1;
3. open Understand;
4. inspect Rashi/elucidation;
5. inspect applicability/context where present;
6. open Sources;
7. inspect provenance;
8. validate Sefaria deep-link target format;
9. switch display/locale state;
10. navigate the core journey by keyboard;
11. repeat critical flow on mobile;
12. disable/block external provider requests and repeat the released local-corpus journey;
13. resume reading state after reload.

### Portability

Test:

- clean install;
- `pnpm build`;
- serve generated `dist/` with a generic static server;
- navigate core routes without a platform-specific runtime;
- exercise the app with Sefaria/provider network blocked.

## CI structure

Recommended jobs:

### `quality`

- frozen install;
- format check;
- lint;
- typecheck;
- unit/component tests.

### `content-integrity`

- content schemas;
- manifest/provenance validation;
- checksums;
- evidence refs;
- review-state validation;
- content rights/attribution validation.

### `supply-chain`

- OSV vulnerability scan;
- dependency license allowlist;
- gitleaks CLI.

### `build`

- production static build;
- bundle/client-JS budget;
- generic static-server smoke test.

### `e2e`

- Playwright desktop/mobile;
- provider-offline flow;
- axe scans;
- screenshot comparisons.

### `lighthouse`

- representative public routes.

`pnpm qa` is the inner loop. `pnpm qa:full` is the sequential release gate and must actually run every listed step, including fail-closed OSV (`pnpm scan:osv` exits non-zero if the official scanner cannot be obtained). `pnpm scan:osv:local` may warn; it is not a release gate.

Enforced Lighthouse category floors live in `lighthouserc.json` and `scripts/run-lhci.ts`. `pnpm lhci` invokes the Lighthouse CLI against the production preview (Chrome `--no-sandbox` in container CI); it does not treat a missing scanner or a crashed autorun as a pass.

### `security-extra`

- CodeQL/GitHub-native analysis where available.

## GitHub hygiene

Repository baseline should include:

- `.editorconfig`;
- `.gitignore`;
- `.env.example` only if needed;
- Dependabot;
- PR template;
- CODEOWNERS;
- `SECURITY.md`;
- `CONTRIBUTING.md`;
- `GOVERNANCE.md`;
- software/content license separation.

Keep transient test output out of Git. Intentional screenshot baselines are the exception; videos/reports belong in CI artifacts.

## Pre-release adversarial checks

Before public launch, independently attempt to find:

- XSS through provider/source markup;
- malicious ref/path input;
- unsafe/open redirects in deep links;
- unsafe external image/embed behavior;
- leaked environment variables/secrets;
- public access to reviewer mutation logic;
- dependency CVEs;
- unexpected dependency licenses;
- oversized/hydration-heavy client bundles;
- accessibility traps in the mobile Drawer;
- RTL/locale rendering failures;
- source/version attribution mismatch;
- stale corpus data associated with wrong metadata;
- production fixtures accidentally marked reviewed;
- missing attribution/license;
- normalization changing sacred text;
- service-worker caching a text whose license disallows offline distribution;
- external-provider outage breaking a released passage.

## Release rule

No single green indicator is sufficient.

A release is ready only when **application security, source integrity, rights integrity, accessibility, visual quality, portability and provider independence** all pass together.