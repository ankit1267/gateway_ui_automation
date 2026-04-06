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

  test('TC-MEM-06: Invite Member button is visible', async ({ sidepanel }) => {
    await expect(sidepanel.membersPage.inviteUserButton).toBeVisible();
  });

  test('TC-MEM-07: Clicking Invite Member button opens invite form', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    const isVisible = await sidepanel.membersPage.isInviteFormVisible();
    expect(isVisible).toBe(true);
  });

  test('TC-MEM-08: Invite form shows Name, Email and Role fields', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    await expect(sidepanel.membersPage.inviteNameInput).toBeVisible();
    await expect(sidepanel.membersPage.inviteEmailInput).toBeVisible();
    await expect(sidepanel.membersPage.inviteRoleSelect).toBeVisible();
  });

  test('TC-MEM-09: Invite form email input is visible and empty by default', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    await expect(sidepanel.membersPage.inviteEmailInput).toBeVisible();
    const emailValue = await sidepanel.membersPage.getEmailValue();
    expect(emailValue).toBe('');
  });

  test('TC-MEM-10: Invite form Add Member button is visible', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    const isVisible = await sidepanel.membersPage.isAddMemberButtonVisible();
    expect(isVisible).toBe(true);
  });

  test('TC-MEM-11: Name input is empty by default', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    const nameValue = await sidepanel.membersPage.getNameValue();
    expect(nameValue).toBe('');
  });

  test('TC-MEM-12: Name input accepts text', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    await sidepanel.membersPage.fillName('Test User');
    const nameValue = await sidepanel.membersPage.getNameValue();
    expect(nameValue).toBe('Test User');
  });

  test('TC-MEM-13: Email input accepts text', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    await sidepanel.membersPage.fillEmail('test@example.com');
    const emailValue = await sidepanel.membersPage.getEmailValue();
    expect(emailValue).toBe('test@example.com');
  });

  test('TC-MEM-14: Clearing email resets the field', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    await sidepanel.membersPage.fillEmail('test@example.com');
    await sidepanel.membersPage.clearEmail();
    const emailValue = await sidepanel.membersPage.getEmailValue();
    expect(emailValue).toBe('');
  });

  test('TC-MEM-15: Mobile input accepts phone number', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    await sidepanel.membersPage.fillMobile('911234567890');
    await expect(sidepanel.membersPage.inviteMobileInput).toHaveValue('911234567890');
  });

  test('TC-MEM-16: Role dropdown is visible', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    await expect(sidepanel.membersPage.inviteRoleSelect).toBeVisible();
  });

  test('TC-MEM-17: Role dropdown has options', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    await sidepanel.membersPage.inviteRoleSelect.click();
    await sidepanel.page.locator('.mat-select-panel').waitFor({ state: 'visible', timeout: 5000 });
    const roleOptions = sidepanel.page.locator('.mat-select-panel mat-option');
    const count = await roleOptions.count();
    expect(count).toBeGreaterThan(0);
    await sidepanel.page.keyboard.press('Escape');
  });

  test('TC-MEM-18: Invite form can be closed with Escape', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    const isVisibleBefore = await sidepanel.membersPage.isInviteFormVisible();
    expect(isVisibleBefore).toBe(true);
    await sidepanel.membersPage.closeInviteForm();
  });

  test('TC-MEM-20: Fields are cleared after closing and reopening form', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    await sidepanel.membersPage.fillName('Test User');
    await sidepanel.membersPage.fillEmail('test@example.com');
    await sidepanel.membersPage.closeInviteForm();

    await sidepanel.membersPage.openInviteForm();
    const nameValue = await sidepanel.membersPage.getNameValue();
    const emailValue = await sidepanel.membersPage.getEmailValue();
    expect(nameValue).toBe('');
    expect(emailValue).toBe('');
  });

});

test.describe('Members Page - Member Management Flow', () => {

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

    const memberRow = container.locator('.user-item').first();
    await expect(memberRow).toBeVisible({ timeout: 10000 });
    await memberRow.hover();

    const editButton = memberRow.getByRole('button', { name: 'Edit' });
    await expect(editButton).toBeVisible({ timeout: 10000 });
    await editButton.click();
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
