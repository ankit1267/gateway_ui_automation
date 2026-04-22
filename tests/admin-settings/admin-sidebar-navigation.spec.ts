import { test, expect } from '../../fixtures/base.fixture';

test.describe('Admin Settings - Sidebar Navigation', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoAgents();
    await sidepanel.clickAdminSettingsToggle();
    await sidepanel.expectAdminSidebarVisible();
  });

  test('TC-ADMIN-01: Admin Settings toggle shows all admin menu items', async ({ sidepanel }) => {
    await sidepanel.expectAdminMenuItemsVisible();
  });

  test('TC-ADMIN-02: Clicking Workspace navigates to Workspace Settings page', async ({ sidepanel }) => {
    await sidepanel.clickAdminMenuWorkspace();
    await sidepanel.workspaceSettingPage.waitForPage();
    await expect(sidepanel.page).toHaveURL(/workspaceSetting/);
  });

  test('TC-ADMIN-03: Clicking Members navigates to Members page', async ({ sidepanel }) => {
    await sidepanel.clickAdminMenuMembers();
    await expect(sidepanel.page).toHaveURL(/invite/);
    await expect(sidepanel.page.locator('#userProxyContainer')).toBeAttached();
  });

  test('TC-ADMIN-04: Clicking Auth 2.0 navigates to Authentication page', async ({ sidepanel }) => {
    await sidepanel.clickAdminMenuAuth();
    await sidepanel.authRoutePage.waitForPage();
    await expect(sidepanel.page).toHaveURL(/auth_route/);
  });

  test('TC-ADMIN-05: Clicking Add new Model navigates to Model Management page', async ({ sidepanel }) => {
    await sidepanel.clickAdminMenuAddModel();
    await sidepanel.addNewModelPage.waitForPage();
    await expect(sidepanel.page).toHaveURL(/addNewModel/);
  });

  test('TC-ADMIN-06: Clicking GTWY Tools navigates to Prebuilt Prompts page', async ({ sidepanel }) => {
    await sidepanel.clickAdminMenuGtwyTools();
    await sidepanel.prebuiltPromptsPage.waitForPage();
    await expect(sidepanel.page).toHaveURL(/prebuilt-prompts/);
  });

});
