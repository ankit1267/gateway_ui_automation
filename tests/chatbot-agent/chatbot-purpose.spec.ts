import { test, expect } from '../../fixtures/base.fixture';

test('Create chatbot with purpose and verify generated prompt', async ({ agents }) => {
  await agents.goto('chatbot');

  await agents.clickCreateNewAgent();
  await agents.createAgentModal.waitForVisible();
  await agents.createAgentModal.fillPurpose('A customer support agent');
  const agent = await agents.clickCreateNewAgentSubmit();

  await agent.tabs.openPrompt();

  // Wait until role, goal, and instructions are populated from the purpose
  await expect.poll(async () => {
    const role = await agent.prompt.getRoleValue();
    return role && role.trim().length > 0;
  }, { timeout: 30000 }).toBeTruthy();

  await expect.poll(async () => {
    const goal = await agent.prompt.getGoalValue();
    return goal && goal.trim().length > 0;
  }, { timeout: 30000 }).toBeTruthy();

  await expect.poll(async () => {
    const instructions = await agent.prompt.getInstructionsValue();
    return instructions && instructions.trim().length > 0;
  }, { timeout: 30000 }).toBeTruthy();

  // Cleanup
  const agentName = await agent.header.getAgentNameText();
  await agents.goto('chatbot');
  await agents.deleteAgentByName(agentName);
});
