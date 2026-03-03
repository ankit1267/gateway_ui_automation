import type { Page, Locator } from '@playwright/test';

export class HistoryPromptModal {
  readonly page: Page;
  readonly regenerateButton: Locator;
  readonly previousTextarea: Locator;
  readonly updatedTextarea: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.regenerateButton = page.getByTestId('history-prompt-regenerate-button');
    this.previousTextarea = page.getByTestId('history-prompt-previous-textarea');
    this.updatedTextarea = page.getByTestId('history-prompt-updated-textarea');
    this.cancelButton = page.getByTestId('history-prompt-cancel-button');
    this.saveButton = page.getByTestId('history-prompt-save-button');
  }

  async getPreviousPrompt(): Promise<string> {
    return this.previousTextarea.inputValue();
  }

  async getUpdatedPrompt(): Promise<string> {
    return this.updatedTextarea.inputValue();
  }

  async fillUpdatedPrompt(text: string) {
    await this.updatedTextarea.fill(text);
  }

  async clearUpdatedPrompt() {
    await this.updatedTextarea.clear();
  }

  async regenerate() {
    await this.regenerateButton.click();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async isRegenerateVisible(): Promise<boolean> {
    return this.regenerateButton.isVisible();
  }

  async isPreviousReadonly(): Promise<boolean> {
    const readonly = await this.previousTextarea.getAttribute('readonly');
    return readonly !== null;
  }
}
