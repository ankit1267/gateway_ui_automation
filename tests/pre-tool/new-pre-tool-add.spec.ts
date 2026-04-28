import { test } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test('Add a new pre-tool and delete it', async ({ agents }) => {

  // open api page
  await agents.goto('api');

  // open testing agent
  const agentPage = await agents.openAgent(AGENT_NAME);
  await agentPage.tabs.openPrompt();

  // Ensure a clean state in case a pre-tool already exists.
  if (await agentPage.prompt.hasPreTool()) {
    await agentPage.prompt.deletePreTool();
  }

  await agentPage.prompt.addPreToolClick();
  await agentPage.prompt.preToolDropdown.clickAddNewTool();

  await agentPage.prompt.waitForViaSocketContainerVisible();
  await agentPage.prompt.clickCustomLogicToolCard();
  await agentPage.prompt.clickCustomLogicCodeButton();
  await agentPage.prompt.fillCustomLogicCode('return 1');
  await agentPage.prompt.saveCustomLogicPreTool();
  const flowTitle = await agentPage.prompt.getCustomLogicFlowTitle();

  console.log("flowtitle",flowTitle)
  await agentPage.prompt.expectPreToolAddedByName(flowTitle);

  await agentPage.prompt.closeViaSocketEmbedIfOpen();
  await agentPage.prompt.deletePreTool();
});