# Fonts, sources, dependencies

## Fonts (self-hosted via Fontsource, OFL-1.1)

| Family | Package | Use |
| --- | --- | --- |
| Frank Ruhl Libre | `@fontsource-variable/frank-ruhl-libre` | Display Hebrew |
| Noto Serif Hebrew | `@fontsource/noto-serif-hebrew` | Scholarly/proof Hebrew |
| Literata | `@fontsource-variable/literata` | Latin reading + UI |

No Google Fonts runtime request.

## Bundled texts

See `src/data/source-manifest.json`.

- Tanach with Ta'amei Hamikra — Public Domain (tanach.us / Sefaria)
- JPS 1917 — Public Domain (Open Siddur / Sefaria)
- Rosenbaum/Silbermann Rashi 1929–1934 — Public Domain
- Metsudah Siftei Chakhamim 2009 — CC BY (attribution rendered in Sources)

## Software

Original software: Apache-2.0. Direct dependency licenses are enforced by `scripts/validate-licenses.ts`.
