import { test } from '../../fixtures/base.fixture';
import { deleteKnowledgeBaseResource } from '../../utils/api-cleanup';

test.describe('Knowledge Base - Create & Update', () => {
  let capturedResourceId: string | null = null;
  let capturedAuthHeader: string | null = null;
  let pendingCapture: Promise<void> | null = null;

  test.beforeEach(async ({ sidepanel, page }) => {
    capturedResourceId = null;
    capturedAuthHeader = null;
    pendingCapture = null;
    page.on('response', (res) => {
      if (res.url().includes('/api/rag/resource') && res.request().method() === 'POST') {
        pendingCapture = res.json().then((body) => {
          const id = body?.data?._id;
          if (id) {
            capturedResourceId = id;
            capturedAuthHeader = res.request().headers()['authorization'] ?? null;
          }
        }).catch(() => {});
      }
    });
    await sidepanel.gotoKnowledgeBase();
  });

  test.afterEach(async ({ page }) => {
    if (pendingCapture) await pendingCapture;
    await deleteKnowledgeBaseResource(page, capturedResourceId ?? '', capturedAuthHeader);
    capturedResourceId = null;
  });

   test('Update Knowledge Base', async ({ sidepanel }) => {
    await sidepanel.knowledgeBasePage.updateKbByName('Resume');
    const newDescription = `Resume ${Date.now()}`;
    await sidepanel.knowledgeBasePage.fillKbDescription(newDescription);
    await sidepanel.knowledgeBasePage.clickSubmit();
    await sidepanel.knowledgeBasePage.expectKnowledgeBaseDescription(newDescription);
  });

  test('Create Knowledge Base using Content', async ({ sidepanel }) => {
    await sidepanel.knowledgeBasePage.clickCreate();
    await sidepanel.knowledgeBasePage.fillKbName('Kb_Ajit Doval');
    await sidepanel.knowledgeBasePage.fillKbDescription('Wikipedia of Ajit Doval');
    await sidepanel.knowledgeBasePage.selectContentRadio();
    await sidepanel.knowledgeBasePage.fillContent('Ajit Kumar Doval (born 20 January 1945) is an Indian bureaucrat, spymaster and retired police and intelligence officer who has been serving as the longest tenured National Security Advisor of India (NSA) since 2014.');
    await sidepanel.knowledgeBasePage.toggleAdvancedSettings();
    await sidepanel.knowledgeBasePage.selectModerateRadio();
    await sidepanel.knowledgeBasePage.selectHighAccuracyRadio();
    await sidepanel.knowledgeBasePage.clickSubmit();
    await sidepanel.knowledgeBasePage.expectKnowledgeBaseByName('Kb_Ajit Doval');
  });

  test('Create Knowledge Base using URL', async ({ sidepanel }) => {
    await sidepanel.knowledgeBasePage.clickCreate();
    await sidepanel.knowledgeBasePage.fillKbName('Playwright');
    await sidepanel.knowledgeBasePage.fillKbDescription('Contain Playwright doc');
    await sidepanel.knowledgeBasePage.fillUrl('https://playwright.dev/docs/intro');
    await sidepanel.knowledgeBasePage.clickSubmit();
    await sidepanel.knowledgeBasePage.expectKnowledgeBaseByName('Playwright');
    await sidepanel.knowledgeBasePage.deleteKnowledgeBaseByName('Playwright');
  });

 
});

