import { test } from '../../fixtures/base.fixture';

const AGENT_ID = process.env.AGENT_ID!;

test.describe('History - API Agent Thread Actions', () => {
  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-HISTORY-08: Click and close all thread action buttons', async ({ agents }) => {
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.header.openHistory();

    await agent.history.openFirstSidebarThread();
    await agent.history.expectThreadResponseVisible();

    // Visualize
    await agent.history.clickVisualizeButton();

    // AI Config
    await agent.history.clickAiConfig();
    await agent.history.expectChatDetailsSliderVisible();
    await agent.history.closeChatDetails();

    // Variables
    await agent.history.openThreadItemVar();
    await agent.history.expectChatDetailsSliderVisible();
    await agent.history.closeChatDetails();

    // System Prompt
    await agent.history.clickSystemPrompt();
    await agent.history.expectChatDetailsSliderVisible();
    await agent.history.closeChatDetails();

    // More (check AiConfig, latency, variables values)
    await agent.history.clickMore();
    await agent.history.expectChatDetailsSliderVisible();
    await agent.history.expectChatDetailsAiConfigValueVisible();
    await agent.history.expectChatDetailsLatencyValueVisible();
    await agent.history.expectChatDetailsVariablesValueVisible();
    await agent.history.closeChatDetails();
  });
});
