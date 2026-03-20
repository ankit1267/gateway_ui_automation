import { test } from '../../fixtures/base.fixture';

test.describe('RAG Embed - Testing Tab', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoRAGEmbed();
    await sidepanel.ragEmbedPage.waitForPage();
    await sidepanel.ragEmbedPage.openFirstRow();
    await sidepanel.ragEmbedDetailPage.waitForPage();
    await sidepanel.ragEmbedDetailPage.clickTestingTab();
  });

  test('TC-RAG-TEST-01: Testing tab loads with all controls visible', async ({ sidepanel }) => {
    await sidepanel.ragEmbedDetailPage.expectTestingSidebarContentVisible();
    await sidepanel.ragEmbedDetailPage.expectTestingControlsVisible();
    await sidepanel.ragEmbedDetailPage.expectRagControlsVisible();
    await sidepanel.ragEmbedDetailPage.expectCreateDocumentButtonVisible();
    await sidepanel.ragEmbedDetailPage.expectShowDocumentsButtonVisible();
    await sidepanel.ragEmbedDetailPage.expectCloseDocumentsButtonVisible();
    await sidepanel.ragEmbedDetailPage.expectThemeLightButtonVisible();
    await sidepanel.ragEmbedDetailPage.expectThemeDarkButtonVisible();
  });

  test('TC-RAG-TEST-02: Create Document button logs event', async ({ sidepanel }) => {
    await sidepanel.ragEmbedDetailPage.expectCreateDocumentButtonVisible();
    await sidepanel.ragEmbedDetailPage.clickCreateDocument();
    await sidepanel.ragEmbedDetailPage.expectEventLogNotEmpty();
    await sidepanel.ragEmbedDetailPage.expectEventLogContains('openRag');
  });

  test('TC-RAG-TEST-03: Show Documents button logs event', async ({ sidepanel }) => {
    await sidepanel.ragEmbedDetailPage.expectShowDocumentsButtonVisible();
    await sidepanel.ragEmbedDetailPage.clickShowDocuments();
    await sidepanel.ragEmbedDetailPage.expectEventLogNotEmpty();
    await sidepanel.ragEmbedDetailPage.expectEventLogContains('showDocuments');
  });

  test('TC-RAG-TEST-04: Close Documents button logs event', async ({ sidepanel }) => {
    await sidepanel.ragEmbedDetailPage.expectCloseDocumentsButtonVisible();
    await sidepanel.ragEmbedDetailPage.clickCloseDocuments();
    await sidepanel.ragEmbedDetailPage.expectEventLogNotEmpty();
    await sidepanel.ragEmbedDetailPage.expectEventLogContains('closeDocuments');
  });

  test('TC-RAG-TEST-05: Theme Light and Dark buttons work', async ({ sidepanel }) => {
    await sidepanel.ragEmbedDetailPage.expectThemeLightButtonVisible();
    await sidepanel.ragEmbedDetailPage.selectLightTheme();
    await sidepanel.ragEmbedDetailPage.expectThemeDarkButtonVisible();
    await sidepanel.ragEmbedDetailPage.selectDarkTheme();
  });

  test('TC-RAG-TEST-06: Clear button resets event logs', async ({ sidepanel }) => {
    await sidepanel.ragEmbedDetailPage.clickCloseDocuments();
    await sidepanel.ragEmbedDetailPage.expectEventLogNotEmpty();
    await sidepanel.ragEmbedDetailPage.clickEventLogClear();
    await sidepanel.ragEmbedDetailPage.expectEventLogEmpty();
  });

  test('TC-RAG-TEST-07: Back button navigates to main view', async ({ sidepanel }) => {
    await sidepanel.ragEmbedDetailPage.expectTestingBackButtonVisible();
    await sidepanel.ragEmbedDetailPage.clickTestingBackButton();
  });

  test('TC-RAG-TEST-08: Create document and verify resource in iframe', async ({ sidepanel }) => {
    const docName = `test-doc-${Date.now()}`;

    await sidepanel.ragEmbedDetailPage.clickAddNewDocumentInFrame();

    await sidepanel.ragEmbedDetailPage.fillKnowledgeBaseName(docName);
    await sidepanel.ragEmbedDetailPage.fillDescription('test-description');
    await sidepanel.ragEmbedDetailPage.fillUrl('https://www.wikipedia.org/');

    await sidepanel.ragEmbedDetailPage.clickCreateInFrame();

    await sidepanel.ragEmbedDetailPage.expectResourceVisibleInFrame(docName);

    await sidepanel.ragEmbedDetailPage.deleteLastResourceInFrame();

    await sidepanel.ragEmbedDetailPage.clickRefreshInFrame();

    await sidepanel.ragEmbedDetailPage.expectResourceNotVisibleInFrame(docName);
  });

});
