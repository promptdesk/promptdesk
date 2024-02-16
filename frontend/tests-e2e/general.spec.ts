import { test, expect } from "@playwright/test";

test("View navigation", async ({ page }) => {
  await page.goto("http://localhost:3000/prompts/all");
  await page.waitForTimeout(2000);
  await expect(page.locator(".app-navigation")).toBeVisible();
  await expect(page).toHaveScreenshot("navigation.png", {
    maxDiffPixelRatio: 0.02,
  });
});
