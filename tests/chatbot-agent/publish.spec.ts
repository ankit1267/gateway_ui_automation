import { test } from '../../fixtures/base.fixture';

const AGENT_PURPOSE = 'Sales agent that can answer questions about our products and pricing.';

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

    // -------- Create New Agent --------
    await agents.clickCreateNewAgent();
    await agents.createAgentModal.fillPurpose(AGENT_PURPOSE);
    const agent = await agents.clickCreateNewAgentSubmit();

    createdAgentName = await agent.header.getAgentNameText();

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