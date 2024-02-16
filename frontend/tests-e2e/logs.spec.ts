import { test, expect } from "@playwright/test";

test("View logs", async ({ page }) => {
  await page.goto("http://localhost:3000/logs");
  await page.waitForTimeout(2000);
  await expect(page.getByRole("heading", { name: "Logs" })).toBeVisible();
  await expect(
    page.getByRole("columnheader", { name: "Prompt" }),
  ).toBeVisible();
  await expect(
    page.getByRole("columnheader", { name: "Duration" }),
  ).toBeVisible();
  await expect(page.getByText("Avg. Response Time")).toBeVisible();
  await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
  await expect(page).toHaveScreenshot("logs.png", { maxDiffPixelRatio: 0.1 });
});
