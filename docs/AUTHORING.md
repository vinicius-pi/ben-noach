# Adding a passage

Do not edit reader UI to add a verse.

## Workflow

1. Fetch the exact approved versions into `tmp-ingest/` (see `docs/CORPUS_V1.md`).
2. Extend `scripts/generate-corpus.py` only if a new work/version is required. For the next verse of an already ingested range, raise `verses_n` and add optional elucidation objects.
3. Run `python scripts/generate-corpus.py`.
4. Run `pnpm validate:content && pnpm test && pnpm build`.
5. Confirm the new verse appears on the existing chapter route.

Genesis 1:6 was added this way: `verses_n = 6` plus three elucidation records. No `ReaderApp` change.

## Required per verse

- Hebrew + English with checksums
- Scope tags and address note
- Optional Rashi segments (absence is valid)
- Optional Siftei Chakhamim (CC BY attribution)
- Optional elucidation answering a real textual problem
- Optional Noahide note — omit when there is no genuine relevance

## Portuguese

UI/elucidation may be Portuguese. Do not bundle an unknown-rights Portuguese Tanakh translation.
