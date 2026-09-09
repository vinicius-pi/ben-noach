# Design decision — v1

Three complete directions were built on identical Genesis 1:1–5 (then 1:6) data and inspected at 390×844, 768×1024, and 1440×1000.

Evidence lives in `docs/evidence/` (`dir-editorial-*`, `dir-scholarly-*`, `dir-immersive-*`).

Rejected token experiments are archived (not shipped) at `docs/design-experiments/tokens-rejected.css`.

## A. Editorial Modernism

White paper, Literata Variable + Frank Ruhl Libre Variable, large measure, low chrome. The Tanakh is the only large object on the page.

## B. Quiet Scholarly

Warm paper, Noto Serif Hebrew, slightly denser source edge. More “edition apparatus,” less opening of a book.

## C. Immersive Reader

Dark field, larger type. Strong at night; weaker as a first encounter with scripture.

## Winner: Editorial Modernism

Chosen from the rendered screenshots, not from code preference.

- Reading calm is highest when chrome recedes on a white field.
- Hebrew with niqqud/te'amim is clearest on `--paper`.
- The product identity in `DESIGN_RESEARCH.md` is white/off-white and deep blue.
- Mobile sheet and desktop rail remain the same interaction; only tokens change.

Losing directions are not production routes. Comparison evidence is the screenshot set plus the archived tokens. Production pages use Editorial Modernism. Typography proof remains at `/design/type-proof/` (`noindex`).
