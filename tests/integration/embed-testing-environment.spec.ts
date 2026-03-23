import { test, expect } from '../../fixtures/base.fixture';

test.describe.serial('GTWY Embed - Testing Environment', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoIntegration();
    await sidepanel.integrationPage.waitForPage();
    await sidepanel.integrationPage.openFirstRow();
    await sidepanel.integrationDetailPage.waitForPage();
    await sidepanel.integrationDetailPage.clickTestingTab();
  });

  test('TC-EMBED-TEST-01: Testing environment loads with all controls visible', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.expectTestingSidebarContentVisible();
    await sidepanel.integrationDetailPage.expectTestingControlsVisible();
    await sidepanel.integrationDetailPage.expectTestingBasicControlsVisible();
    await sidepanel.integrationDetailPage.expectTestingOpenButtonVisible();
    await sidepanel.integrationDetailPage.expectTestingCloseButtonVisible();
    await sidepanel.integrationDetailPage.expectTestingSendDataVisible();
    await sidepanel.integrationDetailPage.expectTestingSendDataInputVisible();
    await sidepanel.integrationDetailPage.expectTestingSendDataButtonVisible();
    await sidepanel.integrationDetailPage.expectTestingGetAgentsVisible();
    await sidepanel.integrationDetailPage.expectTestingGetAgentsButtonVisible();
  });

  test('TC-EMBED-TEST-02: Open button shows live preview', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.expectEmbedPreviewVisible();
    await sidepanel.integrationDetailPage.clickTestingClose();
    await sidepanel.integrationDetailPage.expectEmbedPreviewNotVisible();
    await sidepanel.integrationDetailPage.clickTestingOpen();
    await sidepanel.integrationDetailPage.expectEmbedPreviewVisible();
  });

  test('TC-EMBED-TEST-03: Close button hides live preview', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.expectEmbedPreviewVisible();
    await sidepanel.integrationDetailPage.clickTestingClose();
    await sidepanel.integrationDetailPage.expectEmbedPreviewNotVisible();
  });

  test('TC-EMBED-TEST-04: Send Data button works with JSON input and logs event', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.expectTestingSendDataInputVisible();
    await sidepanel.integrationDetailPage.fillSendData('{"test": true}');
    await sidepanel.integrationDetailPage.expectTestingSendDataButtonVisible();
    await sidepanel.integrationDetailPage.clickSendData();
    await sidepanel.integrationDetailPage.expectEventLogNotEmpty();
  });

  test('TC-EMBED-TEST-05: Get Agents button works and logs event', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.expectTestingGetAgentsButtonVisible();
    await sidepanel.integrationDetailPage.clickGetAgents();
    await sidepanel.integrationDetailPage.expectEventLogNotEmpty();
  });

  test('TC-EMBED-TEST-06: Clear button resets event logs', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.clickTestingClose();
    await sidepanel.integrationDetailPage.expectEventLogNotEmpty();
    await sidepanel.integrationDetailPage.clickEventLogClear();
    await sidepanel.integrationDetailPage.expectEventLogEmpty();
  });

  test('TC-EMBED-TEST-07: Back button navigates to main view', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.expectTestingBackButtonVisible();
    await sidepanel.integrationDetailPage.clickTestingBackButton();
    await sidepanel.integrationDetailPage.expectMainNavVisible();
  });

});
