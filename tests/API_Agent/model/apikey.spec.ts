import { test, expect } from '@playwright/test';
import { ModelPage } from '../../../pages/api_agent/modelPage';

test.use({
  storageState: 'auth.json'
});

test('TC-APIKEY-01: API key required error is shown', async ({ page }) => {

  const modelPage = new ModelPage(page);
  
  
 
  // Step 1: Open Model tab
  await modelPage.openModelTab();
  // Step 2: Ensure provider is selected (example: OpenAI)
  await modelPage.selectServiceProvider('Mistral');
  
  

  // Step 3: Ensure API key field is empty
  await modelPage.expectNoApiKeysMessage();

  // Step 4: Click Get Started / Publish
   await modelPage.clickGetStarted();

  // Assertion: Error message is shown
  await modelPage.expectApiKeyRequiredError();

});

test('TC-APIKEY-02: API key is added', async ({ page }) => {
   const modelPage = new ModelPage(page);
   // Step 1: Open Model tab
  await modelPage.openModelTab();
  // Step 2: Ensure provider is selected (example: OpenAI)
  await modelPage.selectServiceProvider('Mistral');
  

  // Step 3: Select API key field is selected
  await modelPage.selectApiKey('Mistral');

  
  // Assertion: Error message is shown
  await modelPage.expectChatTextareaVisible();
});
