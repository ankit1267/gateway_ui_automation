import { expect, test } from '../../../fixtures/base.fixture';

test('open and close prompt helper and apply prompt', async ({ agents }) => {

  await agents.goto('api');

  const agent = await agents.openAgent(process.env.AGENT_NAME!);

  // Open helper from instructions field
  await agent.prompt.promptHelper.open();

  // Validate helper UI
  await agent.prompt.promptHelper.expectVisible();
  await agent.prompt.promptHelper.expectTipTapEditorVisible();

  await agent.prompt.promptHelper.generateInstruction('hii');
  await agent.prompt.promptHelper.expectCanvasInputVisible();
  await agent.prompt.promptHelper.clickCanvasSendButton();

  await agent.prompt.promptHelper.expectApplyButtonVisible();
  await agent.prompt.promptHelper.expectCopyButtonVisible();
  await agent.prompt.promptHelper.expectResetChatVisible();

  await agent.prompt.promptHelper.clickApplyButton();

   const jsonText = await agent.getPage
    .locator('.chat-bubble pre code')
    .last()
    .textContent();

  expect(jsonText).toBeTruthy();

  const parsed = JSON.parse(jsonText!);

   // Validate Role
  const roleValue = await agent.prompt.getRoleValue();
  expect(roleValue).toBe(parsed.role);

  // Validate Goal
  const goalValue = await agent.prompt.getGoalValue();
  expect(goalValue).toBe(parsed.goal);

  // Validate Instruction
  const instructionValue = await agent.prompt.getInstructionsValue();
  expect(instructionValue).toBe(parsed.instruction);
  // Close helper
  await agent.prompt.promptHelper.close();

  // Validate main page is visible again
  await agent.prompt.promptHelper.expectMainVisible();

});

