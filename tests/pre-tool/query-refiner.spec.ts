import { test, expect } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;
const QUERY_REFINER = 'Query Refiner';

test.describe.serial('Pre-Tool - Query Refiner', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test.afterEach(async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.deletePreTool();
    await agent.prompt.expectPreToolContainerNotVisible();
  });

  test('TC-PRETOOL-QR-01: Selecting Query Refiner opens the config modal and verify its visibility', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(QUERY_REFINER);
    await agent.prompt.isQueryRefinerConfigModalVisible();
    await agent.prompt.closeQueryRefinerConfigModalIfVisible();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.prompt.expectPreToolAddedByName(QUERY_REFINER);
  });

  test('TC-PRETOOL-QR-02: Re-opening the config modal from the pre-tool card reopens it', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(QUERY_REFINER);
    await agent.prompt.closeQueryRefinerConfigModalIfVisible();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.prompt.openPreToolConfig();
    await agent.prompt.queryRefinerConfigModal.waitForVisible();
    await agent.prompt.closeQueryRefinerConfigModalIfVisible();
  });

  test('TC-PRETOOL-QR-03: Config modal Save button is disabled when no changes are made', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(QUERY_REFINER);
    await agent.prompt.queryRefinerConfigModal.waitForVisible();
    await agent.prompt.queryRefinerConfigModal.isSaveButtonDisabled();
  });

  test('TC-PRETOOL-QR-04: Query Refiner pre-tool persists after switching tabs and returning', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(QUERY_REFINER);
    await agent.prompt.closeQueryRefinerConfigModalIfVisible();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.tabs.openModel();
    await agent.tabs.openPrompt();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.prompt.expectPreToolAddedByName(QUERY_REFINER);
  });

    test('TC-PRETOOL-QR-05: Entering text in the Refinement Prompt textarea enables the Save button', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(QUERY_REFINER);
    await agent.prompt.queryRefinerConfigModal.waitForVisible();
    await agent.prompt.queryRefinerConfigModal.isSaveButtonDisabled();
    await agent.prompt.fillQueryRefinerPrompt('Rewrite the user query to be more precise and search-engine friendly.');
    await agent.prompt.expectQueryRefinerSaveButtonEnabled();
    await agent.prompt.queryRefinerConfigModal.clickSave();
  });

});
