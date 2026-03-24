import { test, expect } from '../../fixtures/base.fixture';

test.describe.serial('GTWY Embed - Integration Guide', () => {

  test('TC-EMBED-IG-01: steps have text and all copy buttons work', async ({ sidepanel }) => {
    await sidepanel.gotoIntegration();
    await sidepanel.integrationPage.waitForPage();

    await sidepanel.integrationPage.openFirstRow();
    await sidepanel.integrationDetailPage.waitForPage();

    await sidepanel.integrationDetailPage.clickIntegrationTab();

    await sidepanel.integrationDetailPage.expectAllStepsHaveText();
    await sidepanel.integrationDetailPage.expectAllCopyButtonsWork();
  });

});
