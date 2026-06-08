import { test, expect } from '../../fixtures/base.fixture';

const TESTING_AGENT = 'Sales Assistant A';

test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');

});

test('Connected agent varaible passing using path', async ({ agents ,page}) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    const chatbot = agent.chatbot;
    await page.waitForTimeout(4000);
   
    

    // Go to manage variable
    await agent.prompt.openVariableManager();
    
    // Set the value of variable age as 40
    await agent.prompt.fillVariableValue(0, '23');
    
    // Close variable slider
    await agent.prompt.closeVariableManager();
    await page.waitForTimeout(5000);

  
  
    await chatbot.sendMessage('Hi');
    
    
    await chatbot.waitForResponseComplete(90000);   //A2A = 2 LLM calls, needs more time
    await chatbot.expectResponse(/sales_agent_B/i);
    await page.waitForTimeout(20000);
});

test('History check that connected agent is triggered with variable age', async ({ agents,page }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.header.openHistory();
    await page.waitForTimeout(5000);
    await agent.history.openToolItem();
    await agent.history.verifyVariableVisible(/"age": "23"/);
    await agent.history.closeToolItem();

});
