import { test } from '../../../fixtures/base.fixture';
import { openAgentAndAssertApi } from '../../../utils/agent-api';

const TESTING_AGENT_NAME = process.env.TESTING_AGENT!;
const AGENT_RESULT = "ChildAgent"

test.describe('Connectors - Agent Search - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-CON-AGENT-01: Search for agent in Add Agent dropdown shows result', async ({ agents, page }) => {
    const agent = await openAgentAndAssertApi(agents, page, TESTING_AGENT_NAME);

    await agent.tabs.openConnectors();
    await agent.connectors.clickAddAgent();
    await agent.connectors.a2aDropdown.expectVisible();
    await agent.connectors.a2aDropdown.search(AGENT_RESULT);
    await agent.connectors.a2aDropdown.expectItemVisible(AGENT_RESULT);
  });

  test('TC-CON-AGENT-02: Search with spaced query in Add Agent dropdown shows matching result', async ({ agents, page }) => {
    const agent = await openAgentAndAssertApi(agents, page, TESTING_AGENT_NAME);

    await agent.tabs.openConnectors();
    await agent.connectors.clickAddAgent();
    await agent.connectors.a2aDropdown.expectVisible();
    await agent.connectors.a2aDropdown.search(AGENT_RESULT + '   '); // spaced text
    await agent.connectors.a2aDropdown.expectItemVisible(AGENT_RESULT);
  });

});
