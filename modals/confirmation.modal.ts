import type { Page, Locator } from '@playwright/test';

export class ConfirmationModal {
  readonly container: Locator;
  readonly cancelButton: Locator;
  readonly confirmButton: Locator;
  readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.container = page.getByTestId('confirmation-modal-container');
    this.cancelButton = page.getByTestId('confirmation-modal-cancel-button');
    this.confirmButton = page.getByTestId('confirmation-modal-confirm-button');
    this.closeButton = this.container.locator('button.btn-circle');
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible();
  }

  async waitForVisible() {
    await this.container.waitFor({ state: 'visible' });
  }

  async waitForHidden() {
    await this.container.waitFor({ state: 'hidden' });
  }

  async confirm() {
    await this.confirmButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async close() {
    await this.closeButton.click();
  }

  async getTitle(): Promise<string> {
    return this.container.locator('h3').innerText();
  }

  async getMessage(): Promise<string> {
    return this.container.locator('p').innerText();
  }

  async isConfirmDisabled(): Promise<boolean> {
    return this.confirmButton.isDisabled();
  }

  async isCancelDisabled(): Promise<boolean> {
    return this.cancelButton.isDisabled();
  }
}
