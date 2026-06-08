import { test } from '../../../fixtures/base.fixture';
import { removeToolFromVersion } from '../../../utils/api-cleanup';

const AGENT_NAME = process.env.TESTING_AGENT!;
const TOOL_NAME = 'factorial_of_a_numbe...';
const TOOL_FUNCTION_NAME = 'scriXdRc4gP6';

test.describe('Connectors - Tool Config - API Agent', () => {
  let capturedVersionId: string | null = null;
  let capturedFunctionId: string | null = null;
  let capturedAuthHeader: string | null = null;

  test.beforeEach(async ({ agents, page }) => {
    capturedVersionId = null;
    capturedFunctionId = null;
    capturedAuthHeader = null;
    page.on('request', (req) => {
      const match = req.url().match(/\/api\/versions\/([a-f0-9]+)/);
      if (match && req.method() === 'PUT') {
        try {
          const body = req.postDataJSON();
          if (body?.functionData?.function_operation === '1') {
            capturedVersionId = match[1];
            capturedFunctionId = body.functionData.function_id;
            capturedAuthHeader = req.headers()['authorization'] ?? null;
          }
        } catch {
        }
      }
    });
    await agents.goto('api');
  });

  test.afterEach(async ({ page }) => {
    await removeToolFromVersion(page, capturedVersionId ?? '', capturedFunctionId ?? '', TOOL_FUNCTION_NAME, capturedAuthHeader);
    capturedVersionId = null;
  });

  test('TC-CON-TOOL-CONFIG-01: Add tool, open settings, switch to advanced mode, verify old data toggle is visible', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
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
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openConnectors();
   
    await agent.connectors.openEmbedToolConfig();
    await agent.connectors.toolConfigModal.waitForVisible();

    await agent.connectors.toolConfigModal.clickNameDescToggle();
    await agent.connectors.toolConfigModal.expectNameAndDescriptionVisible();

    await agent.connectors.toolConfigModal.close();
  });

});
