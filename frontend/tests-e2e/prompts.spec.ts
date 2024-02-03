import { test, expect } from '@playwright/test';

/*

test('Search for specific prompt.', async ({ page }) => {
    await page.goto('http://localhost:3000/prompts/all');
    await page.getByPlaceholder('Search prompts').click();
    await page.getByPlaceholder('Search prompts').fill('hello');
    await expect(page.locator('tbody')).toContainText('hello');
});


test('Test navigation to make sure all buttons appear.', async ({ page }) => {
    await page.goto('http://localhost:3000/prompts/all');
    await expect(page.locator('.app-navigation')).toBeVisible();
    page.locator('.app-navigation').hover();
    await expect(page).toHaveScreenshot('navigation.png', { maxDiffPixels: 1000 })
    await expect(page.getByRole('link', { name: 'Playground' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Prompts', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Documentation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
});

test('Create prompt and generate results.', async ({ page }) => {
  await page.goto('http://localhost:3000/prompts/all');
  await page.getByRole('button', { name: 'New prompt' }).click();
  await page.getByPlaceholder('Write a tagline for an ice').click();
  await page.getByPlaceholder('Write a tagline for an ice').fill('Generate 3 hashtags.');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('pre')).toContainText('#');
  await page.getByText('x', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Prompts' })).toBeVisible();
});*/

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

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/prompts/all');
    });

    test('01.Visit prompt page', async ({ page }) => {
        await expect(page).toHaveScreenshot('landing.png', { maxDiffPixels: 1000 });
        await expect(page.getByRole('button', { name: 'New prompt' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Import' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Prompts' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Description' })).toBeVisible();
        await expect(page.locator('.app-navigation')).toBeVisible();
    });

    test('02.Create a new prompt', async ({ page }) => {
        await page.getByRole('button', { name: 'New prompt' }).click();
        await page.waitForTimeout(1000);
        await expect(page.getByText('Prompt Name')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
        await expect(page.getByText('+')).toBeVisible();
        await expect(page).toHaveScreenshot('new_prompt.png', { maxDiffPixels: 1000 });

        await page.getByPlaceholder('Write a tagline for an ice').click();
        await page.getByPlaceholder('Write a tagline for an ice').fill('Generate 3 hashtags.');

        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('textbox').first().click();
        await page.getByRole('textbox').first().click({
          clickCount: 3
        });
        //generate a random string
        var sample_random = randomString(10);
        await page.getByRole('textbox').first().fill(sample_random);
        await page.getByRole('textbox').nth(2).click();
        await page.getByRole('textbox').nth(2).fill('test');
        await expect(page).toHaveScreenshot('save_new_prompt.png', { maxDiffPixels: 1000 });
        await page.waitForTimeout(1000);
    });

    test('03.Save a new prompt', async ({ page }) => {
        await expect(page).toHaveScreenshot('new_prompt.png', { maxDiffPixels: 1000 });
        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('textbox').first().click();
        await page.getByRole('textbox').first().click({
          clickCount: 3
        });
        //generate a random string
        var sample_random = randomString(10);
        await page.getByRole('textbox').first().fill(sample_random);
        await page.getByRole('textbox').nth(2).click();
        await page.getByRole('textbox').nth(2).fill('test');
        await expect(page).toHaveScreenshot('save_new_prompt.png', { maxDiffPixels: 1000 });
        await page.waitForTimeout(1000);
    });
});
  
/*test('Create a prompt, save it, reload the page and delete it.', async ({ page }) => {
    await page.goto('http://localhost:3000/prompts/all');
    await expect(page.getByRole('heading', { name: 'Prompts' })).toBeVisible();
    await page.getByRole('button', { name: 'New prompt' }).click();
    await expect(page).toHaveScreenshot('new_create_prompt.png', { maxDiffPixels: 1000 });
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('textbox').first().click();
    await page.getByRole('textbox').first().click({
      clickCount: 3
    });
    //generate a random string
    var sample_random = randomString(10);
    await page.getByRole('textbox').first().fill(sample_random);
    await page.getByRole('textbox').nth(2).click();
    await page.getByRole('textbox').nth(2).fill('test');
    await expect(page).toHaveScreenshot('save_new_prompt.png', { maxDiffPixels: 1000 });
    await page.getByRole('button', { name: 'Save' }).first().click();
    //wait 1 second for the prompt to save
    await page.waitForTimeout(1000);
    await page.reload();
    await expect(page).toHaveScreenshot('reloaded_new_prompt.png', { maxDiffPixels: 1000 });
    await expect(page.getByText(sample_random)).toBeVisible();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Save preset')).toBeVisible();
    await expect(page).toHaveScreenshot('delete_prompt_modal.png', { maxDiffPixels: 1000 });
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('heading', { name: 'Prompts' })).toBeVisible();
});*/