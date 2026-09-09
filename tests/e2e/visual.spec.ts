import { test, expect } from "@playwright/test";

const shots = [
  { name: "home", path: "./en/" },
  { name: "reader", path: "./en/read/genesis/1/" },
];

for (const shot of shots) {
  test(`screenshot ${shot.name}`, async ({ page }, testInfo) => {
    await page.goto(shot.path);
    await page.addStyleTag({
      content: "*,*::before,*::after{animation:none!important;transition:none!important}",
    });
    await expect(page).toHaveScreenshot(`${shot.name}-${testInfo.project.name}.png`, {
      fullPage: true,
    });
  });
}

test("selected verse understand", async ({ page }, testInfo) => {
  await page.goto("./en/read/genesis/1/");
  await page.locator("#v1").click();
  await page.addStyleTag({
    content: "*,*::before,*::after{animation:none!important;transition:none!important}",
  });
  await expect(page).toHaveScreenshot(`understand-${testInfo.project.name}.png`, {
    fullPage: true,
  });
});
