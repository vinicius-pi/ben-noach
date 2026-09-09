# Architecture

Ben Noach is a static Astro 7 application. Released reading is HTML. React islands handle verse selection, the study rail/sheet, search, and continue-reading.

## Runtime source of truth

`src/data/*.json` is the local release corpus. Pages render from those files at build time. Sefaria is an outbound deep-link/enrichment provider and is not required at runtime.

## Layers

| Layer | Storage | Public appearance |
| --- | --- | --- |
| Canonical source | `verses.json`, `text-versions.json` | Hebrew + JPS 1917 |
| Classical commentary | `commentary-segments.json` | Rashi / Siftei Chakhamim blocks |
| Project elucidation | `elucidations.json` type `EDITORIAL_ELUCIDATION` | “Understanding…” prose |
| Applicability / Noahide notes | `elucidations.json` type `NOAHIDE_GUIDANCE` | labeled, review-pending |

## Routes

- `/{locale}/` cover
- `/{locale}/read/{book}/{chapter}/` reader
- `/{locale}/library/`, `/paths/`, `/about/`, `/review/` (review is `noindex`)
- `/design/type-proof/` typography proof (`noindex`)

Losing visual-experiment routes are not shipped. Screenshots remain in `docs/evidence/`.

## Islands

- `ReaderApp` — verse selection control, desktop rail, Base UI Drawer, appearance
- `SearchBox` — local ref/alias/glossary/path index
- `ContinueReading` — `localStorage` key `ben-noach:v1`

Sacred text is document content (`<p lang>`), not a control. Understand is a separate verse-number control.

Sacred text is never taken from `localStorage`.
