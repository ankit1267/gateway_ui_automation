import { test, expect } from '../../fixtures/base.fixture';

const TESTING_AGENT = 'Parental Guidance';

test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');

});

test('child agent is triggered', async ({ agents ,page}) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    const chatbot = agent.chatbot;
    await page.waitForTimeout(4000);
    await chatbot.sendMessage('My name is tilakraj');
    await chatbot.waitForResponseComplete(90000);   // A2A = 2 LLM calls, needs more time
    await chatbot.expectResponse(/welcome|hello|Wecome/i);
    await page.waitForTimeout(20000);
});

test('child agent is triggered with variable', async ({ agents,page }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.header.openHistory();
    await page.waitForTimeout(5000);

    // this can be use when data test id is added by lavish
    // await agent.history.openToolItem();
    // await agent.history.verifyVariableVisible(/tilakraj/);
    // await agent.history.closeToolItem();

});
