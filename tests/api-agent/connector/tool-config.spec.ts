import { test } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;
const TOOL_NAME = 'factorial_of_a_numbe...';

test.describe('Connectors - Tool Config - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test.afterEach(async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.removeEmbedToolIfExists();
  });

  test('TC-CON-TOOL-CONFIG-01: Add tool, open settings, switch to advanced mode, verify old data toggle is visible', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();

    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.selectTool(TOOL_NAME);

    await agent.connectors.openEmbedToolConfig();
    await agent.connectors.toolConfigModal.waitForVisible();

    await agent.connectors.toolConfigModal.selectAdvancedMode();

    await agent.connectors.toolConfigModal.expectOldDataCheckboxVisible();
    await agent.connectors.toolConfigModal.checkOldData();
    await agent.connectors.toolConfigModal.expectBothTextareasVisible();

    await agent.connectors.toolConfigModal.close();
  });

  test('TC-CON-TOOL-CONFIG-02: Open tool settings, click Name & Description, verify name input and description are visible', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();

    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.selectTool(TOOL_NAME);

    await agent.connectors.openEmbedToolConfig();
    await agent.connectors.toolConfigModal.waitForVisible();

    await agent.connectors.toolConfigModal.clickNameDescToggle();
    await agent.connectors.toolConfigModal.expectNameAndDescriptionVisible();

    await agent.connectors.toolConfigModal.close();
  });

});
