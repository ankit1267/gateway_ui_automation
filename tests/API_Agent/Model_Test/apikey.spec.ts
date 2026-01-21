import { test, expect } from '@playwright/test';
import { openModelTab } from '../../helper/openModelTab';
import { selectServiceProvider } from '../../helper/selectServiceProvider';

test.use({
  storageState: 'auth.json'
});

test('TC-APIKEY-01: API key required error is shown', async ({ page }) => {
  // Step 1: Open Model tab
  await openModelTab(page);

  await selectServiceProvider(page, 'Mistral');
  // Step 2: Ensure provider is selected (example: OpenAI)
  

  // Step 3: Ensure API key field is empty
  await expect(
    page.getByRole('button', { name: 'No API keys for this service' })
  ).toBeVisible();

  // Step 4: Click Get Started / Publish
   await page.locator('#agent-setup-get-started-button').click();

  // ✅ Assertion: Error message is shown
  await expect(
    page.getByText(/api key required/i)
  ).toBeVisible();
});

test('TC-APIKEY-02: API key is added', async ({ page }) => {
  // Step 1: Open Model tab
  await openModelTab(page);

  await selectServiceProvider(page, 'Mistral');
  // Step 2: Ensure provider is selected (example: OpenAI)
  

  // Step 3: Select API key field is selected
  await page.locator('#apikey-input-container').getByRole('button', { name: 'Mistral' }).click();

  

  // ✅ Assertion: Error message is shown
  await expect(
    page.locator('#chat-message-textarea')
  ).toBeVisible();
});
