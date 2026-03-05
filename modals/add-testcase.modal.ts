import type { Page, Locator } from '@playwright/test';

export class AddTestCaseModal {
  private readonly modal: Locator;
  private readonly inputTextarea: Locator;
  private readonly expectedTextarea: Locator;
  private readonly submitButton: Locator;
  private readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('ADD_TEST_CASE_MODAL');
    this.inputTextarea = this.modal.getByRole('textbox', { name: /input/i });
    this.expectedTextarea = this.modal.getByRole('textbox', { name: /expected/i });
    this.submitButton = page.getByTestId('add-testcase-create-button');
    this.cancelButton = page.getByTestId('add-testcase-cancel-button');
  }

  async fillInput(input: string) {
    await this.inputTextarea.fill(input);
  }

  async fillExpected(expected: string) {
    await this.expectedTextarea.fill(expected);
  }

  async submit() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async addTestCase(input: string, expected: string) {
    await this.fillInput(input);
    await this.fillExpected(expected);
    await this.submit();
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async getInputValue(): Promise<string> {
    return this.inputTextarea.inputValue();
  }

  async getExpectedValue(): Promise<string> {
    return this.expectedTextarea.inputValue();
  }

  async clearInput() {
    await this.inputTextarea.clear();
  }

  async clearExpected() {
    await this.expectedTextarea.clear();
  }

  getModal(): Locator {
    return this.modal;
  }
}
