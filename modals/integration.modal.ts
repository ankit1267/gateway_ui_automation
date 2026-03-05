import type { Page, Locator } from '@playwright/test';

export class IntegrationModal {
  private readonly modal: Locator;
  private readonly container: Locator;
  private readonly nameInput: Locator;
  private readonly closeButton: Locator;
  private readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('INTEGRATION_MODAL');
    this.container = page.locator('#integration-modal-container');
    this.nameInput = page.getByTestId('integration-name-input');
    this.closeButton = page.getByTestId('integration-close-button');
    this.createButton = page.getByTestId('integration-create-button');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async clickClose() {
    await this.closeButton.click();
  }

  async createIntegration(name: string) {
    await this.fillName(name);
    await this.clickCreate();
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

  async getNameValue(): Promise<string> {
    return this.nameInput.inputValue();
  }

  async clearName() {
    await this.nameInput.clear();
  }

  getContainer(): Locator {
    return this.container;
  }
}
