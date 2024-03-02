import { test, expect } from "@playwright/test";

test("View settings", async ({ page }) => {
  await page.goto("http://localhost:3000/settings");
  await page.waitForTimeout(2000);

  await expect(
    page.getByRole("heading", { name: "Organization Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Environment Variables" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  await expect(page).toHaveScreenshot("settings.png", {
    maxDiffPixelRatio: 0.02,
  });
});
