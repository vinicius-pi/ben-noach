# Security and QA — v0.1 release contract

The public reader is a static, read-only application. Security and content integrity are the same release problem: a build that is technically safe but displays the wrong sacred text, wrong version, wrong attribution, or false review status is a failed build.

## Protected assets

- exact released Tanakh and classical-commentary text;
- version identity, license and attribution;
- evidence links and editorial/source separation;
- review status and authority labels;
- build and deployment credentials;
- availability of the released reader without a runtime provider.

## v0.1 attack surface

The release has:

- no application server for core reading;
- no database;
- no account system;
- no user-generated HTML;
- no upload endpoint;
- no arbitrary URL fetcher;
- no public mutation/admin endpoint;
- no runtime AI/chat endpoint;
- no payment subsystem;
- no third-party analytics requirement.

Released passages render from the local approved corpus. Sefaria is a source and depth destination, not a runtime dependency for the released text.

## Source boundary

Provider material is treated as untrusted input during ingestion even when the provider is authoritative.

Release data requires:

- canonical refs;
- exact version identifiers;
- explicit license metadata;
- deterministic checksums for bundled source text;
- validated evidence refs;
- stable local normalized content;
- explicit `bundleAllowed` / `offlineAllowed` rights state.

Unknown-rights content cannot enter the public bundle.

## Authority boundary

Project-written material has three distinct meanings:

- `EDITORIAL_ELUCIDATION` — source-grounded explanation of the text/commentary;
- `APPLICABILITY_CONTEXT` — source-grounded clarification of who/what a passage concerns;
- `RABBINIC_GUIDANCE` — normative permitted/prohibited/required/recommended guidance.

`RABBINIC_GUIDANCE` is blocked from release unless it is `rabbinically-reviewed` and carries review metadata. Context must not be relabeled as a ruling merely because the intended audience is Bnei Noach.

## Browser/deployment posture

The static application keeps third-party execution out of the base reader. CSP and host-specific security headers remain narrow. GitHub Pages cannot provide every HTTP header, so the build also carries the documented static-host alternatives.

GitHub Actions use minimal permissions and immutable action commit SHAs. Checkout does not persist credentials. Deployment write/identity permissions exist only on the Pages deploy job.

## Implemented release gates

### Quality

- Prettier format check;
- ESLint;
- strict Astro/TypeScript check;
- Vitest unit tests.

### Content integrity

- source/content validation;
- checksum validation;
- evidence-ref validation;
- review-state/authority validation;
- license validation;
- provider-host validation.

### Supply chain

- frozen pnpm lockfile install;
- OSV Scanner, fail closed in CI;
- Gitleaks v3;
- Dependabot for npm and GitHub Actions;
- immutable SHA-pinned GitHub Actions.

### Build/portability

- production static build;
- generic static-server smoke test;
- no runtime Sefaria requirement for the released corpus.

### Browser/product

- Playwright E2E;
- axe accessibility checks;
- deterministic visual regression;
- desktop/mobile critical flows.

### Lighthouse

The enforced category floors live in `scripts/run-lhci.ts`:

- Performance ≥ 95;
- Accessibility ≥ 98;
- Best Practices ≥ 95;
- SEO ≥ 95.

The script invokes Lighthouse directly against the production preview; there is no second `lhci autorun` configuration.

## Accessibility contract

Core reading must preserve:

- semantic headings and landmarks;
- keyboard access and visible focus;
- correct dialog/drawer focus behavior;
- screen-reader labels for actions;
- correct RTL/LTR semantics;
- sufficient contrast;
- reduced-motion support;
- usable 200% zoom;
- mobile touch targets;
- meaning that does not depend on color alone.

Automated axe/Lighthouse results supplement, rather than replace, human keyboard/mobile/visual review.

## Visual regression rule

Only baselines for the accepted product direction are operational evidence. Rejected design experiments belong in Git history, not the canonical repository tree.

An autonomous agent must not broadly approve unexplained visual diffs it generated itself.

## Release commands

`pnpm qa` is the fast inner loop.

`pnpm qa:full` is the sequential local release gate and includes the fail-closed supply-chain, build, E2E/visual and Lighthouse checks defined in `package.json`.

CI splits the same concerns into parallel jobs.

## Next deterministic hardening

Before calling the RC final, baseline and keep only useful findings from:

- Knip — dead files/exports/dependencies;
- actionlint — GitHub Actions correctness;
- zizmor — GitHub Actions security;
- CodeQL — semantic code security.

Source-link checking should be introduced only with a retry/allow policy that does not make release correctness depend on transient Sefaria/network rate limits.

Model-based PR reviewers may be used as optional second opinions. They are not release authorities.

## Pre-release adversarial checklist

Check explicitly for:

- executable/provider markup reaching rendering;
- malformed canonical refs or unsafe deep links;
- leaked secrets/environment values;
- dependency CVEs or unexpected licenses;
- incorrect source/version attribution;
- stale source data paired with new metadata;
- false or stale review status;
- missing required attribution;
- normalization changing sacred/classical text;
- provider outage breaking a released passage;
- accessibility traps in the mobile drawer;
- unexpected large hydration/client bundles.

## Release rule

No single green score is sufficient. v0.1 is ready only when content/source integrity, authority labeling, rights, application security, accessibility, visual regression, portability and provider independence pass together.
