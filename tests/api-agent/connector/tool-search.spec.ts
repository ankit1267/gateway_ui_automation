import { test } from '../../../fixtures/base.fixture';

const AGENT_ID = process.env.TESTING_AGENT_ID!;
const TOOL_RESULT = 'Gtwy web search';

test.describe('Connectors - Tool Search - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-CON-TOOL-01: Search for tool in Add Tool dropdown shows result', async ({ agents }) => {
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.search('gtwy');
    await agent.connectors.toolDropdown.expectItemVisible(TOOL_RESULT);
  });

  test('TC-CON-TOOL-02: Search with spaced query in Add Tool dropdown shows matching result', async ({ agents }) => {
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.search('gtwy   '); // spaced text
    await agent.connectors.toolDropdown.expectItemVisible(TOOL_RESULT);
  });

});
