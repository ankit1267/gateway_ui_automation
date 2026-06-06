import { test, expect } from '../../fixtures/base.fixture';

const TESTING_AGENT = 'Pretool Variable';

test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');

});

test('Connected agent varaible passing', async ({ agents ,page}) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    const chatbot = agent.chatbot;
    await page.waitForTimeout(4000);
    // await chatbot.isCopyButtonVisible();
    
    // Go to manage variable
    await agent.prompt.openVariableManager();
    
    // Set the value of variable age as 40
    await agent.prompt.fillVariableValue(1, '40');
    
    // Close variable slider
    await agent.prompt.closeVariableManager();
    await page.waitForTimeout(5000);
    
    // await chatbot.openNewThread();
    await page.waitForTimeout(3000);
    await chatbot.sendMessage('Hi');
    
    await chatbot.waitForResponseComplete(90000);   //A2A = 2 LLM calls, needs more time
    await chatbot.expectResponse(/AGE:40/i);
    await page.waitForTimeout(20000);
});

