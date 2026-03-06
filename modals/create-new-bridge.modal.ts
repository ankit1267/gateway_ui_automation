import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class CreateNewBridgeModal {
  private readonly modal: Locator;
  private readonly container: Locator;
  readonly closeButton: Locator;
  readonly cancelButton: Locator;
  readonly submitButton: Locator;
  readonly purposeTextarea: Locator;
  readonly globalError: Locator;
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('CREATE_BRIDGE_MODAL');
    this.container = page.getByTestId('create-new-bridge-modal-container');
    this.closeButton = page.getByTestId('create-new-bridge-close-button');
    this.cancelButton = page.getByTestId('create-new-bridge-cancel-button');
    this.submitButton = page.getByTestId('create-new-bridge-submit-button').first();
    this.purposeTextarea = page.getByTestId('agent-purpose').first();
    this.globalError = page.getByTestId('create-new-bridge-error-alert');
    this.heading = page.getByRole('heading', { name: 'Create New Agent' });
  }

  // ── Visibility ────────────────────────────────────────────────────────────

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async waitForHidden() {
    await this.modal.waitFor({ state: 'hidden' });
  }

  async expectVisible() {
    await expect(this.modal).toBeVisible();
  }

  async expectHidden() {
    await expect(this.modal).toBeHidden();
  }

  // ── Purpose textarea ──────────────────────────────────────────────────────

  async fillPurpose(purpose: string) {
    await this.purposeTextarea.fill(purpose);
  }

  async getPurposeValue(): Promise<string> {
    return this.purposeTextarea.inputValue();
  }

  async clearPurpose() {
    await this.purposeTextarea.clear();
  }

  async isPurposeVisible(): Promise<boolean> {
    return this.purposeTextarea.isVisible();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async submit() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async close() {
    await this.closeButton.click();
  }

  /** Fill purpose (optional) then submit. */
  async createAgent(purpose?: string) {
    if (purpose) {
      await this.fillPurpose(purpose);
    }
    await this.submit();
  }

  // ── State checks ──────────────────────────────────────────────────────────

  async isSubmitDisabled(): Promise<boolean> {
    return this.submitButton.isDisabled();
  }

  async isGlobalErrorVisible(): Promise<boolean> {
    return this.globalError.isVisible();
  }

  async getGlobalErrorText(): Promise<string> {
    return this.globalError.innerText();
  }

  getModal(): Locator {
    return this.modal;
  }
}
