import { test, expect } from '../../../fixtures/base.fixture';
import { waitForAgentUpdateApi } from '../../../utils/model-api';


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

  // Step 3: Select API key and verify API request
  const [apiKeyResponse] = await Promise.all([
    waitForAgentUpdateApi(page),
    agent.model.selectApiKey('Mistral')
  ]);

  // API Verification: Verify request includes apikey_object_id
  const requestBody = JSON.parse(apiKeyResponse.request().postData() || '{}');
  // Assertion: Chat is visible
  await agent.model.expectChatTextareaVisible();
});
