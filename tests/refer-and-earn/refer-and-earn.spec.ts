import { test, expect } from '../../fixtures/base.fixture';

test.describe('Refer And Earn Page', () => {

  test.beforeEach(async ({ page }) => {
    const orgId = process.env.ORG_ID || '1';
    await page.goto(`/org/${orgId}/referAndEarn`);
  });

  test('TC-REFER-01: Verify Refer friends heading is visible', async ({ page }) => {
    // Wait for the affiliate widget to load
    await page.waitForSelector('#refer-earn-widget-root', { timeout: 10000 });
    
    // Wait for the external script to load and render the widget content
    await page.waitForTimeout(3000);
    
    // Check for the "Refer friends" heading
    const referFriendsHeading = page.getByText('Refer friends');
    await expect(referFriendsHeading).toBeVisible({ timeout: 15000 });
  });

});
