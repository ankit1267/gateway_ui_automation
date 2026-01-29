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

test('Chunk size resets to 4000 when value exceeds maximum', async ({ page }) => {


    const chunkSizeInput = page.locator('#knowledgebase-chunk-size-input');

    // Enter value greater than max allowed
    await chunkSizeInput.fill('15000');

    // Trigger blur/change (important!)
    await chunkSizeInput.blur();

    // Assertion: value should reset to 4000
    await expect(chunkSizeInput).toHaveValue('4000');
});

test('Chunk size resets to 1 when we enter 0', async ({ page }) => {

    const chunkSizeInput = page.locator('#knowledgebase-chunk-size-input');

    // Enter value greater than max allowed
    await chunkSizeInput.fill('0');

    // Trigger blur/change (important!)
    await chunkSizeInput.blur();

    // Assertion: value should reset to 4000
    await expect(chunkSizeInput).toHaveValue('1');
});


