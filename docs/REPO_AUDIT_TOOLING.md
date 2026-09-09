# Repository audit tooling — deterministic anti-slop/security plan

Purpose: distinguish useful deterministic gates from AI-review theater.

This document evaluates tools for the Ben Noach repository. It is not a requirement to install every tool.

## Decision summary

### Add / baseline-review first

1. **Knip** — dead files / unused exports / unused dependencies.
2. **actionlint** — GitHub Actions syntax/expression/shell validation.
3. **zizmor** — GitHub Actions security analysis.
4. **CodeQL** — semantic code security; prefer GitHub default setup with `security-extended` for this public repository.
5. **Lychee** — link integrity for source/provenance/license/documentation URLs.

### Keep existing

- format / lint / strict typecheck;
- unit tests;
- content/source/license/provider validators;
- Gitleaks;
- OSV Scanner;
- production build + generic static-host smoke;
- Playwright E2E + axe;
- visual regression;
- Lighthouse.

### Optional, non-authoritative

- `peakoss/anti-slop` for external-contributor PR hygiene;
- PR-Agent / Qodo community agent;
- Greptile or another hosted model reviewer;
- OpenAI Codex Security as an independent hypothesis generator.

No model reviewer should become the release contract.

---

## 1. `peakoss/anti-slop`

### What it is

A real third-party GitHub Action focused mainly on PR contribution hygiene and heuristic anomalies: PR size, branch/title/description/template/commits/files and contributor-related signals.

It is **not** a semantic detector for oversized abstractions, dead dependency graphs or business-logic correctness.

### Why it is low priority here

The current problem is an owner-created agent build. Anti-slop's typical contribution-triage heuristics are better suited to future external PRs.

If later used:

- pin to a reviewed full commit SHA;
- start with label/report behavior, not auto-close;
- tune only after observing real contributor traffic;
- never present a green anti-slop result as proof of code quality.

Reference:

- https://github.com/peakoss/anti-slop

A useful real-world configuration reference is Hugging Face Transformers, which uses stricter failure tolerance while avoiding automatic PR closure.

---

## 2. Knip

### Why it maps directly to agent slop

Knip finds unused:

- files;
- exports;
- dependencies;
- devDependencies;
- unresolved dependency relationships.

That attacks a concrete agent failure mode: structure created because it was easy to generate rather than because the runtime/test graph needs it.

License: ISC.

Current project/release research at audit time:

- https://github.com/webpro-nl/knip
- current release observed in September 2026 research: 6.14.2.

### Integration policy

Do not immediately make every Knip finding blocking.

1. run baseline;
2. classify intentional framework/content entrypoints;
3. remove actual dead material;
4. commit a small explicit configuration;
5. only then make the stable categories blocking.

Avoid a giant ignore list; that simply turns the gate into theater.

---

## 3. actionlint

### Value

Deterministic static checker for GitHub Actions workflows, including:

- workflow syntax;
- expression validation;
- action inputs/outputs;
- `needs` relationships;
- shell-script integration;
- several workflow-specific mistakes missed by generic YAML linting.

License: MIT.

Reference:

- https://github.com/rhysd/actionlint

Current release observed during the audit: v1.7.12 (2026-03-30).

### Integration policy

Use a pinned binary/version with checksum or another immutable installation route. Run against every workflow change.

---

## 4. zizmor

### Value

Security analysis specifically for GitHub Actions. It complements actionlint rather than duplicating it.

Useful categories include:

- dangerous expression/template injection;
- excessive permissions;
- credential persistence/leakage patterns;
- unsafe checkout/workflow patterns;
- untrusted inputs in sensitive contexts;
- action reference/supply-chain weaknesses.

Reference:

- https://github.com/zizmorcore/zizmor

Current release observed during the audit: v1.26.1.

### Integration policy

Run on `.github/workflows/` and review the baseline before choosing blocking severities.

The current repository should particularly use it to review mutable action references and deployment permissions.

---

## 5. CodeQL

GitHub documentation confirms code scanning/CodeQL is available for public GitHub.com repositories.

Preferred path for this repository:

- enable **default setup**;
- JavaScript/TypeScript analysis;
- select the **`security-extended`** query suite;
- avoid maintaining a custom CodeQL workflow unless the default setup proves insufficient.

References:

- https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/configure-code-scanning/configure-code-scanning
- https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-query-suites

This is a stronger semantic-security gate than adding another general-purpose LLM reviewer.

---

## 6. Lychee

### Why link checking is a content-integrity concern here

The product's trust model depends heavily on links to:

- Sefaria refs;
- source/version pages;
- license pages;
- provenance resources;
- research/governance references.

A broken source link is more serious here than generic documentation rot.

Lychee is open-source and designed for link checking across Markdown/HTML and other text formats.

Reference:

- https://github.com/lycheeverse/lychee

Current release observed during the audit: 0.24.2.

### Integration policy

Use retries and an explicit allow/ignore policy for domains that rate-limit automated requests. Do not normalize persistent 404s as harmless.

---

## 7. GitHub Actions pinning

Current active workflows reference major tags such as:

- `actions/checkout@v4`;
- `actions/setup-node@v5`;
- `actions/upload-artifact@v4`;
- `gitleaks/gitleaks-action@v2`;
- `withastro/action@v4`;
- `actions/deploy-pages@v4`.

Dependabot already monitors the `github-actions` ecosystem, which is the right updater.

Recommended hardening:

- replace mutable tags with reviewed full commit SHAs;
- keep a trailing comment with the human-readable release tag;
- allow Dependabot to propose SHA updates through ordinary PR review.

This is especially important for Actions with access to repository tokens or deployment identity.

---

## 8. PR-Agent

PR-Agent is a real open-source AI-powered PR review project, but it is a model-based reviewer and requires a model/provider path.

It should not be described as a deterministic AST contract checker.

Use only if a maintainer wants another hypothesis generator after deterministic gates.

Reference:

- https://github.com/qodo-ai/pr-agent

Policy:

- never use `@main` for a privileged workflow;
- pin releases/SHAs;
- do not require it for cloning/building/hosting the public project;
- never accept a review claim without reproducible evidence.

---

## 9. Greptile

Greptile is a hosted proprietary review service with contextual code review and security capabilities.

It can be useful as an external second opinion but conflicts with the repository's preference against hard SaaS dependencies if made mandatory.

Policy:

- optional audit only;
- never required to merge/build/run;
- do not send unreleased/private future material automatically without a deliberate data-governance decision.

---

## 10. Proposed gate topology

```text
PR
│
├── deterministic quality
│   ├── format/lint/typecheck
│   ├── tests
│   ├── Knip
│   └── content/source/license validators
│
├── deterministic security
│   ├── OSV
│   ├── Gitleaks
│   ├── actionlint
│   ├── zizmor
│   └── CodeQL
│
├── product verification
│   ├── build/static-host smoke
│   ├── E2E + axe
│   ├── visual regression
│   ├── Lighthouse
│   └── link/provenance check
│
└── optional human/model review
    ├── independent editorial/source audit
    └── optional AI reviewer(s)
```

## Anti-theater rule

A new gate should be added only if all of the following are true:

1. it detects a concrete failure class not already covered;
2. a maintainer can explain what a failure means;
3. its output can be independently verified;
4. the project can run without a paid credential;
5. ignores/exceptions are explicit and reviewable;
6. the gate does not claim to measure `AI-ness` when it only measures metadata or style proxies.
