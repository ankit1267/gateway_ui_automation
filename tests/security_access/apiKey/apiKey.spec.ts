import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('API Key modal – name, apikey fields and cancel', async ({ page }) => {
    await page.goto('https://dev.gtwy.ai/org/57720/agents?type=chatbot');

    // Open API Keys
    await page.getByRole('button', { name: 'API Keys' }).click();

    // Open Add API Key modal
    await page.getByRole('button', { name: '+ Add New API Key' }).click();

    // ---- Name field ----
    const nameInput = page.getByRole('textbox', { name: 'Enter Name' });
    await expect(nameInput).toBeVisible();
    await nameInput.fill('test_api_key');

    // ---- Apikey field ----
    const apiKeyInput = page.getByRole('textbox', { name: 'Enter Apikey' });
    await expect(apiKeyInput).toBeVisible();
    await apiKeyInput.fill('AIzaSyCW9iewaNI64Z8RP58oHksojNFl6R96WmA');

    // ---- Optional: Comment ----
    const commentInput = page.getByRole('textbox', { name: 'Enter Comment' });
    await commentInput.fill('test key');

    // ---- Service dropdown (optional, default already selected) ----
    await page.getByRole('combobox', { name: 'Service*' }).selectOption('gemini');

    // // ---- Cancel modal ----
    // await page.getByRole('button', { name: 'Cancel' }).click();

    // // Modal should be closed
    // await expect(
    //     page.getByRole('heading', { name: 'Add New API Key' })
    // ).not.toBeVisible();

    const addButton = page.locator('#apikey-modal-submit-button');

    // Click Add
    await addButton.click();


});
