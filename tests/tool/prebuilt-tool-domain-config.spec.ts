import { test } from '../../fixtures/base.fixture';

const AGENT = process.env.AGENT_NAME!;
const TOOL_NAME = 'Gtwy web search';
const TOOL_KEY = 'Gtwy_Web_Search';
const DOMAIN = 'dev.gtwy.ai';

test.describe('Tool - Prebuilt Tool Domain Config', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-TOOL-02: Configure domain for Gtwy web search prebuilt tool and delete it', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.selectTool(TOOL_NAME);
    await agent.connectors.clickPrebuiltToolConfig(TOOL_KEY);
    await agent.connectors.prebuiltToolsConfigModal.addDomain(DOMAIN);
    await agent.connectors.prebuiltToolsConfigModal.close();
    await agent.connectors.deletePrebuiltTool(TOOL_KEY);
    await agent.connectors.confirmDeletePrebuiltTool();
  });

});
