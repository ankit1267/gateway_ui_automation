import { test } from '../../../fixtures/base.fixture';

test('verify migrate button and param modes visibility', async ({ agents }) => {

  await agents.goto('chatbot');

  // Open old agent
  const oldAgent = await agents.openAgent('for testing the old agent');
  await oldAgent.prompt.expectMigrateButtonVisible();

  await agents.goto('chatbot');
  // Open new agent
  const newAgent = await agents.openAgent('Parental Guidance');
  await newAgent.prompt.expectParamModesVisible();

});