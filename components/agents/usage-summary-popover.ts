import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class UsageSummaryPopover {
  private readonly limitInput: Locator;
  private readonly updateButton: Locator;
  private readonly resetButton: Locator;

  constructor(private readonly page: Page) {
    this.limitInput = page.getByPlaceholder('Enter limit in $');
    this.updateButton = page.getByRole('button', { name: 'Save Limits' });
    this.resetButton = page.getByRole('button', { name: 'Reset Usage' });
  }

  async waitForVisible() {
    await this.limitInput.waitFor({ state: 'visible' });
  }

  async fillLimit(value: string) {
    await this.limitInput.fill(value);
  }

  async getLimitValue(): Promise<string> {
    return this.limitInput.inputValue();
  }

  async expectUpdateButtonVisible() {
    await expect(this.updateButton).toBeVisible({ timeout: 10000 });
  }

  async expectUpdateButtonEnabled() {
    await expect(this.updateButton).toBeEnabled({ timeout: 10000 });
  }

  async clickUpdateLimit() {
    await this.updateButton.click();
  }

  async clickResetUsage() {
    await this.resetButton.click();
  }
}
