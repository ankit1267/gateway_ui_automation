import { test } from '../../../fixtures/base.fixture';
import { removeToolFromVersion } from '../../../utils/api-cleanup';

const AGENT_NAME = process.env.AGENT_NAME!;
const TOOL_NAME = 'SendEmailonGmail2';
const TOOL_FUNCTION_NAME = 'scrimWUa7IKw';

test.describe('Connectors - Tool Add - API Agent', () => {
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

  test('Tool renders inside embed container after selection', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openConnectors();

    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.selectTool(TOOL_NAME);

    await agent.connectors.expectEmbedVisible(TOOL_NAME);
  });
});