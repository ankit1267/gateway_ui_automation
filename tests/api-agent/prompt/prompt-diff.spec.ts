import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test('compare published and current prompt', async ({ agents }) => {
  
  await agents.goto('api');

  const agent = await agents.openAgent(AGENT_NAME);
  
  await agent.prompt.fillPrompt(
    'You are a motivation coach',
    'Help users with motivation',
    'Always respond clearly and professionally'
  );

  await agent.prompt.clickInstructions();
  await agent.prompt.diffButtonClick();

  // Wait for modal
  await agent.prompt.diffModalVisible();

  await agent.prompt.comparePublishedAndCurrentShouldNotMatch();
});