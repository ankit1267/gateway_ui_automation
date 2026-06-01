import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;
const TOOL_RESULT = 'GTWY Web Search';

test.describe('Connectors - Tool Search - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-CON-TOOL-01: Search for tool in Add Tool dropdown shows result', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Openai');

    // API: selecting a model auto-saves via PUT /api/versions/{id} — validate the version was updated
    const [versionResponse] = await Promise.all([
      page.waitForResponse(res =>
        /\/api\/versions\/[a-f0-9]+$/.test(res.url()) &&
        res.request().method() === 'PUT' &&
        res.status() === 200
      ),
      agent.model.selectModel('gpt-4.1'),
    ]);
    const versionData = await versionResponse.json();
    expect(versionData.agent).toBeDefined();

    await agent.tabs.openConnectors();
    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.search('gtwy');
    await agent.connectors.toolDropdown.expectItemVisible(TOOL_RESULT);
  });

  test('TC-CON-TOOL-02: Search with spaced query in Add Tool dropdown shows matching result', async ({ agents, page }) => {
    // API: opening an agent triggers GET /api/versions/{id} — validate the agent version is loaded
    const [versionApiResponse, agent] = await Promise.all([
      page.waitForResponse(res =>
        /\/api\/versions\/[a-f0-9]+$/.test(res.url()) &&
        res.request().method() === 'GET' &&
        res.status() === 200
      ),
      agents.openAgent(AGENT_NAME),
    ]);
    const versionApiData = await versionApiResponse.json();
    expect(versionApiData.agent).toBeDefined();

    await agent.tabs.openConnectors();
    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.search('gtwy   '); // spaced text
    await agent.connectors.toolDropdown.expectItemVisible(TOOL_RESULT);
  });

});
