import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = 'Widget create';

test.describe('Chatbot Widget', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
  });

  test('TC-CHAT-02: Create chatbot widget from chat and verify widget response is generated', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    
    await agent.chatbot.openNewThread();
    await agent.chatbot.isHomeVisible();
    await page.waitForTimeout(2000);
    await agent.chatbot.sendMessage('onboarding mail template');

    const messages = agent.chatbot.getScrollable();
    
    const generatedWidgets = messages.locator(
      'div.flex.flex-col[style*="padding: 8px"][style*="gap: 12px"]'
    );

    await agent.chatbot.waitForResponseComplete(120000);

    await expect(generatedWidgets.first()).toBeVisible({ timeout: 120000 });
  });
});
