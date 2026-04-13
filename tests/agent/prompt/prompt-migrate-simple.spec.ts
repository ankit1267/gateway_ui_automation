import { test } from '../../../fixtures/base.fixture';

test('verify migrate button visible in old agent', async ({ agents }) => {

  await agents.goto('chatbot');

  // Open old agent
  const oldAgent = await agents.openAgent('for testing the old agent');
  await oldAgent.prompt.expectMigrateButtonVisible();

});