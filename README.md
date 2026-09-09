# Ben Noach

**A beautiful guided Tanakh reader for Bnei Noach and non-Jews seeking to understand the Word of Hashem through the Jewish textual tradition.**

## Why it exists

A generic Bible can give a reader the text without the interpretive architecture that produced the Jewish reading of that text.

Sefaria gives extraordinary access to Tanakh, Rashi, Chazal and thousands of connected sources, but a new reader may not yet know:

- which source to open;
- who Rashi is;
- why Rashi comments on a particular word;
- how Midrash, Gemara and supercommentaries relate to the verse;
- which material is universal/Noahide;
- which material is necessary Israel-covenant context;
- which legal/practice detail is specifically Jewish;
- when to stop reading commentary and return to the passage.

Ben Noach supplies that missing guided layer.

## Product thesis

> **READ → UNDERSTAND → SOURCES**

The application should feel like a beautifully typeset contemporary book before it feels like software.

A reader should be able to move naturally through:

`Tanakh → Rashi → why Rashi comments → classical source chain → applicability/context → deeper sources → Sefaria`.

The goal is not to own the largest Jewish-text corpus. The goal is to give the target reader the **right first path through it** and gradually make direct primary-source study easier.

## Editorial model

The product keeps three classes visibly and structurally distinct:

1. **Source** — canonical/historical text with exact ref, version, provenance and rights metadata.
2. **Project elucidation** — clear modern explanation for the reader, with evidence refs.
3. **Reviewed guidance/applicability** — Noahide-specific normative/scope material carrying explicit review metadata where relevant.

Source text is never rewritten to fit the audience. Applicability is handled through curation/context, not source redaction.

## v1

The first production demonstrator covers **Genesis 1:1–5**, followed by Genesis 1:6 as an architecture scalability test.

The design and content model must then expand cleanly through Genesis 1–11 and eventually the Tanakh.

## Architecture

The final v1 specification uses:

- Astro 7.x static-first architecture;
- strict TypeScript;
- React islands only where interaction materially needs them;
- an audited local release corpus;
- typed Sefaria enrichment/deep-link adapters;
- open/self-hosted fonts;
- open-source testing/security tooling;
- GitHub Pages as the first free deployment path;
- host-portable static `dist/` output;
- no required paid SaaS, hosted database, runtime AI or proprietary search service.

## Open corpus starting point

The audited pilot stack begins with open-rights versions such as:

- Public Domain pointed/cantillated Hebrew Tanakh;
- Public Domain JPS 1917 English Tanakh;
- Public Domain Rosenbaum/Silbermann Rashi;
- approved Siftei Chakhamim versions with exact attribution;
- optional open OSHB/BDB data for later word-level study.

See `docs/CORPUS_V1.md` for exact release policy.

## Design

The product is white/off-white and deep blue, typography-led, editorial and quiet.

The Tanakh itself is the hero visual.

The build process compares three real visual directions — **Editorial Modernism, Quiet Scholarly, Immersive Reader** — using identical Genesis data before converging on a final system.

Generic component-library appearance is not an acceptable final state.

## Repository execution

`main` remains canonical.

The full research/build specification lives on:

`build/grok-production-v1`

The controlling execution task is GitHub **Issue #1 — Build v1: production guided Tanakh reader**.

Start with `AGENTS.md`, then follow its document precedence and execute `docs/GROK_BUILD_MASTERPROMPT.md` end-to-end.

The final build must arrive as a reviewable PR into `main` and must not self-merge.

## Licensing

- Original software: Apache-2.0.
- Original project editorial/documentation content: CC BY 4.0 unless otherwise marked.
- Third-party sacred/classical texts, translations, fonts and datasets retain their own concrete licenses/rights records.

See `LICENSES.md`, `CONTENT_LICENSE.md` and `GOVERNANCE.md`.