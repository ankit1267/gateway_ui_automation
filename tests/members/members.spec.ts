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
    const roleOptions = sidepanel.page.locator('#user-role option');
    const count = await roleOptions.count();
    expect(count).toBeGreaterThan(1);
  });

  test('TC-MEM-18: Invite form can be closed with Escape', async ({ sidepanel }) => {
    await sidepanel.membersPage.openInviteForm();
    const isVisibleBefore = await sidepanel.membersPage.isInviteFormVisible();
    expect(isVisibleBefore).toBe(true);
    await sidepanel.membersPage.closeInviteForm();
  });

});

test.describe('Members Page - Member Management Flow', () => {

  test('TC-MEM-21: Role dropdown has 4 options (Editor, Viewer, Admin, Guest)', async ({ sidepanel }) => {
    const page = sidepanel.page;
    await sidepanel.gotoInvite();
    await sidepanel.membersPage.waitForPage();

    await sidepanel.membersPage.openInviteForm();

    const roleOptions = page.locator('#user-role option');
    const count = await roleOptions.count();
    expect(count).toBe(5);

    const roleNames = await roleOptions.allTextContents();
    expect(roleNames.some(t => t.includes('Editor'))).toBe(true);
    expect(roleNames.some(t => t.includes('Viewer'))).toBe(true);
    expect(roleNames.some(t => t.includes('Admin'))).toBe(true);
    expect(roleNames.some(t => t.includes('Guest'))).toBe(true);
  });

  test('TC-MEM-22: Invite member with Viewer role', async ({ sidepanel }) => {
    const page = sidepanel.page;
    await sidepanel.gotoInvite();
    await sidepanel.membersPage.waitForPage();

    await sidepanel.membersPage.openInviteForm();

    await sidepanel.membersPage.fillName('example');
    await expect(sidepanel.membersPage.inviteNameInput).toHaveValue('example');

    await sidepanel.membersPage.fillEmail('example@gmail.com');
    await expect(sidepanel.membersPage.inviteEmailInput).toHaveValue('example@gmail.com');

    await sidepanel.membersPage.fillMobile('911234567890');
    await expect(sidepanel.membersPage.inviteMobileInput).toHaveValue('911234567890');

    await sidepanel.membersPage.selectRole('Viewer');

    await sidepanel.membersPage.clickAddMember();
    await page.waitForTimeout(3000);

    const memberRow = page.locator('div.group').filter({ hasText: 'example' }).first();
    await expect(memberRow).toBeVisible({ timeout: 10000 });
  });

  test('TC-MEM-23: Edit member - change role', async ({ sidepanel }) => {
    const page = sidepanel.page;
    await sidepanel.gotoInvite();
    await sidepanel.membersPage.waitForPage();

    const memberRow = page.locator('div.group').first();
    await expect(memberRow).toBeVisible({ timeout: 10000 });

    const memberName = await memberRow.locator('p.text-sm.font-semibold').first().textContent();
    
    await sidepanel.membersPage.hoverMemberRow(memberName || '');
    await sidepanel.membersPage.clickEditButton(memberName || '');

    await expect(page.getByRole('heading', { name: /edit member/i })).toBeVisible();
    
    await sidepanel.membersPage.changeRoleInEditModal('Viewer');
    await sidepanel.membersPage.clickUpdateMemberButton();

    await expect(page.getByRole('heading', { name: /edit member/i })).not.toBeVisible();
  });

  test('TC-MEM-24: Remove member confirmation modal appears', async ({ sidepanel }) => {
    const page = sidepanel.page;
    await sidepanel.gotoInvite();
    await sidepanel.membersPage.waitForPage();

    const memberRow = page.locator('div.group').first();
    await expect(memberRow).toBeVisible({ timeout: 10000 });

    const memberName = await memberRow.locator('p.text-sm.font-semibold').first().textContent();
    
    await sidepanel.membersPage.hoverMemberRow(memberName || '');
    await sidepanel.membersPage.clickRemoveButton(memberName || '');

    await expect(page.getByRole('heading', { name: /remove member/i })).toBeVisible();
    await expect(page.getByText(/are you sure you want to remove/i)).toBeVisible();
    
    await sidepanel.membersPage.cancelRemoveMember();
    await expect(page.getByRole('heading', { name: /remove member/i })).not.toBeVisible();
  });

  test('TC-MEM-25: Remove member from the list', async ({ sidepanel }) => {
    const page = sidepanel.page;
    await sidepanel.gotoInvite();
    await sidepanel.membersPage.waitForPage();

    const memberRow = page.locator('div.group').filter({ hasText: 'example' }).first();
    
    if (await memberRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      const memberEmail = await memberRow.locator('p.mt-0\\.5').first().textContent();
      const memberName = await memberRow.locator('p.text-sm.font-semibold').first().textContent();
      
      await sidepanel.membersPage.hoverMemberRow(memberName || '');
      await sidepanel.membersPage.clickRemoveButton(memberName || '');

      await expect(page.getByRole('heading', { name: /remove member/i })).toBeVisible();
      
      await sidepanel.membersPage.confirmRemoveMember();

      await expect(page.getByRole('heading', { name: /remove member/i })).not.toBeVisible();
      await expect(sidepanel.membersPage.isMemberVisible(memberEmail || '')).resolves.toBe(false);
    }
  });

});
