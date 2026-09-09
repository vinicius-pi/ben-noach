# Known limitations

- Released corpus is Genesis 1:1–6 only.
- No approved Portuguese Tanakh translation is bundled.
- Noahide notes are `sources-verified`, not rabbinically reviewed.
- Bereshit Rabbah / Chagigah / Yalkut are deep-linked, not bundled (Hebrew Midrash Rabbah license was `unknown` at ingest).
- Supercommentaries beyond Siftei Chakhamim are not bundled.
- Search is local refs/aliases/glossary/paths, not the Sefaria library.
- GitHub Pages cannot set HTTP headers; CSP is delivered as a `<meta>` policy plus `public/_headers` / `deploy/nginx.conf` for hosts that honor them.
- `frame-ancestors` is not effective in a meta CSP; nginx/Pages alternatives are documented.
- PWA manifest is present; a license-aware service worker is not yet enabled.
- Visual screenshot baselines should be reviewed by a human before treating diffs as approval.
