import { test } from '../../fixtures/base.fixture';

test.describe.serial('Configure Chatbot - Testing Tab', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoChatbotConfig();
    await sidepanel.chatbotConfigPage.expectFirstStepVisible();
    await sidepanel.chatbotConfigPage.clickTestingTab();
    await sidepanel.chatbotConfigPage.expectTestingControlsVisible();
  });

  test('TC-CB-TEST-01: All testing controls visible', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.expectTestingOpenButtonVisible();
    await sidepanel.chatbotConfigPage.expectTestingCloseButtonVisible();
    await sidepanel.chatbotConfigPage.expectTestingShowIconButtonVisible();
    await sidepanel.chatbotConfigPage.expectTestingHideIconButtonVisible();
    await sidepanel.chatbotConfigPage.expectTestingReloadChatsButtonVisible();
    await sidepanel.chatbotConfigPage.expectTestingSendDataVisible();
    await sidepanel.chatbotConfigPage.expectTestingAskAiVisible();
    await sidepanel.chatbotConfigPage.expectTestingBackButtonVisible();
  });

  test('TC-CB-TEST-02: Open button works', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.clickTestingOpen();
    await sidepanel.chatbotConfigPage.expectPreviewFrameVisible();
  });

  test('TC-CB-TEST-03: Close button works', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.clickTestingClose();
  });

  test('TC-CB-TEST-04: Show Icon button works', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.clickTestingShowIcon();
  });

  test('TC-CB-TEST-05: Hide Icon button works', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.clickTestingHideIcon();
  });

  test('TC-CB-TEST-06: Reload Chats button works', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.clickTestingReloadChats();
  });

  test('TC-CB-TEST-07: Send Data with valid JSON', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.sendData('{"bridgeName": "test", "threadId": "t1"}');
  });

  test('TC-CB-TEST-08: Send Data with invalid JSON logs error', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.sendData('invalid json');
    await sidepanel.chatbotConfigPage.expectEventLogContains('Invalid JSON format');
  });

  test('TC-CB-TEST-09: Ask AI sends question', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.askAi('What is GTWY?');
  });

  test('TC-CB-TEST-10: Clear button resets event logs', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.clickTestingClose();
    await sidepanel.chatbotConfigPage.expectEventLogNotEmpty();
    await sidepanel.chatbotConfigPage.clickEventLogClear();
    await sidepanel.chatbotConfigPage.expectEventLogEmpty();
  });

  test('TC-CB-TEST-11: Back button navigates to main view', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.clickTestingBack();
    await sidepanel.chatbotConfigPage.expectFirstStepVisible();
  });

});
