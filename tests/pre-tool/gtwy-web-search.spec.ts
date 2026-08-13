import { test, expect } from '../../fixtures/base.fixture';
import { disablePreTool } from '../../utils/api-cleanup';

const AGENT_NAME = process.env.AGENT_NAME!;
const GTWY_WEB_SEARCH = 'Gtwy Web Search';
const VALID_DOMAIN = 'dev.gtwy.ai';
const INVALID_DOMAIN = 'invalidurl';

test.describe('Pre-Tool - Gtwy Web Search', () => {
  let capturedVersionId: string | null = null;
  let capturedAuthHeader: string | null = null;
  let capturedAgentId: string | null = null;

  test.beforeEach(async ({ agents, page }) => {
    capturedVersionId = null;
    capturedAuthHeader = null;
    capturedAgentId = null;
    page.on('request', (req) => {
      const match = req.url().match(/\/api\/tools\/pre_tool\/([a-f0-9]+)/);
      if (match && req.method() === 'PUT') {
        try {
          const body = req.postDataJSON();
          if (body?.version_id) {
            capturedAgentId = match[1];
            capturedVersionId = body.version_id;
            capturedAuthHeader = req.headers()['authorization'] ?? null;
          }
        } catch {
        }
      }
    });
    await agents.goto('api');
  });

  test.afterEach(async ({ page }) => {
    await disablePreTool(page, capturedAgentId ?? '', capturedVersionId ?? '', 'gtwy_web_search', capturedAuthHeader);
    capturedVersionId = null;
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
    await agent.prompt.closeWebSearchConfigModalIfVisible();
  });

  test('TC-PRETOOL-GWS-03: Entering an invalid URL keeps the Save button disabled', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(GTWY_WEB_SEARCH);
    await agent.prompt.queryRefinerConfigModal.waitForVisible();
    await agent.prompt.fillWebSearchUrl(INVALID_DOMAIN);
    await agent.prompt.queryRefinerConfigModal.isSaveButtonDisabled();
    await agent.prompt.closeWebSearchConfigModalIfVisible();
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

  test('TC-PRETOOL-GWS-05: Gtwy Web Search pre-tool persists after switching tabs and returning', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();

    const preToolApiPromise = page.waitForResponse(
      res => res.url().includes('/api/tools/pre_tool/') && res.request().method() === 'PUT' && res.status() === 200,
      { timeout: 15000 }
    );
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(GTWY_WEB_SEARCH);
    await preToolApiPromise;

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

  test('TC-PRETOOL-GWS-07: Adding and then deleting the Gtwy Web Search pre-tool removes it', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(GTWY_WEB_SEARCH);
    await agent.prompt.closeWebSearchConfigModalIfVisible();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.prompt.expectPreToolAddedByName(GTWY_WEB_SEARCH);
    await agent.prompt.deletePreTool();
    await agent.prompt.expectPreToolContainerVisible();
  });

});
