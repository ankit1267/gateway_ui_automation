import { expect, test } from '../../../fixtures/base.fixture';
import type { SdkCategory } from '../../../pages/agent/integration-guide.page';

const AGENT_NAME = process.env.AGENT_NAME!;

// Every SDK/language category exposed on the Integration Guide (cURL, GTWY SDK, OpenAI SDK).
const SDK_CATEGORIES: SdkCategory[] = ['curl', 'gtwy', 'openai'];

test.describe('Integration Guide - API Agent', () => {

  test('TC-IG-01: API tab - every copy button should work for each available programming language', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openIntegrationGuide();
    await agent.integrationGuide.expectPageVisible();

    for (const category of SDK_CATEGORIES) {
      await agent.integrationGuide.selectCategory(category);
      const copiedCount = await agent.integrationGuide.copyAllAvailableCodeBlocks();
      expect(copiedCount, `expected at least one copyable code block for "${category}"`).toBeGreaterThan(0);
    }
  });

  test('TC-IG-02: Batch API tab - every copy button should work for each available programming language', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openIntegrationGuide();
    await agent.integrationGuide.expectPageVisible();

    await agent.integrationGuide.clickBatchTab();

    for (const category of SDK_CATEGORIES) {
      await agent.integrationGuide.selectCategory(category);
      const copiedCount = await agent.integrationGuide.copyAllAvailableCodeBlocks();
      expect(copiedCount, `expected at least one copyable code block for "${category}"`).toBeGreaterThan(0);
    }
  });

  test('TC-IG-03: API tab - category tabs show the expected snippet for each SDK (cURL, GTWY SDK, OpenAI SDK)', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openIntegrationGuide();
    await agent.integrationGuide.expectPageVisible();

    await agent.integrationGuide.expectAvailableCategoriesShowExpectedSnippets();
  });

  test('TC-IG-04: API tab - steps should not be empty', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openIntegrationGuide();
    await agent.integrationGuide.expectPageVisible();

    await agent.integrationGuide.expectRequestSnippetHasText();
    await agent.integrationGuide.expectResponseSnippetHasText();
  });

  test('TC-IG-56: Batch API tab - steps should not be empty', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openIntegrationGuide();
    await agent.integrationGuide.expectPageVisible();

    await agent.integrationGuide.clickBatchTab();

    await agent.integrationGuide.expectRequestSnippetHasText();
    await agent.integrationGuide.expectResponseSnippetHasText();
  });
});
