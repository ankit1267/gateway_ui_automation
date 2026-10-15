import { test } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test('Add existing pre-tool and delete it', async ({ agents, page }) => {
    // open api page
    await agents.goto('api');

    // open testing agent
    const agentPage = await agents.openAgent(AGENT_NAME);
    await agentPage.tabs.openPrompt();

    // Always start clean: remove any connected pre-tool.
    await agentPage.prompt.deletePreToolIfExists();

    // Adds through the verified flow: retried as one unit, passes only once the tool's card or config modal appears.
    await agentPage.prompt.addPreToolByName('secure_math_function');
    
    await page.waitForTimeout(2000);
    await agentPage.prompt.deletePreTool();
    await page.waitForTimeout(2000);
});