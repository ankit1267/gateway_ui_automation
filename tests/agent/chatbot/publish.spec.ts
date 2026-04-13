import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_PURPOSE = `Automation test agent created on ${new Date().toISOString().split('T')[0]}`;

test.describe('Publish - Chatbot Agent', () => {

  let createdAgentName: string;

  test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
  });

  test.afterEach(async ({ agents }) => {
    if (createdAgentName) {
      await agents.goto('chatbot');
      await agents.deleteAgentByName(createdAgentName);
      createdAgentName = '';
    }
  });

  test('TC-PUB-01: Publish agent successfully', async ({ agents }) => {
    test.slow();

    // -------- Create New Agent --------
    await agents.clickCreateNewAgent();
    await agents.createAgentModal.fillPurpose(AGENT_PURPOSE);
    const agent = await agents.clickCreateNewAgentSubmit();

    await (await agent.header.getAgentName()).waitFor({ state: 'visible', timeout: 40000 });

    createdAgentName = await agent.header.getAgentNameText();

    await agent.tabs.openModel();
    await agent.model.selectModel('gpt-5-nano');
    // -------- Publish Agent --------
    await agent.header.clickPublish();
    await agent.header.clickPublishButton();

    await agent.header.checkPublishVersionCheckbox();
    await agent.header.clickGenerateSummary();
    await agent.header.clickSaveSummary();
    await agent.header.expectSummarySaveDisabled();

    await agent.header.clickConfirmPublish();

    // -------- Assertion --------
    await agent.header.expectPublishSuccessToast();
  });

});