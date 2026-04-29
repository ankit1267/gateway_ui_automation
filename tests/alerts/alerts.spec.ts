import { test } from '../../fixtures/base.fixture';

const testEnv = process.env.TEST_ENV || 'dev';

test.describe('Alerts - Sidepanel', () => {
  test.skip(testEnv !== 'prod', 'Alerts test only runs on prod environment');

  test.beforeEach(async ({ sidepanel}) => {
    await sidepanel.gotoAlerts();
  });

  test('TC-ALERTS-01: Alerts heading is visible inside the embed iframe', async ({ sidepanel }) => {
    await sidepanel.alertsPage.expectAlertsHeadingVisible();
  });

  test('TC-ALERTS-02: Alert type buttons are visible after clicking Add apps', async ({ sidepanel }) => {
    await sidepanel.alertsPage.expectAlertsHeadingVisible();
    await sidepanel.alertsPage.clickAddApps();
    await sidepanel.alertsPage.expectAlertTypeButtonsVisible();
  });

});
