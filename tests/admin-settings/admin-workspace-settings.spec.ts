import { test, expect } from '../../fixtures/base.fixture';

test.describe('Admin Settings - Workspace Settings', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoWorkspaceSetting();
    await sidepanel.workspaceSettingPage.waitForPage();
  });

  test('TC-ADMIN-07: Workspace Settings page title is visible', async ({ sidepanel }) => {
    await expect(sidepanel.workspaceSettingPage.pageTitle).toBeVisible();
  });

  test('TC-ADMIN-08: Domain, Organization Name, Email, Timezone cards are visible', async ({ sidepanel }) => {
    await expect(sidepanel.workspaceSettingPage.domainLabel).toBeVisible();
    await expect(sidepanel.workspaceSettingPage.domainValue).toBeVisible();

    await expect(sidepanel.workspaceSettingPage.orgNameLabel).toBeVisible();
    await expect(sidepanel.workspaceSettingPage.orgNameValue).toBeVisible();

    await expect(sidepanel.workspaceSettingPage.emailLabel).toBeVisible();
    await expect(sidepanel.workspaceSettingPage.emailValue).toBeVisible();

    await expect(sidepanel.workspaceSettingPage.timezoneLabel).toBeVisible();
    await expect(sidepanel.workspaceSettingPage.timezoneValue).toBeVisible();
  });

  test('TC-ADMIN-09: Domain and Org Name have non-empty values', async ({ sidepanel }) => {
    const domain = await sidepanel.workspaceSettingPage.getDomainValue();
    expect(domain.trim().length).toBeGreaterThan(0);

    const orgName = await sidepanel.workspaceSettingPage.getOrgNameValue();
    expect(orgName.trim().length).toBeGreaterThan(0);
  });

  test('TC-ADMIN-10: Timezone editor opens on click', async ({ sidepanel }) => {
    await sidepanel.workspaceSettingPage.openTimezoneEditor();
    const isOpen = await sidepanel.workspaceSettingPage.isTimezoneEditorOpen();
    expect(isOpen).toBe(true);

    await expect(sidepanel.workspaceSettingPage.timezoneSearchInput).toBeVisible();
    await expect(sidepanel.workspaceSettingPage.timezoneList).toBeVisible();
    await expect(sidepanel.workspaceSettingPage.saveButton).toBeVisible();
    await expect(sidepanel.workspaceSettingPage.cancelButton).toBeVisible();
  });

  test('TC-ADMIN-11: Timezone search filters timezone list', async ({ sidepanel }) => {
    await sidepanel.workspaceSettingPage.openTimezoneEditor();

    const countBefore = await sidepanel.workspaceSettingPage.getVisibleTimezoneCount();

    await sidepanel.workspaceSettingPage.searchTimezone('Asia/Kolkata');

    const countAfter = await sidepanel.workspaceSettingPage.getVisibleTimezoneCount();
    expect(countAfter).toBeLessThan(countBefore);
    expect(countAfter).toBeGreaterThan(0);
  });

  test('TC-ADMIN-12: Timezone editor cancel closes the editor', async ({ sidepanel }) => {
    await sidepanel.workspaceSettingPage.openTimezoneEditor();
    const isOpenBefore = await sidepanel.workspaceSettingPage.isTimezoneEditorOpen();
    expect(isOpenBefore).toBe(true);

    await sidepanel.workspaceSettingPage.clickCancel();

    const isOpenAfter = await sidepanel.workspaceSettingPage.isTimezoneEditorOpen();
    expect(isOpenAfter).toBe(false);
  });

  test('TC-ADMIN-13: Selecting a timezone highlights it', async ({ sidepanel }) => {
    await sidepanel.workspaceSettingPage.openTimezoneEditor();
    await sidepanel.workspaceSettingPage.searchTimezone('Asia/Kolkata');
    await sidepanel.workspaceSettingPage.selectTimezone('Asia/Kolkata');

    const isSelected = await sidepanel.workspaceSettingPage.isTimezoneSelected('Asia/Kolkata');
    expect(isSelected).toBe(true);
  });

  test('TC-ADMIN-28: Save button closes editor after saving timezone', async ({ sidepanel }) => {
    await sidepanel.workspaceSettingPage.openTimezoneEditor();
    const isOpenBefore = await sidepanel.workspaceSettingPage.isTimezoneEditorOpen();
    expect(isOpenBefore).toBe(true);

    await sidepanel.workspaceSettingPage.searchTimezone('Asia/Kolkata');
    await sidepanel.workspaceSettingPage.selectTimezone('Asia/Kolkata');
    await sidepanel.workspaceSettingPage.clickSave();

    const isOpenAfter = await sidepanel.workspaceSettingPage.isTimezoneEditorOpen();
    expect(isOpenAfter).toBe(false);
  });

  test('TC-ADMIN-29: Timezone value updates after save', async ({ sidepanel }) => {
    const originalTimezone = await sidepanel.workspaceSettingPage.getTimezoneValue();

    await sidepanel.workspaceSettingPage.openTimezoneEditor();
    await sidepanel.workspaceSettingPage.searchTimezone('Asia/Kolkata');
    await sidepanel.workspaceSettingPage.selectTimezone('Asia/Kolkata');
    await sidepanel.workspaceSettingPage.clickSave();

    const updatedTimezone = await sidepanel.workspaceSettingPage.getTimezoneValue();
    expect(updatedTimezone).toContain('Asia/Kolkata');

    if (!originalTimezone.includes('Asia/Kolkata')) {
      await sidepanel.workspaceSettingPage.openTimezoneEditor();
      await sidepanel.workspaceSettingPage.searchTimezone(originalTimezone.split(' ')[0]);
      await sidepanel.workspaceSettingPage.selectTimezone(originalTimezone.split(' ')[0]);
      await sidepanel.workspaceSettingPage.clickSave();
    }
  });

});
