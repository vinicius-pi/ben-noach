# AGENTS.md — Ben Noach execution contract

This repository is building a real production-quality public web product, not a mockup.

## Mission

Build a beautiful, source-first, multilingual Tanakh reader for people approaching Jewish textual study from the outside, especially Bnei Noach, non-religious readers, and people coming from Christian backgrounds who want to encounter the Hebrew Bible through classical Jewish sources.

The product progression is:

**READ → UNDERSTAND → SOURCES**

The reader should feel like a beautifully typeset book before it feels like an application.

## Governing product principles

1. **Tanakh first.** The canonical passage is always the visual and conceptual center.
2. **Clarity before density.** Beginner-facing explanations introduce just enough context to understand the passage and Rashi; deeper material is progressively disclosed.
3. **Sources remain sources.** Historical/canonical text is quoted faithfully and carries reference, version, provenance, and license metadata.
4. **Editorial elucidation is explicit.** Modern explanatory prose is a separate layer and supports claim-level evidence references.
5. **Rabbinic guidance is explicit.** Noahide-specific normative/scope guidance has its own review state and never masquerades as a historical source.
6. **Dignity of the Noahide path.** The product treats righteous gentile life as a valid path in its own right rather than a conversion funnel.
7. **Jewish context by demonstration.** For readers coming from Christianity or Islam, prioritize Hebrew, literary context, Jewish commentary, and the source chain. Optional comparative/polemical material may exist later, but the primary product lets the text and tradition speak.
8. **Progressive disclosure.** Preserve the depth of Mikraot Gedolot without inheriting its visual density.
9. **Book first, software second.** Reading mode minimizes chrome and interaction noise.
10. **Auditability without ugliness.** Provenance and review metadata must be accessible without turning the beginner experience into a scholarly database interface.

## Required reading before implementation

Read every file in `docs/` before writing application code. In particular:

- `docs/TOVIA_SINGER_ALIGNMENT.md`
- `docs/DESIGN_RESEARCH.md`
- `docs/CONTENT_GOVERNANCE.md`
- `docs/SECURITY_AND_QA.md`
- `docs/GROK_BUILD_MASTERPROMPT.md`

If a later repo document conflicts with this file, stop and surface the conflict in the PR rather than silently choosing.

## Initial scope

Build the full reusable application shell and production architecture, then populate **Genesis 1:1–5** as the high-fidelity content demonstrator.

Architecture must be ready to expand to Genesis 1–11, then the full Tanakh, without rewriting the core data model.

## Design standard

The visual identity is restrained, editorial, white/off-white and deep blue. Beauty should come from typography, whitespace, proportion, alignment, and motion discipline.

Use accessible headless primitives where useful, but style them as a bespoke editorial system. A default component-library appearance is not an acceptable final design.

The interface should never feel like a generic SaaS dashboard, AI landing page, crypto product, or templated religious website.

## Technical baseline

Use a current stable Next.js App Router + TypeScript stack unless repository research establishes a stronger reason otherwise.

Expected foundations:

- strict TypeScript
- React Server Components where they materially help
- minimal client-side JavaScript in reading surfaces
- semantic HTML
- correct RTL/LTR behavior
- accessible primitives for dialogs/sheets/popovers where appropriate
- local or properly licensed web fonts
- source-aware content schemas
- static/pre-rendered reading pages when practical
- PWA-ready architecture
- Sefaria API/MCP adapters kept behind a typed boundary
- no scraping of third-party sites whose terms prohibit it

## Source and content rules

Never fabricate citations, source text, translator identity, license, manuscript information, or rabbinic approval.

If a content block is not verified, represent it structurally as a draft fixture. The UI may display draft-only material in development/review mode; production public content must satisfy the release rules in `docs/CONTENT_GOVERNANCE.md`.

Do not silently paraphrase a historical source while labeling it as the source.

## Required product surfaces for v1

- editorial home / cover
- Tanakh library navigation
- Genesis reader
- READ mode
- UNDERSTAND interaction
- SOURCES interaction
- desktop study rail
- mobile draggable study sheet
- Hebrew / translation display architecture
- reader appearance controls
- source / provenance drawer
- beginner glossary behavior
- review-state mode for editors/rabbis
- typography proof page
- responsive empty/loading/error states
- PWA metadata/shell
- keyboard navigation and focus management

## Anti-slop execution protocol

Before accepting a visual direction:

1. Build at least three materially different visual treatments on separate implementation branches or isolated design routes using identical content.
2. Render screenshots at mobile, tablet, and desktop widths.
3. Compare hierarchy, text measure, Hebrew diacritics, whitespace rhythm, rail behavior, and visual noise.
4. Select one direction deliberately and document why.
5. Remove unused experimental styles/components before the final PR.

Do not improve aesthetics by adding decorative cards, gradients, illustrations, excessive rounding, ornamental religious symbols, or shadows. Improve typography and composition first.

## QA gates before a PR is ready

All of these must pass:

- install from clean checkout
- typecheck
- lint
- unit/component tests
- production build
- Playwright smoke/E2E tests
- keyboard-only navigation audit
- axe accessibility checks on core states
- visual screenshot tests for core reader states
- RTL/LTR regression checks
- Lighthouse CI thresholds and performance budget
- dependency/security audit
- source/provenance validation
- license manifest validation
- no secrets in repository or browser bundle

## Security baseline

Follow `docs/SECURITY_AND_QA.md`. In particular:

- strong Content Security Policy appropriate to the final rendering strategy
- restrictive security headers
- no arbitrary HTML rendering from source/API content
- no remote code execution/eval-style behavior
- validate external API data at boundaries
- sanitize any user-authored content introduced later
- no credentials in client-side environment variables
- lock dependencies and minimize package surface

## Git hygiene

- Work on feature branches.
- Keep `main` canonical and deployable.
- Do not rewrite public history.
- Prefer coherent commits over giant undifferentiated commits.
- Never commit generated caches, secrets, local env files, test videos, or build outputs unless explicitly required.
- Every major visual/content/security decision should be traceable in the PR description.
- Do not merge your own build automatically. Leave the final PR ready for human review.

## Definition of done

The task is not complete because the app runs.

It is complete when the reading experience is visibly polished at multiple breakpoints, sources are provenance-safe, the content layers are epistemically distinct, the interface is accessible, the build is secure, tests enforce regressions, and a new reader can move from Genesis 1:1 to understanding Rashi and then into primary sources without needing prior knowledge of Jewish textual-study conventions.
