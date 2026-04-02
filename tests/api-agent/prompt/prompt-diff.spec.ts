import { test } from '../../../fixtures/base.fixture';
import { fillPromptAndVerifyApi } from '../../../utils/fill-prompt-api';

const AGENT_NAME = 'Prompt';

test('compare published and current prompt', async ({ agents, page }) => {
  
  await agents.goto('chatbot');

  const agent = await agents.openAgent(AGENT_NAME);

  await fillPromptAndVerifyApi(
    page,
    async () => {
      await agent.prompt.fillPrompt('', '', '');
    },
    {
      role: '',
      goal: '',
      instruction: '',
    }
  );
  
  const role = `You are a motivation coach${Date.now()}`;
  const goal = `Help users with motivation${Date.now()}`;
  const instruction = `Always respond clearly and professionally${Date.now()}`;
  
  await fillPromptAndVerifyApi(
    page,
    async () => {
      await agent.prompt.fillPrompt(role, goal, instruction);
    },
    {
      role,
      goal,
      instruction,
    }
  );

  await agent.prompt.clickInstructions();
  await agent.prompt.diffButtonClick();

  // Wait for modal
  await agent.prompt.diffModalVisible();

  await agent.prompt.comparePublishedAndCurrentShouldNotMatch();
});