import { test, expect } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;
const GTWY_WEB_SEARCH = 'Gtwy Web Search';
const VALID_DOMAIN = 'dev.gtwy.ai';
const INVALID_DOMAIN = 'invalidurl';

test.describe('Pre-Tool - Gtwy Web Search', () => {

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

  test('TC-PRETOOL-GWS-01: Selecting Gtwy Web Search opens the config modal and verifies its visibility', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(GTWY_WEB_SEARCH);
    await agent.prompt.isQueryRefinerConfigModalVisible();
    await agent.prompt.closeWebSearchConfigModalIfVisible();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.prompt.expectPreToolAddedByName(GTWY_WEB_SEARCH);
  });

  test('TC-PRETOOL-GWS-02: Save button is disabled when no URL is provided', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(GTWY_WEB_SEARCH);
    await agent.prompt.queryRefinerConfigModal.waitForVisible();
    await agent.prompt.queryRefinerConfigModal.isSaveButtonDisabled();
  });

  test('TC-PRETOOL-GWS-03: Entering an invalid URL keeps the Save button disabled', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(GTWY_WEB_SEARCH);
    await agent.prompt.queryRefinerConfigModal.waitForVisible();
    await agent.prompt.fillWebSearchUrl(INVALID_DOMAIN);
    await agent.prompt.queryRefinerConfigModal.isSaveButtonDisabled();
  });

  test('TC-PRETOOL-GWS-04: Entering a valid URL enables the Save button and saves successfully', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(GTWY_WEB_SEARCH);
    await agent.prompt.queryRefinerConfigModal.waitForVisible();
    await agent.prompt.queryRefinerConfigModal.isSaveButtonDisabled();
    await agent.prompt.fillWebSearchUrl(VALID_DOMAIN);
    await agent.prompt.expectWebSearchSaveButtonEnabled();
    await agent.prompt.queryRefinerConfigModal.clickSave();
  });

  test('TC-PRETOOL-GWS-05: Gtwy Web Search pre-tool persists after switching tabs and returning', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(GTWY_WEB_SEARCH);
    await agent.prompt.closeWebSearchConfigModalIfVisible();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.tabs.openModel();
    await agent.tabs.openPrompt();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.prompt.expectPreToolAddedByName(GTWY_WEB_SEARCH);
  });

  test('TC-PRETOOL-GWS-06: Re-opening the config modal from the pre-tool card reopens it', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(GTWY_WEB_SEARCH);
    await agent.prompt.closeWebSearchConfigModalIfVisible();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.prompt.openPreToolConfig();
    await agent.prompt.queryRefinerConfigModal.waitForVisible();
    await agent.prompt.closeWebSearchConfigModalIfVisible();
  });

});
