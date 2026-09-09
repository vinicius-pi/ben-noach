import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const base = "http://127.0.0.1:4173/ben-noach";
const out = "docs/evidence";
mkdirSync(out, { recursive: true });

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1000 },
];

const directions = ["editorial", "scholarly", "immersive"];

const browser = await chromium.launch();

async function shot(page, name) {
  await page.screenshot({ path: join(out, `${name}.png`), fullPage: true });
}

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: vp, colorScheme: "light" });
  const page = await context.newPage();

  await page.goto(`${base}/en/`, { waitUntil: "networkidle" });
  await shot(page, `home-${vp.name}`);

  await page.goto(`${base}/en/read/genesis/1/`, { waitUntil: "networkidle" });
  await shot(page, `reader-${vp.name}`);

  await page.locator("#v1").click();
  await page.getByRole("heading", { name: "Understanding the verse" }).waitFor();
  await shot(page, `understand-${vp.name}`);

  await page.getByRole("tab", { name: "Sources" }).click();
  await page.getByRole("heading", { name: "Sources & provenance" }).waitFor();
  await shot(page, `sources-${vp.name}`);

  await page.locator('select[aria-label="Larger text"]').selectOption("xl");
  await shot(page, `enlarged-${vp.name}`);

  for (const direction of directions) {
    await page.goto(`${base}/design/${direction}/`, { waitUntil: "networkidle" });
    await shot(page, `dir-${direction}-reader-${vp.name}`);
    await page.locator("#v1").click();
    await page.getByRole("heading", { name: "Understanding the verse" }).waitFor();
    await shot(page, `dir-${direction}-understand-${vp.name}`);
  }

  await context.close();
}

await browser.close();
console.log("evidence captured");
