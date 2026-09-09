import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home to Genesis READ UNDERSTAND SOURCES", async ({ page }) => {
  await page.goto("./en/");
  await expect(page.getByRole("heading", { name: "Ben Noach" })).toBeVisible();
  await page
    .getByRole("link", { name: /Begin reading|Continue reading/ })
    .first()
    .click();
  await expect(page.getByRole("heading", { name: "בראשית" })).toBeVisible();
  await page.locator("#v1").click();
  await expect(page.getByRole("heading", { name: "Understanding the verse" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^Rashi/ }).first()).toBeVisible();
  await page.getByRole("button", { name: "Sources", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sources & provenance" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Continue in Sefaria/ })).toHaveAttribute(
    "href",
    /sefaria\.org/,
  );
});

test("keyboard verse selection", async ({ page }) => {
  await page.goto("./en/read/genesis/1/");
  await page.locator("#verse-select-1").press("Enter");
  await expect(page.getByRole("heading", { name: "Understanding the verse" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { name: "Understanding the verse" })).toHaveCount(0);
});

test("axe on home and reader", async ({ page }) => {
  for (const path of ["./en/", "./en/read/genesis/1/"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  }
});

test("provider-offline still reads Genesis", async ({ page, context }) => {
  await context.route("https://www.sefaria.org/**", (route) => route.abort());
  await context.route("https://sefaria.org/**", (route) => route.abort());
  await page.goto("./en/read/genesis/1/");
  await expect(page.getByText("בְּרֵאשִׁ֖ית")).toBeVisible();
  await page.locator("#v1").click();
  await expect(page.getByText("Understanding the verse")).toBeVisible();
});

test("unreleased Portuguese locale is neither generated nor advertised", async ({ page }) => {
  await page.goto("./en/");
  await expect(page.getByRole("link", { name: "PT", exact: true })).toHaveCount(0);
  await expect(page.locator('link[rel="alternate"][hreflang="pt"]')).toHaveCount(0);

  const response = await page.goto("./pt/read/genesis/1/");
  expect(response?.status()).toBe(404);
});

test("glossary is contextual to the selected verse", async ({ page }) => {
  await page.goto("./en/read/genesis/1/");
  await page.locator("#v1").click();
  await expect(page.getByText("dibbur hamatchil", { exact: true })).toBeVisible();
  await expect(page.locator("dt.kicker", { hasText: "peshat" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await page.locator("#v3").click();
  await expect(page.getByText("dibbur hamatchil", { exact: true })).toHaveCount(0);
  await expect(page.locator("dt.kicker", { hasText: "peshat" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Words and terms" })).toBeVisible();
});
