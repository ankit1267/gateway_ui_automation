import { test, expect } from '../../../fixtures/base.fixture';

const AGENT = process.env.TESTING_AGENT!;

test('Publish agent with Groq service without API key configured', async ({ agents, page }) => {
  // Navigate to API agents page
  await agents.goto('api');

  // Create new agent
  const agent = await agents.openAgent(AGENT);

  // Go to Model tab
  await agent.tabs.openModel();

  // Select Groq service provider
  await agent.model.selectServiceProvider('Groq');

  // Try to publish
  await agent.header.clickPublish();
  await agent.header.clickPublishButton();

  // Check for API key not configured message in publish dialog
  await agent.header.expectPublishApiKeyMissingWarning();
});
