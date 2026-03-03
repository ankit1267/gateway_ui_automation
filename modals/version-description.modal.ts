import type { Page, Locator } from '@playwright/test';

export class VersionDescriptionModal {
  private readonly container: Locator;
  private readonly descriptionInput: Locator;
  private readonly closeButton: Locator;
  private readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.container = page.getByTestId('version-description-modal-container');
    this.descriptionInput = page.getByTestId('version-description-input');
    this.closeButton = page.getByTestId('version-description-close-button');
    this.createButton = page.getByTestId('version-description-create-button');
  }

  async fillDescription(desc: string) {
    await this.descriptionInput.fill(desc);
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async clickClose() {
    await this.closeButton.click();
  }

  async createVersion(desc: string) {
    await this.fillDescription(desc);
    await this.clickCreate();
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible();
  }

  async waitForVisible() {
    await this.container.waitFor({ state: 'visible' });
  }

  async getDescriptionValue(): Promise<string> {
    return this.descriptionInput.inputValue();
  }

  async clearDescription() {
    await this.descriptionInput.clear();
  }

  getContainer(): Locator {
    return this.container;
  }
}
