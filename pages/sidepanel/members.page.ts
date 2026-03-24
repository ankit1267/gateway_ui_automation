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

  constructor(page: Page) {
    this.page = page;
    this.userProxyContainer = page.locator('#userProxyContainer');
    this.proxyComponent = this.userProxyContainer.locator('proxy-user-management').first();
    this.inviteUserButton = this.userProxyContainer.locator('button:has-text("Invite Member")').first();
    this.inviteNameInput = page.locator('mat-form-field').filter({ has: page.locator('mat-label', { hasText: 'Name' }) }).locator('input').first();
    this.inviteEmailInput = page.locator('mat-form-field').filter({ has: page.locator('mat-label', { hasText: 'Email' }) }).locator('input').first();
    this.inviteMobileInput = page.locator('input[type="tel"]').first();
    this.inviteRoleSelect = page.locator('mat-form-field').filter({ has: page.locator('mat-label', { hasText: 'Role' }) }).locator('mat-select').first();
    this.addMemberButton = page.locator('button:has-text("Add Member")').first();
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/invite`);
    await this.page.waitForURL(`/org/${orgId}/invite`);
  }

  async waitForPage() {
    await this.proxyComponent.waitFor({ state: 'attached', timeout: 30000 });
    await this.inviteUserButton.waitFor({ state: 'visible', timeout: 30000 });
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
    await this.inviteRoleSelect.click();
    await this.page.locator('.mat-select-panel').waitFor({ state: 'visible', timeout: 5000 });
    await this.page.locator('.mat-select-panel mat-option').filter({ hasText: roleName }).click();
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
}
