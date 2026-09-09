# Contributing

Ben Noach accepts several fundamentally different kinds of contribution. Keep them separate in the PR so review authority remains clear.

## Contribution types

### Software / design

Examples:

- Astro/React/CSS;
- accessibility;
- performance;
- source tooling;
- tests/CI;
- static deployment;
- visual design system.

Requirements:

- follow `AGENTS.md`;
- use approved/open dependencies;
- add/update tests;
- include screenshots for meaningful UI changes;
- preserve READ → UNDERSTAND → SOURCES;
- do not introduce a paid/runtime dependency without an explicit architecture decision.

Software contributions are contributed under Apache-2.0.

### Source / corpus

A source contribution must identify the exact concrete version.

Provide at minimum:

- canonical work/ref range;
- version title/identifier;
- language;
- provider/source URL;
- rights/license status;
- required attribution;
- whether bundling/offline use is permitted;
- retrieval date;
- checksum after project normalization.

Do not submit a copied translation/commentary merely because it is visible online.

### Editorial elucidation

Project-authored modern explanation should:

- answer a concrete comprehension problem;
- distinguish itself from quoted source text;
- attach evidence refs to significant interpretive claims;
- avoid anonymous paraphrase presented as a classical authority;
- keep source wording intact.

Original accepted editorial contributions are contributed under CC BY 4.0 unless explicitly agreed otherwise.

### Translation

A translation contribution must state whether it is:

- a third-party licensed version; or
- an original translation authored for the project.

Never label LLM-generated convenience prose as an established source translation.

### Applicability / rabbinic review

Normative Noahide/application or review-state changes require the review workflow in `GOVERNANCE.md` and `docs/CONTENT_GOVERNANCE.md`.

A GitHub contributor/maintainer cannot self-promote a content block to rabbinically reviewed merely through repository permissions.

## Development setup

The production build will document exact commands once the Astro application is scaffolded.

Expected baseline:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
```

The final PR will add the complete command matrix.

## Branches

Use focused feature branches from the current canonical development base.

Do not rewrite public/shared history.

Keep commits coherent enough that source/content/design decisions can be audited.

## Pull request evidence

Depending on the change, include:

- tests;
- screenshots;
- accessibility evidence;
- source/version manifest changes;
- license/attribution changes;
- content/review-state changes;
- migration/compatibility notes;
- performance impact.

## Dependency additions

Before adding a package, verify:

1. it solves a real problem not reasonably covered by native/platform code;
2. it is maintained;
3. its license passes `docs/OPEN_SOURCE_STACK.md` or has an explicit reviewed exception;
4. its transitive graph is proportionate;
5. it does not create a proprietary runtime/host dependency.

## Contributor certification / DCO

Use the Developer Certificate of Origin sign-off for commits:

```text
Signed-off-by: Your Name <your@email.example>
```

By signing off, you certify that you have the right to submit the contribution under the project's applicable license and the Developer Certificate of Origin 1.1.

DCO reference:
https://developercertificate.org/

This keeps contribution rights explicit without requiring a proprietary CLA service.

## Security

Do not open a public issue containing a vulnerability that would materially endanger a deployed instance. Follow `SECURITY.md`.

Never commit:

- real credentials;
- local `.env` secrets;
- private reviewer data;
- proprietary text/font assets;
- downloaded unknown-rights corpora;
- generated build/cache junk.

## Editorial principle

The target reader should gain more direct access to authentic sources as they use the product.

Contributions should strengthen at least one of:

- authentic reading;
- classical Jewish interpretation;
- applicability/context clarity;
- provenance;
- long-form reading quality;
- transition from beginner to primary sources.

Source count by itself is not progress.