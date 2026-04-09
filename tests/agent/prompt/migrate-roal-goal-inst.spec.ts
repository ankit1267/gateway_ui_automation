import { expect, test } from '../../../fixtures/base.fixture';

test('migrate modal validation', async ({ agents }) => {

  await agents.goto('chatbot');

  // Open old agent
  const oldAgent = await agents.openAgent('for testing the old agent');

  await oldAgent.prompt.openMigrateModal();
  await oldAgent.prompt.expectMigrateModalFieldsVisible();

});