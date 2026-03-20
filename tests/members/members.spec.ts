import { test, expect } from '../../fixtures/base.fixture';

test.describe('Members Page - Navigation', () => {

  test('TC-MEM-01: Navigate to Members page via direct URL', async ({ sidepanel }) => {
    await sidepanel.gotoInvite();
    await sidepanel.membersPage.waitForPage();
    await expect(sidepanel.page).toHaveURL(/invite/);
  });

  test('TC-MEM-02: Navigate to Members page via Admin Settings sidebar', async ({ sidepanel }) => {
    await sidepanel.gotoAgents();
    await sidepanel.clickAdminSettingsToggle();
    await sidepanel.expectAdminSidebarVisible();
    await sidepanel.clickAdminMenuMembers();
    await expect(sidepanel.page).toHaveURL(/invite/);
    await sidepanel.membersPage.waitForPage();
  });

  test('TC-MEM-03: Members page does not show 404', async ({ sidepanel }) => {
    await sidepanel.gotoInvite();
    await sidepanel.page.waitForLoadState('networkidle');
    await expect(sidepanel.page.getByRole('heading', { name: '404' })).not.toBeVisible({ timeout: 10000 });
    await expect(sidepanel.page.getByText(/page not found/i)).not.toBeVisible({ timeout: 10000 });
  });

});

test.describe('Members Page - Container', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoInvite();
    await sidepanel.membersPage.waitForPage();
  });

  test('TC-MEM-04: User proxy container is present in the DOM', async ({ sidepanel }) => {
    const isAttached = await sidepanel.membersPage.isContainerAttached();
    expect(isAttached).toBe(true);
  });

  test('TC-MEM-05: User proxy container element has correct id', async ({ sidepanel }) => {
    const container = sidepanel.membersPage.userProxyContainer;
    await expect(container).toHaveId('userProxyContainer');
  });

});

test.describe('Members Page - Invite User Modal', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoInvite();
    await sidepanel.membersPage.waitForPage();
  });

  test('TC-MEM-06: Invite User button is visible in sidebar', async ({ sidepanel }) => {
    await expect(sidepanel.membersPage.inviteUserButton).toBeVisible();
  });

  test('TC-MEM-07: Clicking Invite User button opens modal', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    const isVisible = await sidepanel.membersPage.isInviteModalVisible();
    expect(isVisible).toBe(true);
  });

  test('TC-MEM-08: Invite modal heading and description are visible', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    await expect(sidepanel.membersPage.inviteModalHeading).toBeVisible();
    await expect(sidepanel.membersPage.inviteModalDescription).toBeVisible();
  });

  test('TC-MEM-09: Invite modal email input is visible and empty by default', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    await expect(sidepanel.membersPage.inviteEmailInput).toBeVisible();
    const emailValue = await sidepanel.membersPage.getEmailValue();
    expect(emailValue).toBe('');
  });

  test('TC-MEM-10: Invite modal Cancel and Send Invite buttons are visible', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    await expect(sidepanel.membersPage.inviteCancelButton).toBeVisible();
    await expect(sidepanel.membersPage.inviteSendButton).toBeVisible();
  });

  test('TC-MEM-11: Send Invite button is disabled when email is empty', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    const isDisabled = await sidepanel.membersPage.isSendButtonDisabled();
    expect(isDisabled).toBe(true);
  });

  test('TC-MEM-12: Send Invite button is enabled after entering a valid email', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    await sidepanel.membersPage.fillEmail('test@example.com');
    const isDisabled = await sidepanel.membersPage.isSendButtonDisabled();
    expect(isDisabled).toBe(false);
  });

  test('TC-MEM-13: Clearing email disables Send Invite button again', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    await sidepanel.membersPage.fillEmail('test@example.com');
    const isEnabledAfterFill = await sidepanel.membersPage.isSendButtonDisabled();
    expect(isEnabledAfterFill).toBe(false);

    await sidepanel.membersPage.clearEmail();
    const isDisabledAfterClear = await sidepanel.membersPage.isSendButtonDisabled();
    expect(isDisabledAfterClear).toBe(true);
  });

  test('TC-MEM-14: Cancel button closes the invite modal', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    const isVisibleBefore = await sidepanel.membersPage.isInviteModalVisible();
    expect(isVisibleBefore).toBe(true);

    await sidepanel.membersPage.clickCancel();
    await sidepanel.membersPage.inviteModalContainer.waitFor({ state: 'hidden' });

    const isVisibleAfter = await sidepanel.membersPage.isInviteModalVisible();
    expect(isVisibleAfter).toBe(false);
  });

  test('TC-MEM-15: Email input accepts text input', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    const testEmail = 'user@company.com';
    await sidepanel.membersPage.fillEmail(testEmail);
    const emailValue = await sidepanel.membersPage.getEmailValue();
    expect(emailValue).toBe(testEmail);
  });

  test('TC-MEM-16: Email input has correct placeholder', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    await expect(sidepanel.membersPage.inviteEmailInput).toHaveAttribute('placeholder', 'Enter email address');
  });

  test('TC-MEM-17: Email input has type email', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    await expect(sidepanel.membersPage.inviteEmailInput).toHaveAttribute('type', 'email');
  });

  test('TC-MEM-18: Cancel button is enabled while not inviting', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    const isDisabled = await sidepanel.membersPage.isCancelButtonDisabled();
    expect(isDisabled).toBe(false);
  });

  test('TC-MEM-19: Modal can be reopened after closing', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    await sidepanel.membersPage.clickCancel();
    await sidepanel.membersPage.inviteModalContainer.waitFor({ state: 'hidden' });

    await sidepanel.membersPage.openInviteModal();
    const isVisible = await sidepanel.membersPage.isInviteModalVisible();
    expect(isVisible).toBe(true);
  });

  test('TC-MEM-20: Email field is cleared after closing and reopening modal', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteModal();
    await sidepanel.membersPage.fillEmail('test@example.com');
    await sidepanel.membersPage.clickCancel();
    await sidepanel.membersPage.inviteModalContainer.waitFor({ state: 'hidden' });

    await sidepanel.membersPage.openInviteModal();
    const emailValue = await sidepanel.membersPage.getEmailValue();
    expect(emailValue).toBe('');
  });

});

test.describe.serial('Members Page - Member Management Flow', () => {

  test('TC-MEM-21: Role dropdown has 4 options (Editor, Viewer, Admin, Guest)', async ({ sidepanel }) => {
    const page = sidepanel.page;
    await sidepanel.gotoInvite();
    const container = page.locator('#userProxyContainer');
    await container.locator('proxy-user-management').first().waitFor({ state: 'attached', timeout: 30000 });
    const inviteBtn = container.locator('button:has-text("Invite Member")').first();
    await inviteBtn.waitFor({ state: 'visible', timeout: 30000 });

    await inviteBtn.click();
    await page.waitForTimeout(1500);

    const roleSelect = page.locator('mat-form-field').filter({ has: page.locator('mat-label', { hasText: 'Role' }) }).locator('mat-select').first();
    await roleSelect.click();
    await page.locator('.mat-select-panel').waitFor({ state: 'visible', timeout: 5000 });

    const roleOptions = page.locator('.mat-select-panel mat-option');
    await expect(roleOptions).toHaveCount(4);

    const roleNames = await roleOptions.allInnerTexts();
    expect(roleNames.some(t => t.includes('Editor'))).toBe(true);
    expect(roleNames.some(t => t.includes('Viewer'))).toBe(true);
    expect(roleNames.some(t => t.includes('Admin'))).toBe(true);
    expect(roleNames.some(t => t.includes('Guest'))).toBe(true);

    await page.keyboard.press('Escape');
  });

  test('TC-MEM-22: Invite member with Viewer role', async ({ sidepanel }) => {
    const page = sidepanel.page;
    await sidepanel.gotoInvite();
    const container = page.locator('#userProxyContainer');
    await container.locator('proxy-user-management').first().waitFor({ state: 'attached', timeout: 30000 });
    const inviteBtn = container.locator('button:has-text("Invite Member")').first();
    await inviteBtn.waitFor({ state: 'visible', timeout: 30000 });

    await inviteBtn.click();
    await page.waitForTimeout(1500);

    const nameInput = page.locator('mat-form-field').filter({ has: page.locator('mat-label', { hasText: 'Name' }) }).locator('input').first();
    await nameInput.fill('example');
    await expect(nameInput).toHaveValue('example');

    const emailInput = page.locator('mat-form-field').filter({ has: page.locator('mat-label', { hasText: 'Email' }) }).locator('input').first();
    await emailInput.fill('example@gmail.com');
    await expect(emailInput).toHaveValue('example@gmail.com');

    const mobileInput = page.locator('input[type="tel"]').first();
    await mobileInput.fill('911234567890');
    await expect(mobileInput).toHaveValue('911234567890');

    const roleSelect = page.locator('mat-form-field').filter({ has: page.locator('mat-label', { hasText: 'Role' }) }).locator('mat-select').first();
    await roleSelect.click();
    await page.locator('.mat-select-panel').waitFor({ state: 'visible', timeout: 5000 });
    await page.locator('.mat-select-panel mat-option').filter({ hasText: 'Viewer' }).click();
    await page.waitForTimeout(500);

    await page.locator('button:has-text("Add Member")').first().click();
    await page.waitForTimeout(3000);

    const memberRow = container.locator('.user-item').filter({ hasText: 'example' }).first();
    await expect(memberRow).toBeVisible({ timeout: 10000 });
    await expect(memberRow.locator('.user-email')).toContainText('example@gmail.com');
  });

  test('TC-MEM-23: Edit member - select all additional permissions', async ({ sidepanel }) => {
    const page = sidepanel.page;
    await sidepanel.gotoInvite();
    const container = page.locator('#userProxyContainer');
    await container.locator('proxy-user-management').first().waitFor({ state: 'attached', timeout: 30000 });
    await container.locator('button:has-text("Invite Member")').first().waitFor({ state: 'visible', timeout: 30000 });

    const memberRow = container.locator('.user-item').filter({ hasText: 'example' }).first();
    await expect(memberRow).toBeVisible({ timeout: 10000 });

    await memberRow.hover();
    await memberRow.locator('button:has-text("Edit")').waitFor({ state: 'visible' });
    await memberRow.locator('button:has-text("Edit")').click();
    await page.waitForTimeout(1500);

    const permissionCombobox = page.getByRole('combobox', { name: 'Additional Permissions' });
    await permissionCombobox.click();
    await page.waitForTimeout(500);

    const permissionListbox = page.getByRole('listbox', { name: 'Additional Permissions' });
    await permissionListbox.waitFor({ state: 'visible', timeout: 5000 });
    const permissionOptions = permissionListbox.getByRole('option');
    const permissionCount = await permissionOptions.count();
    for (let i = 0; i < permissionCount; i++) {
      const option = permissionOptions.nth(i);
      const isSelected = await option.getAttribute('aria-selected');
      if (isSelected !== 'true') {
        await option.dispatchEvent('click');
        await page.waitForTimeout(200);
      }
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Update member' }).click();
    await page.waitForTimeout(3000);
  });

  test('TC-MEM-24: Remove member from the list', async ({ sidepanel }) => {
    const page = sidepanel.page;
    await sidepanel.gotoInvite();
    const container = page.locator('#userProxyContainer');
    await container.locator('proxy-user-management').first().waitFor({ state: 'attached', timeout: 30000 });
    await container.locator('button:has-text("Invite Member")').first().waitFor({ state: 'visible', timeout: 30000 });

    const memberRow = container.locator('.user-item').filter({ hasText: 'example' }).first();
    await expect(memberRow).toBeVisible({ timeout: 10000 });

    await memberRow.hover();
    await memberRow.locator('button:has-text("Remove")').waitFor({ state: 'visible' });
    await memberRow.locator('button:has-text("Remove")').click();
    await page.waitForTimeout(1000);

    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button.btn-danger:has-text("Remove")');
    if (await confirmButton.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmButton.first().click();
    }
    await page.waitForTimeout(3000);

    await expect(container.locator('.user-item').filter({ hasText: 'example@gmail.com' })).not.toBeVisible({ timeout: 10000 });
  });

});
