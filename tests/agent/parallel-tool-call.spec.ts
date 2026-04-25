import { test, expect } from '../../fixtures/base.fixture';

const TESTING_AGENT = 'Parallel tool calls';

test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');

});

test('parallel tool call', async ({ agents ,page}) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    const chatbot = agent.chatbot;
    await page.waitForTimeout(4000);
    await chatbot.isCopyButtonVisible();
    await chatbot.openNewThread();
    await page.waitForTimeout(3000);
    await chatbot.sendMessage('calculate compute_secure_function and secure_math_function and factorial_function and calculate_square for the value 5');
    
    await chatbot.waitForResponseComplete(90000);   // Parallel tool calls = multiple LLM calls, needs more time
    await chatbot.expectResponse(/compute_secure_function|secure_math_function|factorial_function|calculate_square/i);
    await page.waitForTimeout(20000);
});
