# Ben Noach

**A beautiful guided Tanakh reader for Bnei Noach and non-Jews seeking to understand the Word of Hashem through the Jewish textual tradition.**

## Why it exists

A generic Bible can give a reader the text without the interpretive architecture that produced the Jewish reading of that text.

Sefaria gives extraordinary access to Tanakh, Rashi, Chazal and thousands of connected sources, but a new reader may not yet know which source to open, who Rashi is, why he comments, or which material is universal, Noahide, or Israel-covenant context.

Ben Noach supplies that missing guided layer:

**READ → UNDERSTAND → SOURCES**

## Run

Requires Node 22+ and pnpm 10.15 (Corepack).

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://127.0.0.1:4321/ben-noach/en/`.

```bash
pnpm check
pnpm lint
pnpm test
pnpm validate:content
pnpm validate:licenses
pnpm validate:providers
pnpm scan:secrets
pnpm build
pnpm preview
pnpm test:e2e
```

## v1 corpus

Genesis 1:1–6, from:

- Public Domain pointed/cantillated Hebrew (Tanach with Ta'amei Hamikra / tanach.us)
- Public Domain JPS 1917
- Public Domain Rosenbaum/Silbermann Rashi
- CC BY Metsudah Siftei Chakhamim, with attribution

The reader works with Sefaria unavailable. See `docs/CORPUS_V1.md` and `src/data/source-manifest.json`.

## Design

Production uses **Editorial Modernism**, chosen from rendered evidence of three directions. Comparison: `docs/DESIGN_DECISION.md`. Screenshots: `docs/evidence/`.

## Docs

- `docs/ARCHITECTURE.md`
- `docs/AUTHORING.md` — how Genesis 1:6 was added without UI surgery
- `docs/DEPLOYMENT.md`
- `docs/PATH_TO_GENESIS_1_11.md`
- `docs/KNOWN_LIMITATIONS.md`
- `docs/FONTS_AND_LICENSES.md`

## Licensing

- Original software: Apache-2.0
- Original editorial/docs: CC BY 4.0
- Third-party texts and fonts retain their own records

The final production PR targets `main` and is not self-merged.
