import { test } from '../../../fixtures/base.fixture';

test.describe.serial('API Key Guide - Button Visibility', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoApiKeys();
  });

  test('TC-APIKEY-GUIDE-01: All guide buttons are visible after opening API Key Guide', async ({ sidepanel }) => {
    await sidepanel.apiKeysPage.openApiKeyGuide();

    await sidepanel.apiKeysPage.expectGuideSliderVisible();
    await sidepanel.apiKeysPage.expectCloseGuideButtonVisible();
    await sidepanel.apiKeysPage.expectGuideTabsVisible();
    await sidepanel.apiKeysPage.expectAllGuideTabsVisible();
    await sidepanel.apiKeysPage.expectProviderLinkVisible();
  });

  test('TC-APIKEY-GUIDE-02: Each guide tab shows correct content title on click', async ({ sidepanel }) => {
    await sidepanel.apiKeysPage.openApiKeyGuide();
    await sidepanel.apiKeysPage.expectGuideSliderVisible();

    await sidepanel.apiKeysPage.expectAllGuideTabContentsVisible();
  });
});
