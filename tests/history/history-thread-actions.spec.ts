import { test, expect } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('History - API Agent Thread Actions', () => {
  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-HISTORY-08: Click and close all thread action buttons', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.openHistory();

    await agent.history.openFirstSidebarThread();
    await agent.history.expectThreadResponseVisible();

    // ... setup ...
 
  // AI Config - This one DOES open a modal/slider in some views
  await agent.history.clickAiConfig();
  await agent.history.expectChatDetailsViewModalVisible(); 
  await agent.history.closeChatDetailsModal();
  
  // The action bar no longer has a Variables button (COPY, AI CONFIG, LATENCY, SYSTEM PROMPT, MORE),
  // so MORE takes its place as the inline toggle.
  await agent.history.clickMore();
  await agent.history.expectInlineMoreDetailsVisible();
  await agent.history.clickMore(); // Close

  // System Prompt - Now Inline
  await agent.history.clickSystemPrompt();
  await agent.history.clickSystemPrompt(); // Close


  await agent.history.clicklatency();
  await agent.history.expectChatDetailsViewModalVisible(); 
  await agent.history.closeChatDetailsModal();

  });
});
