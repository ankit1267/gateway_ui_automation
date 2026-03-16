import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_ID = process.env.TESTING_AGENT_ID!;
const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Connectors - A2A Agent Navigation - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test.afterEach(async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.tabs.openConnectors();
    await agent.connectors.removeConnectedAgentIfExists(AGENT_NAME);
  });

  test('TC-CON-A2A-01: After adding connected agent, clicking on it should redirect to that agent page', async ({ agents }) => {
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.tabs.openConnectors();

    await agent.connectors.clickAddAgent();
    await agent.connectors.a2aDropdown.expectVisible();
    await agent.connectors.a2aDropdown.search(AGENT_NAME);
    await agent.connectors.a2aDropdown.selectAgent(AGENT_NAME);

    await agent.connectors.expectAgentVisible(AGENT_NAME);

    await agent.connectors.clickConnectedAgent(AGENT_NAME);

    await expect(agent.getPage).toHaveURL(/\/agents\/configure\//, { timeout: 10000 });
  });

});
