import { test, expect } from '../../../fixtures/base.fixture';
import type { AgentPage } from '../../../pages/agent/agent.page';

const CHATBOT_AGENT = process.env.CHATBOT_AGENT!;

test.describe('Chatbot Settings', () => {
  let agent: AgentPage;

  test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
    agent = await agents.openAgent(CHATBOT_AGENT);
    await agent.tabs.openSettings();
  });

  test('TC-CB-SET-01: Chatbot Configuration section is visible for chatbot agents.', async () => {
    // Verify chatbot config section is visible
    await agent.settings.expectChatbotConfigSectionVisible();
    await agent.settings.expectChatbotConfigAccordionVisible();

    // Toggle the accordion
    await agent.settings.toggleChatbotConfigAccordion();

    // Verify inner components are visible after opening accordion
    await expect(agent.settings.starterQuestionContainer).toBeVisible();
    await expect(agent.settings.userReferenceContainer).toBeVisible();
  });

  test('TC-CB-SET-02: Toggle chatbot configuration accordion.', async () => {
    // Verify accordion is initially collapsed (inner components not visible)
    await agent.settings.expectChatbotConfigSectionVisible();
    await agent.settings.expectChatbotConfigAccordionVisible();

    // Open accordion
    await agent.settings.toggleChatbotConfigAccordion();
    await expect(agent.settings.starterQuestionContainer).toBeVisible();

    // Close accordion
    await agent.settings.toggleChatbotConfigAccordion();
  });
});
