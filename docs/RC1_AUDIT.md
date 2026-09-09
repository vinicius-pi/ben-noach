# RC1 independent audit

Audit branch: `audit/rc1-humanization`

Base audited head: `e32bfa40441d3954633876b7350540eb6bf9a67f` (PR #2)

## Verdict

The engineering RC is strong enough to preserve. The application architecture, source/version model, local release corpus, CI, accessibility and portability work should **not** be restarted.

The remaining release risk is concentrated in four areas:

1. generated editorial prose that sometimes fills space rather than solving a textual problem;
2. conflation of contextual applicability with normative Noahide guidance;
3. repository/build sediment left by the agent workflow;
4. missing deterministic gates for dead code and GitHub Actions security/hygiene.

**Release decision at this audit stage: FIX, not BLOCK, not MERGE.**

The next pass must be subtractive. No new product feature is justified until these findings are closed.

---

## A. Product/content findings

### E01 — `NOAHIDE_GUIDANCE` conflates two different authorities — HIGH

`src/lib/types.ts` currently permits only:

- `EDITORIAL_ELUCIDATION`
- `NOAHIDE_GUIDANCE`

But the shipped `for-bnei-noach` blocks explicitly say they are contextual and not rulings, while remaining typed as `NOAHIDE_GUIDANCE` and only `sources-verified`.

This conflicts with the repository's own governance rule that normative Noahide guidance requires the higher review path.

**Required correction**

Split the semantics:

- `APPLICABILITY_CONTEXT`: source-grounded explanation of who/what a passage concerns, may be `sources-verified`;
- `RABBINIC_GUIDANCE`: normative permitted/prohibited/required/recommended guidance, requires the repository's rabbinic review state before authoritative public display.

Do not solve this distinction only with disclaimer prose.

### E02 — applicability is being filled even when nothing needs explaining — HIGH

`StudyContent.tsx` renders `Who is being addressed?` for every selected verse.

In Genesis 1:2–4 and 1:6 the underlying `addressNote` mostly repeats variants of:

- creation narrative;
- not a legal address;
- not covenantal law;
- not a Noahide statute.

This is schema-driven pedagogy rather than reader need.

**Required correction**

Make applicability progressive and conditional. Show it when it resolves an actual ambiguity, for example:

- Israel-covenant material;
- specifically Jewish practice;
- Bnei Noach / humanity legal material;
- a prophetic address to nations;
- a passage where the target of speech materially affects interpretation.

For ordinary creation narrative, absence is correct.

### E03 — specific editorial sentences exhibit low-density LLM prose — HIGH

The following current phrases should be deleted or rewritten from sources:

- Genesis 1:2: `The verse is atmosphere and grammar, not ethics.`
- Genesis 1:2: `a typical supercommentary move...`
- Genesis 1:3: `That absence is information. Not every verse is a problem for Rashi. The reader can stay with the verse.`
- Genesis 1:4: `That compression is what Rashi hears.`
- Genesis 1:4: `Again Rashi refuses to collapse midrash into peshat.`
- Genesis 1:5: `The naming is an act of order. The odd cardinal number is the textual snag.` (retain only what is needed to introduce Rashi's actual question)
- Genesis 1:5: `The verse's grammar becomes emunah...`
- Genesis 1:6: `The verse is a command of cosmic order, not a human statute.`
- Genesis 1:1: `This is how Jewish reading works...`
- Genesis 1:1: `This is emunah... It is not a ritual instruction.`

These are not necessarily false. They are poor editorial economy: they generalize, moralize or classify after the source has already made the useful point.

**Editorial rule:** if removal does not cost a textual fact, source relationship or necessary orientation, remove it.

### E04 — Genesis 1:4 `why-rashi` overstates the cited support — MEDIUM/HIGH

Current prose says the verse can sound `as if God reconsidered`.

The verified Rashi/Siftei chain supports the problem of separation/mixing and the need for aggadah/peshat. The `God reconsidered` formulation is not needed and is not clearly carried by the cited evidence.

**Required correction:** delete unless a direct classical source is added.

### E05 — Genesis 1:1 source introduction leaks Rashi's conclusion into the verse layer — MEDIUM

`It begins with a world that already belongs to God` belongs to Rashi's land/creation argument, not to the neutral verse introduction.

**Required correction:** keep the verse introduction limited to what the verse/translation and the impending Rashi questions actually establish.

### E06 — Genesis 1:5 Noahide block is probably unnecessary — MEDIUM

Rashi's comment about `one day` and God's uniqueness is already intelligible in the Rashi/elucidation layer.

The separate `For Bnei Noach` paragraph adds another classification pass (`belongs to emunah`, `not a Jewish-practice rule`) without solving a genuine covenantal ambiguity.

**Required correction:** delete unless a reviewer can identify a concrete target-user confusion that the source/elucidation layers do not already solve.

### E07 — English-only v0.1 is the cleanest release boundary — HIGH

The repository already has a complete rights-safe English pilot stack:

- pointed/cantillated Hebrew Tanakh: Public Domain;
- JPS 1917 English: Public Domain;
- Rosenbaum/Silbermann Rashi: Public Domain;
- Metsudah Siftei Chakhamim: CC BY with attribution.

The Portuguese scripture problem remains unresolved by the repository's own corpus audit.

**Required correction:** ship public v0.1 as Hebrew + English only. Preserve lightweight localization architecture if it remains low-cost, but do not publish `/pt/` as a partially translated product and do not keep generated Portuguese editorial prose merely to fill the locale.

A future Portuguese release should have a concrete, approved Jewish translation/version manifest before public activation.

---

## B. Source/provenance findings

### S01 — core Rashi claims checked independently — PASS

Independent Sefaria checks support the shipped classical core:

- Rashi Genesis 1:1:1 — why Torah begins with Creation rather than Exodus 12:2; Psalm 111:6 / land argument;
- Rashi Genesis 1:1:2 — derash around `reshit` and peshat/construct reading; no chronological creation-order proof;
- Rashi Genesis 1:1:3 — Elohim/justice; mercy joined to justice; Genesis 2:4;
- Rashi Genesis 1:2 — tohu/vohu, deep/waters, Throne of Glory/dove image;
- Rashi Genesis 1:4 — aggadah of hidden light and peshat division of day/night domains;
- Rashi Genesis 1:5 — `one day` vs `first day`, God's uniqueness before angels;
- Rashi Genesis 1:6 — day-one heavens solidified on day two; Job 26:11; firmament centered in waters.

Primary verification URLs are recorded in `docs/SOURCE_AUDIT_GENESIS_1_1_6.md`.

### S02 — Siftei Chakhamim licensing — PASS

Sefaria currently identifies the Metsudah 2009 current source and translation as CC-BY. The repository's manifest treatment is consistent with that metadata.

### S03 — Rashi Rosenbaum/Silbermann licensing — PASS

Sefaria currently identifies the selected Rosenbaum/Silbermann source/translation as Public Domain.

### S04 — source/version identity remains a strength — KEEP

Checksums, exact version identifiers, canonical refs and local release data are not agent clutter. They are the foundation of the product's trust model and should remain.

---

## C. Repository anti-slop findings

### R01 — duplicate workflow copies are build sediment — DELETE

Now that active workflows exist under `.github/workflows/`, the copies in:

- `docs/github-workflows/ci.yml`
- `docs/github-workflows/pages.yml`

are redundant and can drift. Git history already preserves the bootstrap state.

### R02 — build masterprompt is process sediment — DELETE OR ARCHIVE OUTSIDE CANONICAL DOCS

`docs/GROK_BUILD_MASTERPROMPT.md` describes how the agent should create a build that now already exists. It should not remain part of the canonical operational documentation after references are updated.

Git history is sufficient if provenance of the build process is desired.

### R03 — rejected token file is dead experiment residue — DELETE

`docs/design-experiments/tokens-rejected.css` is not required to understand the accepted design decision. Keep the written decision and only the minimum visual evidence needed to justify it.

### R04 — rejected-direction screenshots need a retention decision — REVIEW

The three-direction experiment was useful evidence. Do not automatically preserve every intermediate screenshot forever.

Retain only what is needed to support `DESIGN_DECISION.md` and human review. Visual regression baselines for the accepted product are operational artifacts and are a separate category.

### R05 — 165 changed files for a six-verse pilot requires a density audit — HIGH

The count is not itself a defect: corpus data, tests, accessibility, source manifests and CI legitimately add files.

But every surviving file must answer `why does this exist now?`

Required classifications:

- `SHIP` — production/runtime/source/test file;
- `GOVERNANCE` — active maintenance contract;
- `RESEARCH_ARCHIVE` — useful provenance, non-authoritative;
- `RELEASE_EVIDENCE` — needed to validate the release;
- `DELETE` — build-process sediment or dead experiment.

---

## D. Code/CI findings

### C01 — current CI is real and green — PASS

The audited PR head has successful quality, content-integrity, supply-chain, build, E2E/axe/visual and Lighthouse jobs.

Do not weaken these gates during cleanup.

### C02 — GitHub Actions are still referenced by mutable major tags — MEDIUM/HIGH

Examples include `actions/checkout@v4`, `actions/setup-node@v5`, `gitleaks/gitleaks-action@v2`.

Dependabot already monitors GitHub Actions, which is good, but immutable full-SHA pinning is stronger supply-chain hygiene for third-party actions.

**Required correction:** pin actions to reviewed full commit SHAs and let Dependabot propose future updates.

### C03 — no dedicated dead-code/repository graph gate — HIGH

Add Knip (open-source ISC) after one baseline review. It should detect unused files, exports and dependencies rather than attempting to guess whether code `sounds AI-generated`.

First run should be reviewed manually; only then make a stable subset blocking.

### C04 — workflow syntax/security needs deterministic analysis — HIGH

Add:

- `actionlint` for workflow syntax/expression/shell issues;
- `zizmor` for GitHub Actions security weaknesses.

These are more useful here than a generic LLM PR reviewer.

### C05 — CodeQL should be enabled — HIGH

The repository is public, so GitHub CodeQL/code scanning is available without a paid GitHub Code Security license.

Prefer GitHub's default setup with the `security-extended` query suite unless the project develops a concrete reason for an advanced custom workflow.

### C06 — link integrity deserves a gate — MEDIUM/HIGH

The product's trust model depends on Sefaria/source/license/deep links. Add Lychee or equivalent open-source link checking on documentation/source URL surfaces, with sensible retry/allow rules for rate-limited domains.

### C07 — `peakoss/anti-slop` is not the code-quality gate this project needs — INFORMATIONAL

It is a real project but mainly checks PR hygiene/metadata/size/commit patterns. It is best reserved for future external-contributor PR triage, not as proof that Grok-generated code has high functional density.

If later used:

- pin the action by full SHA;
- initially label rather than auto-close;
- do not treat it as a semantic code auditor.

### C08 — PR-Agent / Greptile are optional second opinions — INFORMATIONAL

Do not make a model-based reviewer the authority over model-produced code.

Use deterministic gates as the release contract; optional AI reviewers may generate hypotheses for human/independent verification.

---

## E. Visual anti-slop findings from code-level inspection

A binary screenshot review is still required before final approval. From the implementation itself, one pattern deserves explicit review:

- `.kicker`, study-section headings, mode buttons, brand name and verse `UNDERSTAND` hint all use uppercase/letter-spaced microcopy.

This can be elegant in moderation but can also produce the recognizable `editorial template` look when repeated through every layer.

**Human screenshot audit question:** can at least one third of visible labels disappear or lose typographic emphasis without reducing discoverability?

Do not change typography merely to create a diff. Judge rendered pages.

---

## F. Required next executor pass

The executor (Grok/Codex or a human maintainer) should receive findings, not a new open-ended design prompt.

Priority order:

1. English-only public v0.1.
2. Split applicability context from rabbinic guidance.
3. Make `Who is being addressed?` conditional.
4. Rewrite/delete the E03/E04/E05/E06 editorial material from cited sources.
5. Re-run content hashes/review records after editorial changes.
6. Remove confirmed repository sediment.
7. Run Knip baseline and resolve findings intentionally.
8. Add actionlint + zizmor + link integrity checks.
9. Enable CodeQL default setup / `security-extended`.
10. Pin GitHub Actions by full SHA.
11. Re-run every existing gate without lowering thresholds.
12. Human visual review of the accepted screenshots.

No new feature should enter this pass.

---

## Merge gate after fixes

Merge is acceptable only when:

- no public religious prose is present merely to fill a schema slot;
- contextual applicability is not mislabeled as rabbinic guidance;
- English v0.1 contains only verified source versions and source-grounded editorial prose;
- every remaining file has a current maintenance/evidence reason;
- deterministic dead-code/workflow/security/link gates have a reviewed baseline;
- all existing CI gates remain green;
- the final screenshots pass human editorial review;
- rabbinic review is still represented accurately as pending where it is pending.
