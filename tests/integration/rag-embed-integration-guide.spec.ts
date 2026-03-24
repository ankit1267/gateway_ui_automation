import { test } from '../../fixtures/base.fixture';

test.describe('RAG Embed - Integration Guide', () => {

  test('TC-RAG-IG-01: steps have text and all copy buttons work', async ({ sidepanel }) => {
    await sidepanel.gotoRAGEmbed();
    await sidepanel.ragEmbedPage.waitForPage();

    await sidepanel.ragEmbedPage.openFirstRow();
    await sidepanel.ragEmbedDetailPage.waitForPage();

    await sidepanel.ragEmbedDetailPage.clickIntegrationTab();

    await sidepanel.ragEmbedDetailPage.expectAllStepsHaveText();
    await sidepanel.ragEmbedDetailPage.expectAllCopyButtonsWork();
  });

});
