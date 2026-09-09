# From Genesis 1:1–5 to Genesis 1–11

v1 proved the architecture with Genesis 1:1–5, then added Genesis 1:6 through `scripts/generate-corpus.py` without reader UI changes.

To reach Genesis 1–11:

1. Ingest `Genesis.1.7`–`Genesis.11` from **Tanach with Ta'amei Hamikra** and **JPS 1917**.
2. Ingest **Rosenbaum/Silbermann Rashi** for those verses, keeping segment identity.
3. Ingest Metsudah **Siftei Chakhamim** only where it teaches the Rashi question; keep CC BY attribution.
4. Author elucidations only where there is a textual problem.
5. Tag applicability; do not invent a Noahide takeaway per verse.
6. Deep-link Midrash/Gemara whose rights are not approved for bundling.
7. Run `pnpm validate:content`, tests, and visual review of a long chapter.

The chapter route already paginates by `passages.json` verse IDs. A new chapter is a new passage record plus verses, not a new React page.
