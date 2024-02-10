import { test, expect } from '@playwright/test';

test('View navigation', async ({ page }) => {
  await page.goto('http://localhost:3000/prompts/all');
  await expect(page.locator('.app-navigation')).toBeVisible();
  page.locator('.app-navigation').hover();
  await expect(page).toHaveScreenshot('navigation.png', { maxDiffPixels: 1000 })
  await expect(page.getByRole('link', { name: 'Playground' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Prompts', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Documentation' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
});