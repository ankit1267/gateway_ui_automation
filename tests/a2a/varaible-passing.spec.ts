import { test, expect } from '../../fixtures/base.fixture';

const TESTING_AGENT = 'Sales Assistant A';

test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');

});

test('Coonected agnet varaible passing', async ({ agents ,page}) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    const chatbot = agent.chatbot;
    await page.waitForTimeout(4000);
    await chatbot.isCopyButtonVisible();
    await chatbot.openNewThread();
    await page.waitForTimeout(3000);
    await chatbot.sendMessage('Hi');
    
    await chatbot.waitForResponseComplete(90000);   //A2A = 2 LLM calls, needs more time
    await chatbot.expectResponse(/sales_agent_B/i);
    await page.waitForTimeout(20000);
});

test('child agent is triggered with variable', async ({ agents,page }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.header.openHistory();
    await page.waitForTimeout(5000);
    await agent.history.openToolItem();
    await agent.history.verifyVariableVisible(/"age": "23"/);
    await agent.history.closeToolItem();

});
