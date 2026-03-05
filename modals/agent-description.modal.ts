import type { Page, Locator } from '@playwright/test';

export class AgentDescriptionModal {
  private readonly modal: Locator;
  private readonly descriptionTextarea: Locator;
  private readonly cancelButton: Locator;
  private readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('AGENT_DESCRIPTION_MODAL');
    this.descriptionTextarea = page.getByTestId('agent-description-textarea');
    this.cancelButton = page.getByTestId('agent-description-cancel-button');
    this.saveButton = page.getByTestId('agent-description-save-button');
  }

  async fillDescription(description: string) {
    await this.descriptionTextarea.fill(description);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async saveDescription(description: string) {
    await this.fillDescription(description);
    await this.clickSave();
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

  async getDescriptionValue(): Promise<string> {
    return this.descriptionTextarea.inputValue();
  }

  async clearDescription() {
    await this.descriptionTextarea.clear();
  }
}
