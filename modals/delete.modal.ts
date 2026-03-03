import type { Page, Locator } from '@playwright/test';

export class DeleteModal {
  private readonly modal: Locator;
  private readonly content: Locator;
  private readonly confirmButton: Locator;
  private readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('DELETE_MODAL');
    this.content = page.getByTestId('delete-modal-content');
    this.confirmButton = page.getByTestId('delete-modal-confirm-button');
    this.cancelButton = page.getByTestId('delete-modal-cancel-button');
  }

  async confirm() {
    await this.confirmButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async waitForHidden() {
    await this.modal.waitFor({ state: 'hidden' });
  }

  async getTitle(): Promise<string> {
    return this.modal.getByRole('heading').innerText();
  }

  async getDescription(): Promise<string> {
    return this.modal.locator('p').innerText();
  }

  getModal(): Locator {
    return this.modal;
  }

  async isConfirmDisabled(): Promise<boolean> {
    return this.confirmButton.isDisabled();
  }

  async isCancelDisabled(): Promise<boolean> {
    return this.cancelButton.isDisabled();
  }

  async isContentVisible(): Promise<boolean> {
    return this.content.isVisible();
  }
}
