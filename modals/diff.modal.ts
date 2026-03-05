import type { Page, Locator } from '@playwright/test';

export class DiffModal {
  private readonly modal: Locator;
  private readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('DIFF_PROMPT');
    this.closeButton = page.getByTestId('diff-modal-close-button');
  }

  getModal(): Locator {
    return this.modal;
  }

  async close() {
    await this.closeButton.click();
  }

  async getDiffTexts(sectionName: string) {
    const card = this.modal
      .locator('h4', { hasText: sectionName })
      .locator('xpath=ancestor::div[contains(@class,"card")]');

    const texts = await card
      .locator('.font-mono span:nth-child(2)')
      .allTextContents();

    return {
      published: texts[0]?.trim(),
      current: texts[1]?.trim()
    };
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async getSectionNames(): Promise<string[]> {
    return this.modal.locator('h4').allInnerTexts();
  }
}
