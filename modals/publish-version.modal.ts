import type { Page, Locator } from '@playwright/test';

export class PublishVersionModal {
  private readonly modal: Locator;
  private readonly descriptionInput: Locator;
  private readonly createButton: Locator;
  private readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByRole('dialog');
    this.descriptionInput = page.getByRole('textbox', { name: 'Enter version description' });
    this.createButton = this.modal.getByTestId('version-description-create-button');
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  async fillDescription(desc: string) {
    await this.descriptionInput.fill(desc);
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async createVersion(desc: string) {
    await this.fillDescription(desc);
    await this.clickCreate();
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async getDescriptionValue(): Promise<string> {
    return this.descriptionInput.inputValue();
  }

  async clearDescription() {
    await this.descriptionInput.clear();
  }

  getModal(): Locator {
    return this.modal;
  }
}
