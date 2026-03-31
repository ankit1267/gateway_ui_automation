import { test, expect } from '../../../fixtures/base.fixture';

const TESTING_AGENT_NAME = process.env.TESTING_AGENT!;
const AGENT_NAME = process.env.AGENT_NAME!

test.describe('Connectors - A2A Agent Navigation - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test.afterEach(async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(TESTING_AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openConnectors();
    await agent.connectors.removeConnectedAgentIfExists(AGENT_NAME);
  });

  test('TC-CON-A2A-01: After adding connected agent, clicking on it should redirect to that agent page', async ({ agents, page }) => {
    const agent = await agents.openAgent(TESTING_AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openConnectors();

    await agent.connectors.clickAddAgent();
    await agent.connectors.a2aDropdown.expectVisible();
    await agent.connectors.a2aDropdown.search(AGENT_NAME);

    // API: selecting an agent saves it to the version via PUT /api/versions/{id}
    const [versionResponse] = await Promise.all([
      page.waitForResponse(res =>
        /\/api\/versions\/[a-f0-9]+$/.test(res.url()) &&
        res.request().method() === 'PUT' &&
        res.status() === 200
      ),
      agent.connectors.a2aDropdown.selectAgent(AGENT_NAME),
    ]);
    const versionData = await versionResponse.json();
    expect(versionData.agent).toBeDefined();
    console.log(versionData);
    await agent.connectors.expectAgentVisible(AGENT_NAME);

    // API: clicking connected agent navigates to its page — intercept GET /api/agent/{id}
    const [agentApiResponse] = await Promise.all([
      page.waitForResponse(res =>
        /\/api\/agent\/[a-f0-9]{24}$/.test(res.url()) &&
        res.request().method() === 'GET' &&
        res.status() === 200
      ),
      agent.connectors.clickConnectedAgent(AGENT_NAME),
    ]);
    const agentApiData = await agentApiResponse.json();
    console.log(agentApiData);
    // Validate UI navigates to the correct agent: name in API matches what was clicked
    expect(agentApiData.agent.name).toBe(AGENT_NAME);

    await expect(agent.getPage).toHaveURL(/\/agents\/configure\//, { timeout: 10000 });
  });

});
