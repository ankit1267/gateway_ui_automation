import { test } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('History - API Agent Thread Actions', () => {
  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-HISTORY-08: Click and close all thread action buttons', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.openHistory();

    await agent.history.openFirstSidebarThread();
    await agent.history.expectThreadResponseVisible();

    // Visualize
    await agent.history.clickVisualizeButton();
    await agent.history.closeVisualize();
    await agent.history.expectThreadResponseVisible();

    // AI Config (opens detail view modal)
    await agent.history.clickAiConfig();
    await agent.history.expectChatDetailsModalVisible();
    await agent.history.closeChatDetailsModal();

    // Variables (opens detail view modal)
    await agent.history.openThreadItemVar();
    await agent.history.expectChatDetailsModalVisible();
    await agent.history.closeChatDetailsModal();

    // System Prompt (opens slider)
    await agent.history.clickSystemPrompt();
    await agent.history.expectChatDetailsSliderVisible();
    await agent.history.closeChatDetails();

    // More (opens slider with AiConfig, latency, variables values)
    await agent.history.clickMore();
    await agent.history.expectChatDetailsSliderVisible();
    await agent.history.expectChatDetailsAiConfigValueVisible();
    await agent.history.expectChatDetailsLatencyValueVisible();
    await agent.history.expectChatDetailsVariablesValueVisible();
    await agent.history.closeChatDetails();
  });
});
