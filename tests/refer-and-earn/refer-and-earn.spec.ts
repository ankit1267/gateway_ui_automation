import { test, expect } from '../../fixtures/base.fixture';

test.describe('Refer And Earn Page', () => {

  test.beforeEach(async ({ page }) => {
    const orgId = process.env.ORG_ID || '1';
    await page.goto(`/org/${orgId}/referAndEarn`);
  });

  test('TC-REFER-01: Verify Refer and Earn heading, copy action, and affiliate link redirect', async ({ page }) => {
    // Wait for the affiliate widget to load
    await page.waitForSelector('#refer-earn-widget-root', { timeout: 10000 });
    
    // Wait for the external script to load and render the widget content
    await page.waitForTimeout(3000);
    
    // Check for the "Refer friends" heading
    const referFriendsHeading = page.getByText('Refer friends');
    await expect(referFriendsHeading).toBeVisible({ timeout: 15000 });

    // Click Copy and verify button state changes to Copied
    const copyButton = page.getByRole('button', { name: 'Copy' });
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();

    // Verify affiliate portal info link opens and redirects correctly
    const affiliateInfoLink = page.locator('a.af-info-link');
    await expect(affiliateInfoLink).toBeVisible();
    await expect(affiliateInfoLink).toHaveAttribute('href', 'https://main.d2pk65wuanp7g1.amplifyapp.com/login');

    const [portalPage] = await Promise.all([
      page.waitForEvent('popup'),
      affiliateInfoLink.click(),
    ]);
    await portalPage.waitForLoadState('domcontentloaded');
    await expect(portalPage).toHaveURL(/https:\/\/main\.d2pk65wuanp7g1\.amplifyapp\.com\/login/);
    await portalPage.close();
  });

});
