# Lighthouse evidence

Chrome: `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`
Runner: `lighthouse` CLI (`scripts/run-lhci.ts`), not `lhci autorun`.
Flags: `--headless=new --no-sandbox --disable-dev-shm-usage`.
Thresholds: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90.

| Page | Form | P | A | BP | SEO | FCP | LCP | CLS | Bytes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| home-desktop | desktop | 100 | 100 | 96 | 100 | 0.4 s | 0.5 s | 0 | Total size was 196 KiB |
| reader-desktop | desktop | 100 | 100 | 96 | 100 | 0.4 s | 0.5 s | 0 | Total size was 269 KiB |
| reader-mobile | mobile | 97 | 100 | 96 | 100 | 1.7 s | 2.4 s | 0 | Total size was 269 KiB |

JSON/HTML reports: `lhci/` (gitignored).

Lighthouse may log CSP violations from styles it injects into the page. Those are auditor artifacts, not shipped product styles. Product React islands do not use inline `style=` attributes.

