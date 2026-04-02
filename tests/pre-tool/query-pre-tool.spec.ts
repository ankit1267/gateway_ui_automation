import { test, expect } from '../../fixtures/base.fixture';


test('Query chatbot and check pre-tool is called', async ({ agents , page}) => {
    await agents.goto('chatbot');
    const agent = await agents.openAgent('Chatbot');
    await agent.tabs.openPrompt();
    await page.waitForTimeout(5000);
    const chatbot = agent.chatbot;
    await chatbot.isCopyButtonVisible();
    await chatbot.openNewThread();
    await page.waitForTimeout(2000);
    await chatbot.isHomeVisible()
    await page.waitForTimeout(2000);
    await chatbot.sendMessage('What is 1+1?');
    await chatbot.expectResponse(/2/);
    await page.waitForTimeout(2000);
    await agent.header.openHistory();
    await page.waitForTimeout(5000);
    await agent.history.waitForJustNowVisible();
    await agent.history.openThreadItemVar();
    await agent.history.verifyPreFunctionVisible();
    await agent.history.verifyPreToolVariableVisible(/"user_query"\s*:\s*"What is 1\+1\?"/);
    await agent.history.verifyPreToolVariableVisible(/"answer_style"\s*:\s*"DIRECT_ANSWER"/);
});