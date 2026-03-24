import { test } from '../../fixtures/base.fixture';

test.describe.serial('Chunking Configuration', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoKnowledgeBase();
    await sidepanel.knowledgeBasePage.clickCreate();
  });

  test('Chunk size resets to 4000 when value exceeds maximum', async ({ sidepanel }) => {
    await sidepanel.knowledgeBasePage.fillChunkSize('15000');
    await sidepanel.knowledgeBasePage.blurChunkSize();
    await sidepanel.knowledgeBasePage.expectChunkSizeValue('4000');
  });

  test('Chunk size resets to 1 when we enter 0', async ({ sidepanel }) => {
    await sidepanel.knowledgeBasePage.fillChunkSize('0');
    await sidepanel.knowledgeBasePage.blurChunkSize();
    await sidepanel.knowledgeBasePage.expectChunkSizeValue('1');
  });

});


