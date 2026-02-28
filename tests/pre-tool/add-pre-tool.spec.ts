import { test, expect } from '../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;

test('Add a pre-tool', async ({ agents }) => {
    // open api page
    await agents.goto('api');

    // open testing agent
    const agentPage = await agents.openAgent(TESTING_AGENT);
    await agentPage.tabs.openPrompt();
    await agentPage.prompt.addPreToolClick();

    // select factorial of anumber
    await agentPage.prompt.preToolDropdown.selectTool('factorial_of_a_numbe...');
    await agentPage.prompt.deletePreTool();
    
});