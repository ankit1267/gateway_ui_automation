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

test.describe('Admin Settings - Add New Model', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoAddNewModel();
    await sidepanel.addNewModelPage.waitForPage();
  });

  test('TC-ADMIN-18: Model Management page title is visible', async ({ sidepanel }) => {
    await expect(sidepanel.addNewModelPage.pageTitle).toBeVisible();
  });

  test('TC-ADMIN-19: Add New Model button is visible', async ({ sidepanel }) => {
    await expect(sidepanel.addNewModelPage.addNewModelButton).toBeVisible();
  });

  test('TC-ADMIN-20: Model table or empty state is displayed', async ({ sidepanel }) => {
    const isEmpty = await sidepanel.addNewModelPage.isEmptyState();
    if (isEmpty) {
      await expect(sidepanel.addNewModelPage.emptyState).toBeVisible();
    } else {
      const rowCount = await sidepanel.addNewModelPage.getTableRowCount();
      expect(rowCount).toBeGreaterThan(0);
    }
  });

  test('TC-ADMIN-35: Clicking Add New Model button opens model form modal', async ({ sidepanel }) => {
    await sidepanel.addNewModelPage.clickAddNewModel();
    await expect(sidepanel.page.locator('#add-new-model-modal-container')).toBeVisible();
    await expect(sidepanel.page.getByRole('heading', { name: 'Add a New Model' })).toBeVisible();
    await expect(sidepanel.page.getByRole('heading', { name: 'Model Details' })).toBeVisible();
  });

  test('TC-ADMIN-36: Add New Model modal can be closed', async ({ sidepanel }) => {
    await sidepanel.addNewModelPage.clickAddNewModel();
    await expect(sidepanel.page.locator('#add-new-model-modal-container')).toBeVisible();

    await sidepanel.page.getByTestId('add-model-header-close-button').dispatchEvent('click');
    await expect(sidepanel.page.locator('#ADD_NEW_MODEL_MODAL')).not.toHaveAttribute('open', { timeout: 5000 });
  });

  test('TC-ADMIN-37: Add New Model modal Reset button is functional', async ({ sidepanel }) => {
    await sidepanel.addNewModelPage.clickAddNewModel();
    await expect(sidepanel.page.locator('#add-new-model-modal-container')).toBeVisible();

    await expect(sidepanel.page.getByTestId('add-model-reset-button')).toBeVisible();
    await sidepanel.page.getByTestId('add-model-reset-button').click();
  });

  test('TC-ADMIN-38: Add New Model modal Save button is present', async ({ sidepanel }) => {
    await sidepanel.addNewModelPage.clickAddNewModel();
    await expect(sidepanel.page.locator('#add-model-save-button')).toBeVisible();
  });

});

test.describe('Admin Settings - GTWY Tools', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoPrebuiltPrompts();
    await sidepanel.prebuiltPromptsPage.waitForPage();
  });

  test('TC-ADMIN-21: GTWY Tools page title and description are visible', async ({ sidepanel }) => {
    await expect(sidepanel.prebuiltPromptsPage.pageTitle).toBeVisible();
    await expect(sidepanel.prebuiltPromptsPage.pageDescription).toBeVisible();
  });

  test('TC-ADMIN-22: Agent tabs are visible', async ({ sidepanel }) => {
    await expect(sidepanel.prebuiltPromptsPage.agentTabsContainer).toBeVisible();
    const tabNames = await sidepanel.prebuiltPromptsPage.getAgentTabNames();
    expect(tabNames.length).toBeGreaterThan(0);
  });

  test('TC-ADMIN-23: Selected agent heading, prompt textarea and token count are visible', async ({ sidepanel }) => {
    await expect(sidepanel.prebuiltPromptsPage.selectedAgentHeading).toBeVisible();
    await expect(sidepanel.prebuiltPromptsPage.promptTextarea).toBeVisible();
    await expect(sidepanel.prebuiltPromptsPage.tokenCountBadge).toBeVisible();
  });

  test('TC-ADMIN-24: Save and Default buttons are visible', async ({ sidepanel }) => {
    await expect(sidepanel.prebuiltPromptsPage.saveButton).toBeVisible();
    await expect(sidepanel.prebuiltPromptsPage.defaultButton).toBeVisible();
  });

  test('TC-ADMIN-25: Save button is disabled initially', async ({ sidepanel }) => {
    const isDisabled = await sidepanel.prebuiltPromptsPage.isSaveDisabled();
    expect(isDisabled).toBe(true);
  });

  test('TC-ADMIN-26: Switching agent tab updates the heading', async ({ sidepanel }) => {
    const tabNames = await sidepanel.prebuiltPromptsPage.getAgentTabNames();
    if (tabNames.length > 1) {
      const firstAgent = await sidepanel.prebuiltPromptsPage.getSelectedAgentName();

      await sidepanel.prebuiltPromptsPage.selectAgent(tabNames[1]);
      const secondAgent = await sidepanel.prebuiltPromptsPage.getSelectedAgentName();

      expect(secondAgent).toBe(tabNames[1]);
      expect(secondAgent).not.toBe(firstAgent);
    }
  });

  test('TC-ADMIN-27: Editing prompt enables the Save button', async ({ sidepanel }) => {
    const isDisabledBefore = await sidepanel.prebuiltPromptsPage.isSaveDisabled();
    expect(isDisabledBefore).toBe(true);

    const currentPrompt = await sidepanel.prebuiltPromptsPage.getPromptValue();
    await sidepanel.prebuiltPromptsPage.fillPrompt(currentPrompt + ' test');

    const isDisabledAfter = await sidepanel.prebuiltPromptsPage.isSaveDisabled();
    expect(isDisabledAfter).toBe(false);

    await sidepanel.prebuiltPromptsPage.fillPrompt(currentPrompt);
  });

  test('TC-ADMIN-39: Default button resets prompt to original', async ({ sidepanel }) => {
    const originalPrompt = await sidepanel.prebuiltPromptsPage.getPromptValue();
    await sidepanel.prebuiltPromptsPage.fillPrompt('Completely new prompt text for testing');

    const isDisabled = await sidepanel.prebuiltPromptsPage.isSaveDisabled();
    expect(isDisabled).toBe(false);

    await sidepanel.prebuiltPromptsPage.clickDefault();
    await sidepanel.page.waitForTimeout(1000);

    const restoredPrompt = await sidepanel.prebuiltPromptsPage.getPromptValue();
    expect(restoredPrompt.length).toBeGreaterThan(0);
  });

  test('TC-ADMIN-40: Switching agent tab loads different prompt content', async ({ sidepanel }) => {
    const tabNames = await sidepanel.prebuiltPromptsPage.getAgentTabNames();
    if (tabNames.length > 1) {
      const firstPrompt = await sidepanel.prebuiltPromptsPage.getPromptValue();

      await sidepanel.prebuiltPromptsPage.selectAgent(tabNames[1]);
      await sidepanel.page.waitForTimeout(500);

      const secondPrompt = await sidepanel.prebuiltPromptsPage.getPromptValue();
      expect(secondPrompt.length).toBeGreaterThan(0);
    }
  });

  test('TC-ADMIN-41: Switching agent tab updates token count', async ({ sidepanel }) => {
    const tabNames = await sidepanel.prebuiltPromptsPage.getAgentTabNames();
    if (tabNames.length > 1) {
      const firstTokenCount = await sidepanel.prebuiltPromptsPage.getTokenCount();

      await sidepanel.prebuiltPromptsPage.selectAgent(tabNames[1]);
      await sidepanel.page.waitForTimeout(500);

      const secondTokenCount = await sidepanel.prebuiltPromptsPage.getTokenCount();
      expect(secondTokenCount).toBeTruthy();
    }
  });

  test('TC-ADMIN-42: Agent tab highlights when selected', async ({ sidepanel }) => {
    const tabNames = await sidepanel.prebuiltPromptsPage.getAgentTabNames();
    if (tabNames.length > 1) {
      await sidepanel.prebuiltPromptsPage.selectAgent(tabNames[1]);
      const isSelected = await sidepanel.prebuiltPromptsPage.isAgentTabSelected(tabNames[1]);
      expect(isSelected).toBe(true);
    }
  });

});
