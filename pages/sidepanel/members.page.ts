import type { Page, Locator } from '@playwright/test';

export class MembersPage {
  readonly page: Page;
  readonly userProxyContainer: Locator;
  readonly proxyComponent: Locator;
  readonly inviteUserButton: Locator;
  readonly inviteNameInput: Locator;
  readonly inviteEmailInput: Locator;
  readonly inviteMobileInput: Locator;
  readonly inviteRoleSelect: Locator;
  readonly addMemberButton: Locator;
  readonly searchInput: Locator;
  readonly membersList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userProxyContainer = page.locator('#userProxyContainer');
    this.proxyComponent = this.userProxyContainer.locator('proxy-user-management').first();
    this.inviteUserButton = page.getByRole('button', { name: /invite member/i });
    this.inviteNameInput = page.locator('#user-name').first();
    this.inviteEmailInput = page.locator('#user-email').first();
    this.inviteMobileInput = page.locator('#user-mobile').first();
    this.inviteRoleSelect = page.locator('#user-role').first();
    this.addMemberButton = page.getByRole('button', { name: /add member/i });
    this.searchInput = page.locator('input[type="search"]').first();
    this.membersList = page.locator('div.group').first();
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/invite`);
    await this.page.waitForURL(`/org/${orgId}/invite`);
  }

  async waitForPage() {
    await this.inviteUserButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.searchInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async isContainerAttached(): Promise<boolean> {
    return (await this.userProxyContainer.count()) > 0;
  }

  async openInviteForm() {
    await this.inviteUserButton.click();
    await this.page.waitForTimeout(1500);
  }

  async isInviteFormVisible(): Promise<boolean> {
    return this.inviteNameInput.isVisible();
  }

  async fillName(name: string) {
    await this.inviteNameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.inviteEmailInput.fill(email);
  }

  async clearEmail() {
    await this.inviteEmailInput.clear();
  }

  async getEmailValue(): Promise<string> {
    return this.inviteEmailInput.inputValue();
  }

  async getNameValue(): Promise<string> {
    return this.inviteNameInput.inputValue();
  }

  async fillMobile(mobile: string) {
    await this.inviteMobileInput.fill(mobile);
  }

  async selectRole(roleName: string) {
    await this.inviteRoleSelect.selectOption({ label: roleName });
    await this.page.waitForTimeout(500);
  }

  async clickAddMember() {
    await this.addMemberButton.click();
  }

  async closeInviteForm() {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(500);
  }

  async isAddMemberButtonVisible(): Promise<boolean> {
    return this.addMemberButton.isVisible();
  }

  async getMemberRow(memberName: string): Promise<Locator> {
    return this.page.locator('div.group').filter({ hasText: memberName }).first();
  }

  async hoverMemberRow(memberName: string) {
    const memberRow = await this.getMemberRow(memberName);
    await memberRow.hover();
    await this.page.waitForTimeout(500);
  }

  async clickEditButton(memberName: string) {
    const memberRow = await this.getMemberRow(memberName);
    const editButton = memberRow.locator('button:has-text("Edit")').first();
    await editButton.click();
    await this.page.waitForTimeout(1500);
  }

  async clickRemoveButton(memberName: string) {
    const memberRow = await this.getMemberRow(memberName);
    const removeButton = memberRow.locator('button:has-text("Remove")').first();
    await removeButton.click();
    await this.page.waitForTimeout(1000);
  }

  async isEditMemberModalVisible(): Promise<boolean> {
    return this.page.getByRole('heading', { name: /edit member/i }).isVisible();
  }

  async isRemoveConfirmationVisible(): Promise<boolean> {
    return this.page.getByRole('heading', { name: /remove member/i }).isVisible();
  }

  async changeRoleInEditModal(roleName: string) {
    const roleSelect = this.page.locator('#user-role');
    await roleSelect.selectOption({ label: roleName });
    await this.page.waitForTimeout(500);
  }

  async clickUpdateMemberButton() {
    await this.page.getByRole('button', { name: /update member/i }).click();
    await this.page.waitForTimeout(2000);
  }

  async confirmRemoveMember() {
    const removeDialog = this.page.locator('[role="alertdialog"]');
    await removeDialog.getByRole('button', { name: /^Remove$/i }).click();
    await this.page.waitForTimeout(2000);
  }

  async cancelRemoveMember() {
    const removeDialog = this.page.locator('[role="alertdialog"]');
    await removeDialog.getByRole('button', { name: /cancel/i }).click();
    await this.page.waitForTimeout(500);
  }

  async cancelEditMember() {
    await this.page.getByRole('button', { name: /cancel/i }).click();
    await this.page.waitForTimeout(500);
  }

  async isMemberVisible(memberEmail: string): Promise<boolean> {
    return this.page.locator('div.group').filter({ hasText: memberEmail }).isVisible();
  }
}
