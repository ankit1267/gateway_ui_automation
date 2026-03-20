import { test } from '../../fixtures/base.fixture';

test.describe('Configure Chatbot - Configuration Tab', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoChatbotConfig();
    await sidepanel.chatbotConfigPage.expectFirstStepVisible();
    await sidepanel.chatbotConfigPage.clickConfigurationTab();
    await sidepanel.chatbotConfigPage.expectConfigSidebarContentVisible();
    await sidepanel.chatbotConfigPage.expectPreviewFrameVisible();
  });

  test('TC-CB-CFG-01: Change chatbot title and verify in live preview', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.fillConfigChatbotTitle('Test Bot Title');
    await sidepanel.chatbotConfigPage.reloadPreview();
    await sidepanel.chatbotConfigPage.expectPreviewContainsText('Test Bot Title');
  });

  test('TC-CB-CFG-02: Change chatbot subtitle and verify in live preview', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.fillConfigChatbotSubtitle('Test Subtitle');
    await sidepanel.chatbotConfigPage.reloadPreview();
    await sidepanel.chatbotConfigPage.expectPreviewContainsText('Test Subtitle');
  });

  test('TC-CB-CFG-03: Change button title and icon URL, verify in live preview', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.fillConfigButtonTitle('viasocket');
    await sidepanel.chatbotConfigPage.fillConfigIconUrl('viasocket.com');
    await sidepanel.chatbotConfigPage.reloadPreview();
    await sidepanel.chatbotConfigPage.closeChatbotInPreview();
    await sidepanel.chatbotConfigPage.expectFloatingButtonText('viasocket');
  });

  test('TC-CB-CFG-04: Change height and verify in live preview', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.fillConfigHeight('500');
    await sidepanel.chatbotConfigPage.selectConfigHeightUnit('px');
    await sidepanel.chatbotConfigPage.reloadPreview();
    await sidepanel.chatbotConfigPage.expectPreviewFrameVisible();
  });

  test('TC-CB-CFG-05: Change width and verify in live preview', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.fillConfigWidth('400');
    await sidepanel.chatbotConfigPage.selectConfigWidthUnit('px');
    await sidepanel.chatbotConfigPage.reloadPreview();
    await sidepanel.chatbotConfigPage.expectPreviewFrameVisible();
  });

  test('TC-CB-CFG-06: Change position and verify in live preview', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.selectConfigPosition('pop_over');
    await sidepanel.chatbotConfigPage.reloadPreview();
    await sidepanel.chatbotConfigPage.expectPreviewFrameVisible();
  });

  test('TC-CB-CFG-07: Change theme color', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.fillConfigThemeColor('#ff5733');
    await sidepanel.chatbotConfigPage.reloadPreview();
    await sidepanel.chatbotConfigPage.expectPreviewFrameVisible();
  });

  test('TC-CB-CFG-08: Back button navigates to main view', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.clickConfigBack();
    await sidepanel.chatbotConfigPage.expectFirstStepVisible();
  });

});
