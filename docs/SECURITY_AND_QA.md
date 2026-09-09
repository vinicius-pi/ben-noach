# Security and QA baseline

## Security posture

The first public release is primarily a read-only content application. Preserve that small attack surface.

The highest-value assets are:

- integrity of displayed sacred/classical text;
- integrity of attribution and provenance;
- integrity of Noahide review status;
- availability of the public reader;
- privacy of any future reviewer/user accounts;
- build/deployment credentials.

The first architecture should therefore prefer static/pre-rendered content and server-side source retrieval over unnecessary mutable backend features.

## Framework baseline

Use the current patched **Next.js Active LTS** at implementation time. At this research checkpoint (September 2026), Next.js 16.x is Active LTS and the August 2026 security release requires 16.3.3 or later within that line.

References:
https://nextjs.org/support-policy
https://nextjs.org/blog

React should likewise use the patched stable version compatible with the selected Next.js release. React 19.2 is the current documented major/minor line at this checkpoint.

Reference:
https://react.dev/versions

Reason for explicit patch discipline: React Server Components and Next.js had critical/high-severity security releases in 2025–2026. Dependency freshness is a security control, not routine cosmetics.

## Architecture principles

### Read-only core

For the first release:

- no public user-generated HTML;
- no public file upload;
- no arbitrary URL fetcher;
- no open LLM/chat endpoint;
- no unnecessary database;
- no payment subsystem;
- no admin panel exposed on the public surface.

Review/editor workflow can begin as repository-backed structured data and later receive authenticated tooling.

### Source boundary

Treat Sefaria and all external providers as untrusted network boundaries even when they are authoritative content sources.

Use:

- typed provider adapters;
- runtime schema validation (e.g. Zod or equivalent);
- timeouts and bounded retries;
- explicit allowed hosts;
- canonical-ref validation;
- cache keys derived from normalized refs/version IDs;
- safe fallback states when upstream data is unavailable.

The public application should never become an unrestricted proxy to Sefaria or another external host.

### Rendering safety

External source text can contain markup. Use an allowlisted parser/render model rather than raw arbitrary HTML insertion.

If source HTML must be supported:

1. transform it at the provider/content boundary;
2. retain only an explicit minimal semantic subset needed for the text;
3. remove scripts, event handlers, styles, forms, embeds, and executable URLs;
4. store/render the normalized representation rather than repeatedly trusting upstream HTML.

Prefer structured React rendering over `dangerouslySetInnerHTML`.

## Browser security headers

Implement and test a restrictive header policy appropriate to the final architecture.

At minimum evaluate:

- `Content-Security-Policy`;
- `Strict-Transport-Security` in production;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy`;
- `Permissions-Policy` denying unused browser capabilities;
- CSP `frame-ancestors` policy;
- COOP/CORP/COEP only where their compatibility trade-offs are understood.

Next.js documentation:
https://nextjs.org/docs/app/guides/content-security-policy
https://nextjs.org/docs/app/api-reference/config/next-config-js/headers

CSP should be designed around the actual rendering/deployment model rather than copied from a generic template. Keep `script-src`, `connect-src`, `font-src`, `img-src`, and `frame-src` narrow. Embedding external media should be an explicit feature with an explicit CSP change.

## Secrets and configuration

- Keep `.env*` files out of Git except documented example files with dummy values.
- Public client variables must never contain secrets.
- Use deployment/GitHub secrets for provider credentials if any are introduced later.
- Prefer source APIs that require no credential for the first release.
- Ensure debug/review features cannot be activated by a public query parameter alone once they expose privileged data/actions.

## Dependency and supply-chain policy

Prefer a small dependency graph.

Use native browser/React/Next capabilities before adding packages.

For complex accessibility primitives, a well-maintained headless library such as Radix is acceptable. Avoid installing large visual UI kits solely for convenience.

Required controls:

- lockfile committed;
- deterministic CI install (`pnpm install --frozen-lockfile` or equivalent);
- Dependabot configuration for npm and GitHub Actions;
- dependency audit in CI;
- CodeQL for JavaScript/TypeScript once the app exists;
- pinned major versions of GitHub Actions;
- review transitive dependency explosions before acceptance.

Before release, use the connected Codex Security workflow (if enabled) for an independent scan in addition to ordinary dependency/static analysis.

## Authentication strategy

The initial public reader should not require accounts.

If reviewer accounts are introduced:

- use a mature authentication provider/library rather than custom passwords;
- server-side authorization is mandatory for every mutation;
- reviewer role must be distinct from ordinary user role;
- record reviewer identity and timestamp on approvals;
- protect state-changing requests from CSRF according to the chosen auth/session mechanism;
- rate-limit authentication and mutation endpoints;
- produce an audit trail for content approval changes.

## Privacy

Default to minimal collection.

Initial analytics, if added, should answer product questions without building a sensitive religious-profile dataset.

Prefer aggregate/anonymous metrics such as:

- reader performance;
- route usage;
- whether users open Understand/Sources;
- completion through guided reading paths.

Avoid collecting declared religion, former religion, detailed belief state, or personally identifying study history unless a future feature genuinely requires it and has an explicit privacy design.

## Accessibility as release engineering

Accessibility is part of correctness because the core product is text and study.

Required baseline:

- semantic headings/landmarks;
- complete keyboard access;
- visible focus;
- correct dialog/sheet focus management;
- screen-reader labels for verse actions;
- RTL/LTR semantics;
- sufficient contrast;
- reduced-motion support;
- 200% zoom without loss of content/function;
- touch targets appropriate to mobile;
- readable line measure and adjustable type.

### Automated accessibility

Use Playwright + `@axe-core/playwright` on core application states.

Official reference:
https://playwright.dev/docs/accessibility-testing

Automated checks catch only part of WCAG. Pair them with manual keyboard, zoom, screen-reader spot checks and real-device testing.

If Storybook is used, enable its official a11y tooling and configure core stories to fail on violations.

Reference:
https://storybook.js.org/docs/writing-tests/accessibility-testing

## Visual regression and anti-slop QA

The product is typography/layout-driven, so visual regression is a functional test.

Required screenshot matrix:

- home;
- library;
- reader idle;
- verse hover/focus;
- Understand rail/sheet;
- Sources view;
- Hebrew only;
- translation only;
- bilingual;
- large text;
- reduced viewport/mobile;
- loading/error states.

At minimum use Playwright's deterministic screenshot comparisons. Storybook/Chromatic may be added for component-level cross-browser visual review if useful.

Keep screenshot baselines human-reviewed; an agent should not automatically approve broad visual diffs.

## Performance budgets

A reading application should load like a document, not a dashboard.

Use Lighthouse CI on pull requests and maintain explicit budgets.

Reference:
https://github.com/GoogleChrome/lighthouse-ci

Initial targets for refinement during implementation:

- Lighthouse Performance ≥ 95 on representative static reader route in controlled CI;
- Accessibility ≥ 98, with separate axe gate;
- Best Practices ≥ 95;
- SEO ≥ 95 for public reading routes;
- LCP target ≤ 2.5s under mobile-like test conditions;
- CLS ≤ 0.05;
- core reader JavaScript kept deliberately small;
- font files subset/preloaded only when justified;
- no large hero imagery in initial viewport.

Treat numbers as regression gates after stable baselines are established, not as permission to game Lighthouse.

## Test layers

### Unit

Test:

- canonical-ref normalization;
- source-manifest validation;
- review-state transitions;
- license rules;
- scope taxonomy;
- deep-link generation;
- translation/version selection;
- provider response normalization.

### Component

Test:

- verse rendering;
- RTL/LTR mixtures;
- study rail;
- mobile sheet;
- source attribution;
- status/provenance UI;
- text appearance controls;
- keyboard interactions.

### E2E

Playwright flows:

1. open Genesis 1;
2. select Genesis 1:1;
3. open Understand;
4. move through Rashi / explanation;
5. open Sources;
6. open provenance;
7. follow/validate Sefaria deep link target format;
8. switch language/display mode;
9. use entire flow by keyboard;
10. repeat critical flow in mobile viewport.

### Source integrity

CI must verify:

- every bundled source has manifest metadata;
- every evidence ref used by editorial copy resolves to a known source object;
- no `rabbinically-reviewed` block lacks reviewer metadata;
- no unsupported license state is bundled for production;
- no duplicate canonical IDs;
- Hebrew base text fixtures have deterministic hashes.

## CI structure

Recommended GitHub Actions jobs:

1. `quality`
   - frozen install
   - format check
   - lint
   - typecheck
   - unit/component tests

2. `content-integrity`
   - manifest validation
   - citation/evidence validation
   - review-state validation
   - license validation

3. `build`
   - production build
   - bundle report/budget where available

4. `e2e`
   - Playwright desktop/mobile
   - axe scans
   - screenshot comparisons

5. `lighthouse`
   - representative public routes

6. `security`
   - package audit
   - CodeQL or equivalent static analysis

## GitHub hygiene

Add:

- `.editorconfig`;
- `.gitignore`;
- `.env.example` only if variables exist;
- `.github/dependabot.yml`;
- PR template;
- CODEOWNERS while the project has one canonical owner;
- `SECURITY.md` reporting policy;
- `CONTRIBUTING.md` once external contribution is realistic.

Keep generated test artifacts out of git unless they are intentional visual baselines. Upload transient reports/videos as CI artifacts.

## Pre-release adversarial checks

Before public launch, run an independent pass specifically attempting to find:

- XSS through commentary/provider markup;
- malicious ref/path input;
- open redirects through source/deep links;
- unsafe external image/embed behavior;
- leaked environment variables;
- public access to reviewer mutations;
- dependency CVEs;
- oversized client bundles;
- accessibility traps in mobile sheet/dialog;
- hydration errors caused by RTL/locale differences;
- stale content cache presenting wrong version attribution;
- production fixtures accidentally marked as rabbinically reviewed;
- missing license/attribution;
- source text changed by normalization/rendering.

A secure build that displays the wrong sacred text is still a failed build. Content integrity and application security are equal release gates.
