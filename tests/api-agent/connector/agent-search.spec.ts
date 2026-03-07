import { test } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;
const AGENT_RESULT = process.env.AGENT_NAME!;

test.describe('Connectors - Agent Search - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-CON-AGENT-01: Search for agent in Add Agent dropdown shows result', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAddAgent();
    await agent.connectors.a2aDropdown.expectVisible();
    await agent.connectors.a2aDropdown.search(AGENT_RESULT);
    await agent.connectors.a2aDropdown.expectItemVisible(AGENT_RESULT);
  });

  test('TC-CON-AGENT-02: Search with spaced query in Add Agent dropdown shows matching result', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAddAgent();
    await agent.connectors.a2aDropdown.expectVisible();
    await agent.connectors.a2aDropdown.search(AGENT_RESULT + '   '); // spaced text
    await agent.connectors.a2aDropdown.expectItemVisible(AGENT_RESULT);
  });

});
