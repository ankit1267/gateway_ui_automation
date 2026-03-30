import { test, expect } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test('Add a pre-tool', async ({ agents }) => {
    // open api page
    await agents.goto('api');

    // open testing agent
    const agentPage = await agents.openAgent(AGENT_NAME);
    await agentPage.tabs.openPrompt();
    await agentPage.prompt.addPreToolClick();

    // select factorial of a number
    await agentPage.prompt.preToolDropdown.selectTool('factorial_of_a_numbe...');
    await agentPage.prompt.expectPreToolContainerVisible();
    await agentPage.prompt.deletePreTool();
});