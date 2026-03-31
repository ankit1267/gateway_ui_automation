import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;
const TOOL_NAME = 'SendEmailonGmail2';

test.describe('Connectors - Tool Add - API Agent', () => {
  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('Tool renders + API validation', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openConnectors();

    const responsePromise = page.waitForResponse(
      resp =>
        /\/api\/versions\/[a-f0-9]+$/.test(resp.url()) &&
        resp.request().method() === 'PUT' &&
        resp.status() === 200
    );

    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.selectTool(TOOL_NAME);

    const response = await responsePromise;
    const json = await response.json();

    const toolExists = Object.values(json.agent.apiCalls || {}).some(
      (call: any) => call.title === TOOL_NAME
    );

    expect(toolExists).toBe(true);
    await agent.connectors.expectEmbedVisible(TOOL_NAME);

    const removeResponsePromise = page.waitForResponse(
      resp =>
        /\/api\/versions\/[a-f0-9]+$/.test(resp.url()) &&
        resp.request().method() === 'PUT' &&
        resp.status() === 200
    );

    await agent.connectors.removeTool();

    const removeResponse = await removeResponsePromise;
    const removeJson = await removeResponse.json();

    const toolStillExists = Object.values(removeJson.agent.apiCalls || {}).some(
      (call: any) => call.title === TOOL_NAME
    );

    expect(toolStillExists).toBe(false);
  });
});