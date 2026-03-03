import type { Page, Locator } from '@playwright/test';

export class FineTuneModal {
  readonly page: Page;
  readonly allResponsesCheckbox: Locator;
  readonly positiveFeedbackCheckbox: Locator;
  readonly negativeFeedbackCheckbox: Locator;
  readonly closeButton: Locator;
  readonly downloadButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.allResponsesCheckbox = page.getByTestId('fine-tune-all-responses-checkbox');
    this.positiveFeedbackCheckbox = page.getByTestId('fine-tune-positive-feedback-checkbox');
    this.negativeFeedbackCheckbox = page.getByTestId('fine-tune-negative-feedback-checkbox');
    this.closeButton = page.getByTestId('fine-tune-close-button');
    this.downloadButton = page.getByTestId('fine-tune-download-button');
  }

  async toggleAllResponses() {
    await this.allResponsesCheckbox.click();
  }

  async togglePositiveFeedback() {
    await this.positiveFeedbackCheckbox.click();
  }

  async toggleNegativeFeedback() {
    await this.negativeFeedbackCheckbox.click();
  }

  async isAllResponsesChecked(): Promise<boolean> {
    return this.allResponsesCheckbox.isChecked();
  }

  async isPositiveFeedbackChecked(): Promise<boolean> {
    return this.positiveFeedbackCheckbox.isChecked();
  }

  async isNegativeFeedbackChecked(): Promise<boolean> {
    return this.negativeFeedbackCheckbox.isChecked();
  }

  async close() {
    await this.closeButton.click();
  }

  async download() {
    await this.downloadButton.click();
  }
}
