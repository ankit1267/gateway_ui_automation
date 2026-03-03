import type { Page, Locator } from '@playwright/test';

export class DeleteVersionModal {
  private readonly modal: Locator;
  private readonly confirmButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('DELETE_VERSION_MODAL');
    this.confirmButton = this.modal.getByTestId('delete-modal-confirm-button').first();
  }

  async confirm() {
    await this.confirmButton.click();
  }

  getModal(): Locator {
    return this.modal;
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
}
