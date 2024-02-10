import { test, expect } from '@playwright/test';

test('View settings', async ({ page }) => {
  await page.goto('http://localhost:3000/settings');
  await expect(page.getByRole('heading', { name: 'Organization Information' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Environment Variables' })).toBeVisible();
  await expect(page.getByTestId('pg-save-btn')).toBeVisible();
});