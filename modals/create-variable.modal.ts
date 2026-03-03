import type { Page, Locator } from '@playwright/test';

export class CreateVariableModal {
  private readonly keyInput: Locator;
  private readonly valueInput: Locator;
  private readonly closeButton: Locator;
  private readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.keyInput = page.getByTestId('create-variable-key-input');
    this.valueInput = page.getByTestId('create-variable-value-input');
    this.closeButton = page.getByTestId('create-variable-close-button');
    this.createButton = page.getByTestId('create-variable-create-button');
  }

  async fillKey(key: string) {
    await this.keyInput.fill(key);
  }

  async fillValue(value: string) {
    await this.valueInput.fill(value);
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async clickClose() {
    await this.closeButton.click();
  }

  async createVariable(key: string, value: string) {
    await this.fillKey(key);
    await this.fillValue(value);
    await this.clickCreate();
  }

  async isVisible(): Promise<boolean> {
    return this.keyInput.isVisible();
  }

  async waitForVisible() {
    await this.keyInput.waitFor({ state: 'visible' });
  }

  async getKeyValue(): Promise<string> {
    return this.keyInput.inputValue();
  }

  async getValueValue(): Promise<string> {
    return this.valueInput.inputValue();
  }

  async clearKey() {
    await this.keyInput.clear();
  }

  async clearValue() {
    await this.valueInput.clear();
  }
}
