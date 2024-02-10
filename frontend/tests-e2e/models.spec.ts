import { test, expect } from '@playwright/test';

test('View models', async ({ page }) => {
  await page.goto('http://localhost:3000/models');
  await expect(page.getByRole('heading', { name: 'Models' })).toBeVisible();
  await expect(page.getByText('Model Name')).toBeVisible();
  await expect(page.getByText('Model Type')).toBeVisible();
  await expect(page.getByText('Default model')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'API Call' })).toBeVisible();
  await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
});