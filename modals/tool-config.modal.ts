import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class ToolConfigModal {
  private readonly modal: Locator;
  private readonly modeSelect: Locator;
  private readonly oldDataCheckbox: Locator;
  private readonly jsonTextarea: Locator;
  private readonly oldFieldsTextarea: Locator;
  private readonly nameDescToggle: Locator;
  private readonly nameInput: Locator;
  private readonly descTextarea: Locator;
  private readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('tool-function-parameter-modal');
    this.modeSelect = this.modal.locator('#function-param-mode-select');
    this.oldDataCheckbox = this.modal.locator('#function-param-old-data-checkbox');
    this.jsonTextarea = this.modal.locator('#function-param-json-textarea');
    this.oldFieldsTextarea = this.modal.locator('#function-param-old-fields-textarea');
    this.nameDescToggle = this.modal.locator('#function-param-name-desc-toggle');
    this.nameInput = this.modal.locator('#function-param-name-input');
    this.descTextarea = this.modal.locator('#function-param-desc-textarea');
    this.closeButton = this.modal.locator('#function-param-close-button');
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async selectAdvancedMode() {
    await this.modeSelect.selectOption('advanced');
  }

  async expectOldDataCheckboxVisible() {
    await expect(this.oldDataCheckbox).toBeVisible({ timeout: 10000 });
  }

  async checkOldData() {
    await this.oldDataCheckbox.check();
  }

  async expectBothTextareasVisible() {
    await expect(this.jsonTextarea).toBeVisible({ timeout: 10000 });
    await expect(this.oldFieldsTextarea).toBeVisible({ timeout: 10000 });
  }

  async clickNameDescToggle() {
    await this.nameDescToggle.click();
  }

  async expectNameAndDescriptionVisible() {
    await expect(this.nameInput).toBeVisible({ timeout: 10000 });
    await expect(this.descTextarea).toBeVisible({ timeout: 10000 });
  }

  async close() {
    await this.closeButton.click();
  }

  getModal(): Locator {
    return this.modal;
  }
}
