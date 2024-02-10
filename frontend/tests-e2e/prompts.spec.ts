import { test, expect } from '@playwright/test';

//generate random string
function randomString(length:any) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;

}

test.describe('Create, save run and delete a prompt.', () => {
    test.describe.configure({ mode: 'serial' });

    test('01.Visit prompt page', async ({ page }) => {
        await page.goto('http://localhost:3000/prompts/all');
        await page.waitForTimeout(1000);
        await expect(page).toHaveScreenshot('landing.png', { maxDiffPixels: 1000 });
        await expect(page.getByRole('button', { name: 'New prompt' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Import' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Prompts' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Description' })).toBeVisible();
        await expect(page.locator('.app-navigation')).toBeVisible();
    });

    test('02.Create, save, delete prompt', async ({ page }) => {

        //generate a random string
        var sample_random = randomString(10);
        await page.goto('http://localhost:3000/prompts/all');
        await page.waitForTimeout(1000);
        await expect(page.getByRole('button', { name: 'New prompt' })).toBeVisible();
        await page.getByRole('button', { name: 'New prompt' }).click();
        await page.getByPlaceholder('Write a tagline for an ice').click();
        await page.getByPlaceholder('Write a tagline for an ice').fill('This is a test prompt.');
        await expect(page).toHaveScreenshot('prompt.png', { maxDiffPixels: 1000 });
        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('textbox').first().click();
        await page.getByRole('textbox').first().fill(sample_random);
        await expect(page.getByText('Save preset')).toBeVisible();
        await page.getByRole('button', { name: 'Save' }).first().click();
        await expect(page).toHaveScreenshot('save.png', { maxDiffPixels: 1000 });
        await page.waitForTimeout(1000);
        await page.reload();
        await page.waitForTimeout(1000);
        await expect(page).toHaveScreenshot('save.png', { maxDiffPixels: 1000 });
        await expect(page.getByText(sample_random, { exact: true })).toBeVisible();
        await expect(page.getByPlaceholder('Write a tagline for an ice')).toContainText('This is a test prompt.');
        await expect(page.getByText(sample_random)).toBeVisible();
        await expect(page.getByText('Prompt Name')).toBeVisible();
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
        await page.getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByRole('heading', { name: 'Prompts' })).toBeVisible();
        await expect(page).toHaveScreenshot('landing.png', { maxDiffPixels: 1000 });

    });

    test('03.Create and run prompt', async ({ page }) => {

      await page.goto('http://localhost:3000/prompts/all');
      await page.getByRole('button', { name: 'New prompt' }).click();
      await page.getByPlaceholder('Write a tagline for an ice').click();
      await page.getByPlaceholder('Write a tagline for an ice').fill('say hello');
      await expect(page.getByPlaceholder('Write a tagline for an ice')).toBeVisible();
      await expect(page.getByPlaceholder('Write a tagline for an ice')).toContainText('say hello');
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(5000);
      await expect(page.locator('pre')).toBeVisible();
      await expect(page).toHaveScreenshot('generated.png', { maxDiffPixels: 3000 })
      await page.getByRole('button', { name: 'Clear' }).click();
      await expect(page.locator('pre')).not.toBeVisible();
      await page.getByText('x', { exact: true }).click();
      //wait 1 second for the prompt to delete
      await page.waitForTimeout(1000);
      await expect(page.getByRole('heading', { name: 'Prompts' })).toBeVisible();
      

  });



});
  