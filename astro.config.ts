import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const site = "https://viniciusdaniel-law.github.io";
const base = "/ben-noach";

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [react()],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "pt"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  build: {
    format: "directory",
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      sourcemap: false,
    },
  },
  security: {
    csp: {
      algorithm: "SHA-256",
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "worker-src 'self'",
        "manifest-src 'self'",
      ],
    },
  },
});
