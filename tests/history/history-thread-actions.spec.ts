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
  
  // Variables - Now Inline
  await agent.history.openThreadItemVar();
  // await agent.history.expectInlineVariablesVisible(); // Custom assertion for inline
  await agent.history.openThreadItemVar(); // Click again to close
 
  // System Prompt - Now Inline
  await agent.history.clickSystemPrompt();
  await agent.history.clickSystemPrompt(); // Close
  
  // More - Now Inline
  await agent.history.clickMore();
  await agent.history.expectInlineMoreDetailsVisible();
  await agent.history.clickMore(); // Close


  await agent.history.clicklatency();
  await agent.history.expectChatDetailsViewModalVisible(); 
  await agent.history.closeChatDetailsModal();

  });
});
