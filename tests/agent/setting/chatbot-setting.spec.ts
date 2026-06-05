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

// these contains the test for the accordion now we remove it

  
});
