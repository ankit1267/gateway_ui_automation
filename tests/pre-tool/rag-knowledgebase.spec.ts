import { test, expect } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;
const RAG_KNOWLEDGEBASE = 'RAG Knowledgebase';
const KB_NAME = 'Resume';

test.describe('Pre-Tool - RAG Knowledgebase', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test.afterEach(async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.waitForPageLoad();
    await agent.prompt.deletePreTool();
    await agent.prompt.expectPreToolContainerNotVisible();
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

  test('TC-PRETOOL-RAG-04: RAG Knowledgebase pre-tool persists after switching tabs and returning', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.addPreToolClick();
    await agent.prompt.preToolDropdown.searchAndSelect(RAG_KNOWLEDGEBASE);
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

});
