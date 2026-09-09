import { test, expect } from "@playwright/test";

const shots = [
  { name: "home", path: "./en/" },
  { name: "reader", path: "./en/read/genesis/1/" },
];

for (const shot of shots) {
  test(`screenshot ${shot.name}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(shot.path);
    await expect(page).toHaveScreenshot(`${shot.name}-${testInfo.project.name}.png`, {
      fullPage: true,
    });
  });
}

test("selected verse understand", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./en/read/genesis/1/");
  await page.locator("#v1").click();
  await expect(page.getByRole("heading", { name: "Understanding the verse" })).toBeVisible();
  await expect(page).toHaveScreenshot(`understand-${testInfo.project.name}.png`, {
    fullPage: true,
  });
});
