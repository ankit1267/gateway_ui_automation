import type { Page, Locator } from '@playwright/test';

export class UsageLimitModal {
  private readonly modal: Locator;
  private readonly limitInput: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('API_KEY_LIMIT_MODAL');
    this.limitInput = page.getByTestId('usage-limit-input');
    this.saveButton = page.getByTestId('usage-limit-save-button');
    this.cancelButton = page.getByTestId('usage-limit-cancel-button');
  }

  async fillLimit(limit: string) {
    await this.limitInput.fill(limit);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async setLimit(limit: string) {
    await this.fillLimit(limit);
    await this.clickSave();
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async getLimitValue(): Promise<string> {
    return this.limitInput.inputValue();
  }

  async clearLimit() {
    await this.limitInput.clear();
  }

  getModal(): Locator {
    return this.modal;
  }
}
