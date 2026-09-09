import { readFileSync } from "node:fs";
import { SOURCE_MANIFEST } from "../src/lib/corpus";

const ALLOWED = new Set([
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "0BSD",
  "MPL-2.0",
  "OFL-1.1",
  "CC0-1.0",
  "CC-BY-4.0",
  "BlueOak-1.0.0",
  "Unlicense",
]);

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const DIRECT_LICENSES: Record<string, string> = {
  astro: "MIT",
  "@astrojs/react": "MIT",
  react: "MIT",
  "react-dom": "MIT",
  "@base-ui/react": "MIT",
  "@fontsource-variable/frank-ruhl-libre": "OFL-1.1",
  "@fontsource-variable/literata": "OFL-1.1",
  "@fontsource/noto-serif-hebrew": "OFL-1.1",
  typescript: "Apache-2.0",
  vitest: "MIT",
  eslint: "MIT",
  prettier: "MIT",
  tsx: "MIT",
  playwright: "Apache-2.0",
  "@playwright/test": "Apache-2.0",
  "@axe-core/playwright": "MPL-2.0",
  "@lhci/cli": "Apache-2.0",
  "@astrojs/check": "MIT",
  "@eslint/js": "MIT",
  "@types/node": "MIT",
  "@types/react": "MIT",
  "@types/react-dom": "MIT",
  "eslint-plugin-astro": "MIT",
  "eslint-plugin-jsx-a11y": "MIT",
  jsdom: "MIT",
  "prettier-plugin-astro": "MIT",
  "typescript-eslint": "MIT",
};

const names = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
for (const name of names) {
  const license = DIRECT_LICENSES[name];
  if (!license) {
    console.error(`license map missing for ${name} — add an explicit record`);
    process.exit(1);
  }
  if (!ALLOWED.has(license)) {
    console.error(`disallowed license ${license} for ${name}`);
    process.exit(1);
  }
}

for (const entry of SOURCE_MANIFEST) {
  if (entry.bundleAllowed && entry.licenseStatus === "unknown") {
    console.error(`unknown rights bundled: ${entry.id}`);
    process.exit(1);
  }
  if (
    entry.licenseSpdx &&
    !ALLOWED.has(entry.licenseSpdx) &&
    entry.licenseStatus !== "public-domain"
  ) {
    console.error(`disallowed content license ${entry.licenseSpdx} for ${entry.id}`);
    process.exit(1);
  }
}

console.log("licenses ok");
