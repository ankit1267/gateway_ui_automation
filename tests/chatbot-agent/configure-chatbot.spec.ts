import { test } from '../../fixtures/base.fixture';

test.describe.serial('Configure Chatbot - Integration Guide', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoChatbotConfig();
    await sidepanel.chatbotConfigPage.expectFirstStepVisible();
  });

  test('TC-CB-IG-01: All steps have text', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.expectAllStepsHaveText();
  });

  test('TC-CB-IG-02: All copy buttons work', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.expectAllCopyButtonsWork();
  });

  test('TC-CB-IG-03: Show Access Key reveals key with working copy button', async ({ sidepanel }) => {
    await sidepanel.chatbotConfigPage.expectShowAccessKeyRevealsKeyWithCopy();
  });

});
