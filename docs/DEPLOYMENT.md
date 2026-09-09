# Deployment

## GitHub Pages (free)

Workflow: `.github/workflows/pages.yml`.

Configure the repository:

1. Settings → Pages → Source: GitHub Actions.
2. `astro.config.ts` already sets `site: https://viniciusdaniel-law.github.io` and `base: /ben-noach`.
3. After merge to `main`, the site is `https://viniciusdaniel-law.github.io/ben-noach/`.

## Generic static host

```bash
pnpm install --frozen-lockfile
pnpm build
```

Serve `dist/` with any static server. Paths are prefixed with `/ben-noach/`. For a domain root, set `base: '/'` and `site` to that origin, then rebuild.

Nginx recipe: `deploy/nginx.conf` (CSP and related headers).

`public/_headers` is honored by some static hosts; GitHub Pages is not one of them, so the app also emits a CSP `<meta>` tag.

## No paid credentials

The public reader builds and runs without API keys, databases, or auth.
