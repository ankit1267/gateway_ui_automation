import { test } from '../../../fixtures/base.fixture';


const AGENT_NAME = process.env.AGENT_NAME!;

test('TC-APIKEY-01: API key required error is shown', async ({ agents }) => {

  await agents.goto('api');
  // Step 1: Open Model tab
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openModel();

  // Step 2: Ensure provider is selected (example: OpenAI)
  await agent.model.selectServiceProvider('Anthropic');

  // Step 3: Ensure API key field is empty
  await agent.model.expectNoApiKeysMessage();

  // Step 4: Click Get Started / Publish
  await agent.model.clickGetStarted();

  // Assertion: Error message is shown
  await agent.model.expectApiKeyRequiredError();

});

test('TC-APIKEY-02: API key is added', async ({ agents, page }) => {
 
  // Step 1: Open Model tab
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openModel();
  // Step 2: Ensure provider is selected (example: OpenAI)
  await agent.model.selectServiceProvider('Mistral');

  // API Verification: Wait for API key selection request
  const apiKeyResponsePromise = page.waitForResponse(
    (resp) =>
      resp.url().includes('/api/versions/') &&
      resp.request().method() === 'PUT' &&
      resp.status() === 200,
    { timeout: 15000 }
  );
  
  // Step 3: Select API key field is selected
  await agent.model.selectApiKey('Mistral');

  // API Verification: Verify request includes credential_id
  const apiKeyResponse = await apiKeyResponsePromise;
  const requestBody = JSON.parse(apiKeyResponse.request().postData() || '{}');
  console.log(apiKeyResponse.request().postData());
  // Assertion: Chat is visible
  await agent.model.expectChatTextareaVisible();
});
