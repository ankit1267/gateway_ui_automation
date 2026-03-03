import type { Page, Locator } from '@playwright/test';

export class CreateNewBridgeModal {
  readonly page: Page;
  readonly closeButton: Locator;
  readonly cancelButton: Locator;
  readonly submitButton: Locator;
  readonly purposeTextarea: Locator;
  readonly globalError: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.closeButton = page.getByTestId('create-new-bridge-close-button');
    this.cancelButton = page.getByTestId('create-new-bridge-cancel-button');
    this.submitButton = page.getByTestId('create-new-bridge-submit-button');
    this.purposeTextarea = page.getByPlaceholder(
      'e.g., A customer support agent that helps users with product inquiries and troubleshooting...'
    );
    this.globalError = page.locator('#create-new-bridge-global-error');
    this.heading = page.getByRole('heading', { name: 'Create New Agent' });
  }

  async isVisible(): Promise<boolean> {
    return this.heading.isVisible();
  }

  async waitForVisible() {
    await this.heading.waitFor({ state: 'visible' });
  }

  async fillPurpose(purpose: string) {
    await this.purposeTextarea.fill(purpose);
  }

  async getPurposeValue(): Promise<string> {
    return this.purposeTextarea.inputValue();
  }

  async clearPurpose() {
    await this.purposeTextarea.clear();
  }

  async submit() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async close() {
    await this.closeButton.click();
  }

  async createAgent(purpose: string) {
    await this.fillPurpose(purpose);
    await this.submit();
  }

  async isSubmitDisabled(): Promise<boolean> {
    return this.submitButton.isDisabled();
  }

  async isGlobalErrorVisible(): Promise<boolean> {
    return this.globalError.isVisible();
  }

  async getGlobalErrorText(): Promise<string> {
    return this.globalError.innerText();
  }
}
