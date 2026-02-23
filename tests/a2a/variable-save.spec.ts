import { test, expect } from '../../fixtures/base.fixture';

const TESTING_AGENT = 'Parental Guidance';

test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
});

test('add varaible new0 and delete it', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);

    // Open connectors tab
    await agent.tabs.openConnectors();

    // Open connected agent config
    await agent.connectors.clickAgentConfig();

    // Add parameter and save
    const modal = agent.connectors.variableModal;
    await modal.addParameter();
    await modal.save();

    // Reopen config so UI refreshes
    await agent.connectors.clickAgentConfig();

    // Assert input exists and has value "new0"
    const paramInput = modal.getParameterNameInput('new0');
    await expect(paramInput).toBeVisible();
    await expect(paramInput).toHaveValue('new0');

    // Delete parameter and save
    await modal.deleteParameter('new0');
    await modal.save();
});
