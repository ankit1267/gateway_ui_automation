import { test } from '../../../fixtures/base.fixture';

test('open and close prompt helper', async ({ agents }) => {

  await agents.goto('api');

  const agent = await agents.openAgent(process.env.AGENT_NAME!);

  // Open helper from instructions field
  await agent.prompt.promptHelper.open();

  // Validate helper UI
  await agent.prompt.promptHelper.expectVisible();
  await agent.prompt.promptHelper.expectTipTapEditorVisible();

  // Close helper
  await agent.prompt.promptHelper.close();

  // Validate main page is visible again
  await agent.prompt.promptHelper.expectMainVisible();

});