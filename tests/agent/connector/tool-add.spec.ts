import { test, expect } from '../../../fixtures/base.fixture';

/**
 * Connectors - Tool Add (API Agent)
 *
 * Verifies adding/removing a ViaSocket tool from the Connectors tab.
 * - Adds tool via dropdown, validates PUT /api/versions/ response contains the tool.
 * - Removes tool, validates API response no longer contains it.
 * - Cleans up leftover tools from prior failed runs before each attempt.
 */

const AGENT_NAME = process.env.TESTING_AGENT!;
const TOOL_NAME = 'SendEmailonGmail2';
const FUNCTION_ID = '698aedbf0acf612c862d6f85';

const VERSION_API = /\/api\/versions\/[a-f0-9]+/;

test.describe('Connectors - Tool Add - API Agent', () => {
  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('Tool renders + API validation', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openConnectors();

    // Clean up leftover tool from a previously failed run
    await agent.connectors.removeEmbedToolIfExists();

    // Open dropdown first, THEN set up listener + select in parallel
    await agent.connectors.clickAddTool();

    const [response] = await Promise.all([
      page.waitForResponse(
        resp =>
          VERSION_API.test(resp.url()) &&
          resp.request().method() === 'PUT' &&
          resp.status() === 200
      ),
      agent.connectors.toolDropdown.selectTool(TOOL_NAME),
    ]);

    // const json = await response.json();

    // const toolExists = Object.values(json.agent.apiCalls || {}).some(
    //   (call: any) => call.title === TOOL_NAME
    // );


    const addJson = await response.json();
    expect(addJson.agent.function_ids).toContain(FUNCTION_ID);
    await agent.connectors.expectEmbedVisible(TOOL_NAME);


    // expect(toolExists).toBe(true);
    await agent.connectors.expectEmbedVisible(TOOL_NAME);

    const [removeResponse] = await Promise.all([
      page.waitForResponse(
        resp =>
          VERSION_API.test(resp.url()) &&
          resp.request().method() === 'PUT' &&
          resp.status() === 200
      ),
      agent.connectors.removeTool(),
    ]);

    const removeJson = await removeResponse.json();

    // const toolStillExists = Object.values(removeJson.agent.apiCalls || {}).some(
    //   (call: any) => call.title === TOOL_NAME
    // );

    // expect(toolStillExists).toBe(false);
    
    expect(removeJson.agent.function_ids).not.toContain(FUNCTION_ID);
  });
});