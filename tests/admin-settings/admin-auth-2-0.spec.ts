import { test, expect } from '../../fixtures/base.fixture';

test.describe('Admin Settings - Auth 2.0', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoAuthRoute();
    await sidepanel.authRoutePage.waitForPage();
  });

  test('TC-ADMIN-14: Authentication page title is visible', async ({ sidepanel }) => {
    await expect(sidepanel.authRoutePage.pageTitle).toBeVisible();
  });

  test('TC-ADMIN-15: Auth form fields and button are visible when no routes exist', async ({ sidepanel }) => {
    const hasRoutes = await sidepanel.authRoutePage.existingRoutesHeading.isVisible();
    if (!hasRoutes) {
      await expect(sidepanel.authRoutePage.authNameInput).toBeVisible();
      await expect(sidepanel.authRoutePage.redirectUrlInput).toBeVisible();
      await expect(sidepanel.authRoutePage.addOAuthButton).toBeVisible();
    }
  });

  test('TC-ADMIN-16: Add OAuth Route button is disabled when fields are empty', async ({ sidepanel }) => {
    const hasRoutes = await sidepanel.authRoutePage.existingRoutesHeading.isVisible();
    if (!hasRoutes) {
      await expect(sidepanel.authRoutePage.addOAuthButton).toBeDisabled();
    }
  });

  test('TC-ADMIN-17: Existing Auth Routes table visible when routes exist', async ({ sidepanel }) => {
    const hasRoutes = await sidepanel.authRoutePage.existingRoutesHeading.isVisible();
    if (hasRoutes) {
      const rowCount = await sidepanel.authRoutePage.getTableRowCount();
      expect(rowCount).toBeGreaterThan(0);
    }
  });

  test('TC-ADMIN-30: Filling auth name enables typing', async ({ sidepanel }) => {
    const hasRoutes = await sidepanel.authRoutePage.existingRoutesHeading.isVisible();
    if (!hasRoutes) {
      await sidepanel.authRoutePage.fillAuthName('Test Auth');
      const value = await sidepanel.authRoutePage.getAuthNameValue();
      expect(value).toBe('Test Auth');
    }
  });

  test('TC-ADMIN-31: Filling redirect URL enables typing and validates', async ({ sidepanel }) => {
    const hasRoutes = await sidepanel.authRoutePage.existingRoutesHeading.isVisible();
    if (!hasRoutes) {
      await sidepanel.authRoutePage.fillRedirectUrl('https://example.com/callback');
      const value = await sidepanel.authRoutePage.getRedirectUrlValue();
      expect(value).toBe('https://example.com/callback');
    }
  });

  test('TC-ADMIN-32: Add OAuth Route button enables when both fields are filled', async ({ sidepanel }) => {
    const hasRoutes = await sidepanel.authRoutePage.existingRoutesHeading.isVisible();
    if (!hasRoutes) {
      await expect(sidepanel.authRoutePage.addOAuthButton).toBeDisabled();

      await sidepanel.authRoutePage.fillAuthName('Test Auth');
      await sidepanel.authRoutePage.fillRedirectUrl('https://example.com/callback');

      await expect(sidepanel.authRoutePage.addOAuthButton).toBeEnabled();
    }
  });

  test('TC-ADMIN-33: Invalid URL shows error message', async ({ sidepanel }) => {
    const hasRoutes = await sidepanel.authRoutePage.existingRoutesHeading.isVisible();
    if (!hasRoutes) {
      await sidepanel.authRoutePage.fillAuthName('Test Auth');
      await sidepanel.authRoutePage.fillRedirectUrl('not-a-url');

      await expect(sidepanel.page.getByText('Please enter a valid URL')).toBeVisible();
      await expect(sidepanel.authRoutePage.addOAuthButton).toBeDisabled();
    }
  });

  test('TC-ADMIN-34: Clicking existing auth route row opens Auth Data modal', async ({ sidepanel }) => {
    const hasRoutes = await sidepanel.authRoutePage.existingRoutesHeading.isVisible();
    if (hasRoutes) {
      await sidepanel.page.locator('table tbody tr').first().click();
      await expect(sidepanel.page.locator('#auth-data-modal-container')).toBeVisible();
      await expect(sidepanel.page.getByRole('heading', { name: 'Authentication Details' })).toBeVisible();

      await sidepanel.page.getByTestId('auth-data-close-button').click();
      await expect(sidepanel.page.locator('#auth-data-modal-container')).not.toBeVisible();
    }
  });

});
