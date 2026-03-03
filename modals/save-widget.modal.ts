import type { Page, Locator } from '@playwright/test';

export class SaveWidgetModal {
  private readonly modal: Locator;
  private readonly nameInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('SAVE_WIDGET_MODAL');
    this.nameInput = this.modal.getByRole('textbox', { name: /name/i });
    this.descriptionInput = this.modal.getByRole('textbox', { name: /description/i });
    this.saveButton = this.modal.getByRole('button', { name: /save/i });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async saveWidget(name: string, description?: string) {
    await this.fillName(name);
    if (description) await this.fillDescription(description);
    await this.clickSave();
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async getNameValue(): Promise<string> {
    return this.nameInput.inputValue();
  }

  async getDescriptionValue(): Promise<string> {
    return this.descriptionInput.inputValue();
  }

  async clearName() {
    await this.nameInput.clear();
  }

  async clearDescription() {
    await this.descriptionInput.clear();
  }

  getModal(): Locator {
    return this.modal;
  }
}
