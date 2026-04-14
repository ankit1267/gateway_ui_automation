import { test, expect } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test('Add a pre-tool and delete it', async ({ agents, page }) => {
    // open api page
    await agents.goto('api');

    // open testing agent
    const agentPage = await agents.openAgent(AGENT_NAME);
    await agentPage.tabs.openPrompt();

    // Retry the full add-pre-tool flow until the tool is actually added.
    // Covers flaky dropdown closures, missed clicks, and slow renders.
    await expect(async () => {
      await agentPage.prompt.addPreToolClick();
      await agentPage.prompt.preToolDropdown.selectTool('secure_math_function');
      await agentPage.prompt.expectPreToolContainerVisible();
    }).toPass({ timeout: 30_000 });
    
    await page.waitForTimeout(2000);
    await agentPage.prompt.deletePreTool();
    await page.waitForTimeout(2000);
});