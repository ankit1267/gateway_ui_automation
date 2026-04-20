import { test } from '../../../fixtures/base.fixture';
import { deleteKnowledgeBaseResource } from '../../../utils/api-cleanup';

const AGENT_NAME = process.env.TESTING_AGENT!;
const KB_NAME = 'Wikipedia';

test.describe('Connectors - Create New KB Added - API Agent', () => {
  let capturedResourceId: string | null = null;
  let capturedAuthHeader: string | null = null;

  test.beforeEach(async ({ agents, page }) => {
    capturedResourceId = null;
    capturedAuthHeader = null;

    await page.route('**/api/rag/resource', async (route) => {
      try {
        if (route.request().method() === 'POST') {
          const response = await route.fetch();
          try {
            const body = await response.json();
            if (body?.data?._id) {
              capturedResourceId = body.data._id;
              capturedAuthHeader = route.request().headers()['authorization'] ?? null;
            }
          } catch {
          }
          await route.fulfill({ response });
          return;
        }

        await route.continue();
      } catch {
        // Ignore route errors during teardown/navigation races.
        // page.unrouteAll({ behavior: 'ignoreErrors' }) in afterEach handles remaining routes.
      }
    });

    await agents.goto('api');
  });

  test.afterEach(async ({ page }) => {
    try {
      await deleteKnowledgeBaseResource(page, capturedResourceId ?? '', capturedAuthHeader);
    } finally {
      await page.unrouteAll({ behavior: 'ignoreErrors' });
      capturedResourceId = null;
    }
  });

  test(
    'TC-KB-01: User can create a Knowledge Base and see it listed in Connectors',
    async ({ agents }) => {
      await agents.goto('api');
      const agent = await agents.openAgent(AGENT_NAME);
      await agent.tabs.openConnectors();
      await agent.connectors.clickAddKB();
      await agent.connectors.knowledgeBaseDropdown.addNewKnowledgeBase();
      const modal = agent.connectors.knowledgeBaseModal;
      await modal.createKB(
        KB_NAME,
        'Related to gesture based gaming application',
        'https://en.wikipedia.org/wiki/Gesture_recognition'
      );

      await agent.connectors.expectKBVisible(KB_NAME);
    }
  );

});