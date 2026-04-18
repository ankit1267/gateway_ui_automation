import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = 'KnowledgeBase Test';

test('Query playground and verify response contains menu item', async ({ agents }) => {
  // Navigate to API agents page
  await agents.goto('api');

  // Open KnowledgeBase Test agent
  const agent = await agents.openAgent(AGENT_NAME);

  // Query playground with "what is the menu"
  await agent.playground.typeMessage('what is the menu');

  // Wait for response to be visible
  await agent.playground.expectChatMessageVisible(1);

  // Verify chat response contains "burger:30Ra"
  await agent.playground.expectChatMessageContainsText(1, 'Burger');
});
