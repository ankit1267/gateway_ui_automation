import { test, expect } from '@playwright/test';

test.use({
    storageState: 'auth.json',
});

const WORKSPACE = process.env.WORKSPACE_NAME!;

test.beforeEach(async ({ page }) => {
    // Navigate to org page
    await page.goto('/org');
    // Select organization
    await page.getByText(`${WORKSPACE}`, { exact: true }).click();
    // Open Knowledge Base
    await page.getByRole('button', { name: 'Knowledge base' }).click();
    //Create Knowledge Base
    await page.getByRole('button', { name: '+ Create Knowledge Base' }).click();

})

test('Create Knowledge Base using Playwright Docs URL', async ({ page }) => {
    // Create KB
    await page.getByRole('textbox', { name: 'Knowledge Base name' })
        .fill('Playwright');

    await page.getByRole('textbox', { name: /brief description/i })
        .fill('Contain Playwright doc');

    await page.getByRole('textbox', { name: /https:\/\/example.com\/resource/i })
        .fill('https://playwright.dev/docs/intro');

    await page.getByRole('button', { name: 'Add Resource' }).click();

    // Assert KB created
    const kbRow = page.getByRole('row', { name: /Playwright/ });
    await expect(kbRow).toBeVisible();
    //await page.pause();
    //delete 
    await page.locator('.lucide.lucide-trash2').first().click();
    await page.getByRole('button', { name: 'Delete' }).click();

});

test('Upload File option shows file upload input',async({page})=>{
   await page.getByRole('radio', { name: 'Upload File' }).check();

  //Assert file upload input is visible
  await expect(
    page.locator('#knowledgebase-file-upload')
  ).toBeVisible();
});


test('Content option shows content textbox',async({page})=>{
  await page.getByRole('radio', { name: 'Content' }).check();
  // Assert file upload input is visible
  await expect(
    page.locator('#knowledgebase-content-textarea-create')
  ).toBeVisible();
});