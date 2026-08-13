import { test, expect } from '../../fixtures/base.fixture';
import { disablePreTool } from '../../utils/api-cleanup';

const AGENT_NAME = process.env.AGENT_NAME!;
const RAG_KNOWLEDGEBASE = 'RAG Knowledgebase';
const KB_NAME = 'Resume';

test.describe('Pre-Tool - RAG Knowledgebase', () => {
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
    await disablePreTool(page, capturedAgentId ?? '', capturedVersionId ?? '', 'rag_knowledgebase', capturedAuthHeader);
    capturedVersionId = null;
  });

  test('TC-PRETOOL-RAG-01: Selecting RAG Knowledgebase opens the config modal and verifies its visibility', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(RAG_KNOWLEDGEBASE);
    await agent.prompt.isQueryRefinerConfigModalVisible();
    await agent.prompt.closeRagConfigModalIfVisible();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.prompt.expectPreToolAddedByName(RAG_KNOWLEDGEBASE);
  });

  test('TC-PRETOOL-RAG-02: Save button is disabled when no knowledge base is selected', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(RAG_KNOWLEDGEBASE);
    await agent.prompt.queryRefinerConfigModal.waitForVisible();
    await agent.prompt.queryRefinerConfigModal.isSaveButtonDisabled();
    await agent.prompt.closeRagConfigModalIfVisible();
  });

  test('TC-PRETOOL-RAG-03: Selecting a knowledge base enables the Save button and saves successfully', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(RAG_KNOWLEDGEBASE);
    await agent.prompt.queryRefinerConfigModal.waitForVisible();
    await agent.prompt.queryRefinerConfigModal.isSaveButtonDisabled();
    await agent.prompt.searchAndSelectKnowledgeBase(KB_NAME);
    await agent.prompt.expectKnowledgeBaseSelected(KB_NAME);
    await agent.prompt.expectRagSaveButtonEnabled();
    await agent.prompt.queryRefinerConfigModal.clickSave();
  });

  test('TC-PRETOOL-RAG-04: RAG Knowledgebase pre-tool persists after switching tabs and returning', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();

    const preToolApiPromise = page.waitForResponse(
      res => res.url().includes('/api/tools/pre_tool/') && res.request().method() === 'PUT' && res.status() === 200,
      { timeout: 15000 }
    );
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(RAG_KNOWLEDGEBASE);
    await preToolApiPromise;

    await agent.prompt.closeRagConfigModalIfVisible();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.tabs.openModel();
    await agent.tabs.openPrompt();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.prompt.expectPreToolAddedByName(RAG_KNOWLEDGEBASE);
  });

  test('TC-PRETOOL-RAG-05: Re-opening the config modal from the pre-tool card reopens it', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(RAG_KNOWLEDGEBASE);
    await agent.prompt.closeRagConfigModalIfVisible();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.prompt.openPreToolConfig();
    await agent.prompt.queryRefinerConfigModal.waitForVisible();
    await agent.prompt.closeRagConfigModalIfVisible();
  });

  test('TC-PRETOOL-RAG-06: Adding and then deleting the RAG Knowledgebase pre-tool removes it', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(RAG_KNOWLEDGEBASE);
    await agent.prompt.closeRagConfigModalIfVisible();
    await agent.prompt.expectPreToolContainerVisible();
    await agent.prompt.expectPreToolAddedByName(RAG_KNOWLEDGEBASE);
    await agent.prompt.deletePreTool();
    await agent.prompt.expectPreToolContainerVisible();
  });

});
