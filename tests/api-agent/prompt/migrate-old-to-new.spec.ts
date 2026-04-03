import { expect, test } from '../../../fixtures/base.fixture';

test('migrated values should match structured fields', async ({ agents ,page}) => {

  await agents.goto('chatbot');
  const oldAgent = await agents.openAgent('for testing the old agent');
  await oldAgent.prompt.openMigrateModal();



  await oldAgent.prompt.fillMigrateRole('chatbot');
  await oldAgent.prompt.fillMigrateGoal('reply with greeting');
  await oldAgent.prompt.fillMigrateInstructions('polite');

  // Capture values from modal
  const expectedRole = await oldAgent.prompt.getMigrateRoleValue();
  const expectedGoal = await oldAgent.prompt.getMigrateGoalValue();
  const expectedInstruction = await oldAgent.prompt.getMigrateInstructionsValue();

  await oldAgent.prompt.clickMigrateAndSaveButton();

  // Validate main prompt fields
  const roleValue = await oldAgent.prompt.getRoleValue();
  expect(roleValue).toBe(expectedRole);

  

  const goalValue = await oldAgent.prompt.getGoalValue();
  expect(goalValue).toBe(expectedGoal);

  const instructionValue = await oldAgent.prompt.getInstructionsValue();
  expect(instructionValue).toBe(expectedInstruction);

  await oldAgent.getPage.waitForTimeout(3000);
  await oldAgent.header.clickPublish();
  await oldAgent.header.clickRevertButton();
  await oldAgent.header.clickDiscardChangesButton();
  await page.waitForTimeout(2000);



});