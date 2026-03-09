import { test } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('History - API Agent Better Prompt', () => {
  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-HISTORY-05: Edit message better prompt flow with regenerate and save', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.openHistory();

    await agent.history.openFirstSidebarThread();
    await agent.history.expectThreadResponseVisible();

    await agent.history.hoverGroupChatAgentsResponse();
    await agent.history.clickEditMessageButton();
    await agent.history.expectEditMessageTextareaVisible();

    await agent.history.clickBetterPromptButton();

    await agent.history.expectPromptPreviousTextareaVisible();
    await agent.history.expectPromptUpdatedTextareaVisible();

    await agent.history.clickPromptRegenerateButton();

    await agent.history.clickPromptSaveButton();

    await agent.history.clickEditMessageCancelButton();

    await agent.history.clickEditMessageButton();

    await agent.history.expectShowGeneratedButtonVisible();
  });

  test('TC-HISTORY-06: Add test case modal form validation and create with cosine strategy', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.openHistory();

    await agent.history.openFirstSidebarThread();
    await agent.history.expectThreadResponseVisible();

    await agent.history.hoverGroupChatAgentsResponse();
    await agent.history.clickAddTestCaseButton();

    await agent.history.expectAddTestCaseSecondLastRemoveToolVisible();
    await agent.history.expectAddTestCaseExpectedContentTextareaVisible();
    await agent.history.expectAddTestCaseCloseXButtonVisible();
    await agent.history.expectAddTestCaseCreateButtonVisible();
    await agent.history.expectAddTestCaseCancelButtonVisible();

    await agent.history.selectAddTestCaseMatchingStrategy('cosine');

    await agent.history.clickAddTestCaseCreateButton();

    await agent.history.expectTestCaseCreatedToastVisible();
  });

  test('TC-HISTORY-07: Debug agent button opens iframe container', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.openHistory();

    await agent.history.openFirstSidebarThread();
    await agent.history.expectThreadResponseVisible();

    await agent.history.hoverGroupChatAgentsResponse();
    await agent.history.clickDebugAgentButton();

    await agent.history.expectIframeParentContainerVisible();
  });
});
