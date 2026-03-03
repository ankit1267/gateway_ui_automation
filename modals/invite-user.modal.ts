import type { Page, Locator } from '@playwright/test';

export class InviteUserModal {
  private readonly modal: Locator;
  private readonly emailInput: Locator;
  private readonly roleSelect: Locator;
  private readonly inviteButton: Locator;
  private readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('INVITE_USER');
    this.emailInput = this.modal.getByRole('textbox', { name: /email/i });
    this.roleSelect = this.modal.getByRole('combobox');
    this.inviteButton = this.modal.getByRole('button', { name: /invite/i });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async selectRole(role: string) {
    await this.roleSelect.selectOption(role);
  }

  async clickInvite() {
    await this.inviteButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async inviteUser(email: string, role?: string) {
    await this.fillEmail(email);
    if (role) await this.selectRole(role);
    await this.clickInvite();
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async getEmailValue(): Promise<string> {
    return this.emailInput.inputValue();
  }

  async clearEmail() {
    await this.emailInput.clear();
  }

  getModal(): Locator {
    return this.modal;
  }
}
