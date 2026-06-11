import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = 'Publish Changes';

test.describe('Publish Modal - Changes Visibility', () => {

  test.beforeEach(async ({ page, agents }) => {
    await agents.goto('api');
  });

    /*test('TC-PUB-CHANGES-01: No changes message visible when no configuration changes made', async ({ page, agents }) => {
    test.slow();

    // -------- Open Existing Agent --------
    const agent = await agents.openAgent(AGENT_NAME);

    // -------- Do Not Make Any Configuration Changes --------
    // Just navigate to a tab without changing anything
    await agent.tabs.openModel();

    // -------- Open Publish Modal --------
    await agent.header.clickPublish();
    await agent.header.clickPublishButton();

    // -------- Verify No Changes Message is Visible --------
    await agent.header.expectPublishModalVisible();
    await agent.header.expectChangesSummaryVisible();
    await agent.header.expectNoChangesMessageVisible();

    // -------- Close Modal --------
    await agent.header.closePublishModal();
  });*/

  test('TC-PUB-CHANGES-02: Model change is visible in publish modal changes summary', async ({ page, agents }) => {
    test.slow();

    // -------- Open Existing Agent --------
    const agent = await agents.openAgent(AGENT_NAME);

    // -------- Make Configuration Change - Change Model --------
    await agent.tabs.openModel();
    const originalModel = await agent.model.getSelectedModelText();
    await agent.model.selectModel('gpt-4o-mini');
    
    // -------- Open Publish Modal --------
    await agent.header.clickPublish();
    await agent.header.clickPublishButton();

    // -------- Verify Model Change is Visible in Changes Summary --------
    await agent.header.expectPublishModalVisible();
    await agent.header.expectChangesSummaryVisible();
    await agent.header.expectChangeCardVisible('Model');

    // -------- Close Modal --------
    await agent.header.closePublishModal();

    // -------- Restore Original Model --------
    await agent.model.selectModel('gpt-5-mini');
  });

  test('TC-PUB-CHANGES-03: Prompt change is visible in publish modal changes summary', async ({ page, agents }) => {
    test.slow();

    // -------- Open Existing Agent --------
    const agent = await agents.openAgent(AGENT_NAME);

    // -------- Make Configuration Change - Change Prompt --------
    await agent.tabs.openPrompt();
    const originalPrompt = await agent.prompt.getInstructionsValue();
    await agent.prompt.fillInstructions('Updated prompt for testing publish modal changes visibility');

    // -------- Open Publish Modal --------
    await agent.header.clickPublish();
    await agent.header.clickPublishButton();

    // -------- Verify Prompt Change is Visible in Changes Summary --------
    await agent.header.expectPublishModalVisible();
    await agent.header.expectChangesSummaryVisible();
    await agent.header.expectChangeCardVisible('Prompt');

    // -------- Close Modal --------
    await agent.header.closePublishModal();

    // -------- Restore Original Prompt --------
    await agent.prompt.fillInstructions(originalPrompt);
  });



});
