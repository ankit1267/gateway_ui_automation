import { test, expect } from '../../../fixtures/base.fixture';
import { captureAgentIdFromUrl, deleteAgentApiWithToken } from '../../../utils/api-cleanup';

const AGENT_PURPOSE = `Automation test agent created on ${new Date().toISOString().split('T')[0]}`;

test.describe('Publish - Chatbot Agent', () => {

  let createdAgentName: string;
  let createdAgentId: string;

  test.beforeEach(async ({ page, agents }) => {
    await agents.goto('chatbot');
  });

  test.afterEach(async ({ page, agents }) => {
    if (createdAgentId) {
      await deleteAgentApiWithToken(page, createdAgentId);
      createdAgentId = '';
      createdAgentName = '';
    }
  });

  test('TC-PUB-01: Publish agent successfully', async ({ page, agents }) => {
    test.slow();

    // -------- Create New Agent --------
    await agents.clickCreateNewAgent();
    await agents.createAgentModal.fillPurpose(AGENT_PURPOSE);
    const agent = await agents.clickCreateNewAgentSubmit();

    await (await agent.header.getAgentName()).waitFor({ state: 'visible', timeout: 40000 });

    createdAgentName = await agent.header.getAgentNameText();
    createdAgentId = captureAgentIdFromUrl(page);
    //console.log(`Created agent ID: ${createdAgentId}`);
    await agent.tabs.openModel();
    await agent.model.selectModel('gpt-5-nano');
    // -------- Publish Agent --------
    await agent.header.clickPublish();
    await agent.header.clickPublishButton();

    // await agent.header.checkPublishVersionCheckbox();
    // await agent.header.clickGenerateSummary();
    // await agent.header.clickSaveSummary();
    // await agent.header.expectSummarySaveDisabled();

    await agent.header.clickConfirmPublish();

    // -------- Assertion --------
    await agent.header.expectPublishSuccessToast();
  });

});