import { test, expect } from '../../fixtures/base.fixture';

const AGENT_ID = process.env.TESTING_AGENT_ID!;

test('Add a pre-tool', async ({ agents }) => {
    // open api page
    await agents.goto('api');

    // open testing agent
    const agentPage = await agents.openAgentById(AGENT_ID);
    await agentPage.tabs.openPrompt();
    await agentPage.prompt.addPreToolClick();

    // select factorial of anumber
    await agentPage.prompt.preToolDropdown.selectTool('factorial_of_a_numbe...');
    await agentPage.prompt.deletePreTool();
    
});