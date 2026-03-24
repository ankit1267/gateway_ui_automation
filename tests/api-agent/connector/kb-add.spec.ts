import { test } from '../../../fixtures/base.fixture';
import { removeKBFromVersion } from '../../../utils/api-cleanup';

const AGENT_NAME = process.env.AGENT_NAME!;
const K_BASE = 'Resume';

test.describe('Connectors - KB Add - API Agent', () => {
  let capturedVersionId: string | null = null;
  let capturedOriginalDocIds: object[] | null = null;
  let capturedAuthHeader: string | null = null;

  test.beforeEach(async ({ agents, page }) => {
    capturedVersionId = null;
    capturedOriginalDocIds = null;
    capturedAuthHeader = null;
    page.on('request', (req) => {
      const match = req.url().match(/\/api\/versions\/([a-f0-9]+)/);
      if (match && req.method() === 'PUT') {
        try {
          const body = req.postDataJSON();
          if (Array.isArray(body?.doc_ids)) {
            capturedVersionId = match[1];
            capturedAuthHeader = req.headers()['authorization'] ?? null;
            capturedOriginalDocIds = body.doc_ids.filter((d: { name?: string }) => d.name !== K_BASE);
          }
        } catch {
        }
      }
    });
    await agents.goto('api');
  });

  test.afterEach(async ({ page }) => {
    await removeKBFromVersion(page, capturedVersionId ?? '', capturedOriginalDocIds ?? [], capturedAuthHeader);
    capturedVersionId = null;
  });

  test('Knowledgebase renders inside embed container after selection', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openConnectors();

    await agent.connectors.clickAddKB();
    await agent.connectors.knowledgeBaseDropdown.selectKB(K_BASE);

    await agent.connectors.expectKBVisible(K_BASE);
  });
});