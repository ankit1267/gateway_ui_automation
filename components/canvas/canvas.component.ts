import type { Page, Locator } from '@playwright/test';

export class CanvasComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly resetChatButton: Locator;
  readonly emptyState: Locator;
  readonly loadingState: Locator;
  readonly instructionTextarea: Locator;
  readonly sendButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('canvas-container');
    this.resetChatButton = page.getByTestId('canvas-reset-chat-button');
    this.emptyState = page.getByTestId('canvas-empty-state');
    this.loadingState = page.getByTestId('canvas-loading-state');
    this.instructionTextarea = page.getByTestId('canvas-instruction-textarea');
    this.sendButton = page.getByTestId('canvas-send-button');
    this.errorMessage = page.getByTestId('canvas-error-message');
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible();
  }

  async waitForVisible() {
    await this.container.waitFor({ state: 'visible' });
  }

  async fillInstruction(text: string) {
    await this.instructionTextarea.fill(text);
  }

  async send() {
    await this.sendButton.click();
  }

  async sendInstruction(text: string) {
    await this.fillInstruction(text);
    await this.send();
  }

  async resetChat() {
    await this.resetChatButton.click();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  async isLoadingVisible(): Promise<boolean> {
    return this.loadingState.isVisible();
  }

  async waitForLoadingHidden(timeout = 30000) {
    await this.loadingState.waitFor({ state: 'hidden', timeout });
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async getErrorText(): Promise<string> {
    return this.errorMessage.innerText();
  }

  getApplyButton(messageId: string): Locator {
    return this.page.getByTestId(`canvas-apply-button-${messageId}`);
  }

  getCopyButton(messageId: string): Locator {
    return this.page.getByTestId(`canvas-copy-button-${messageId}`);
  }

  async clickApply(messageId: string) {
    await this.getApplyButton(messageId).click();
  }

  async clickCopy(messageId: string) {
    await this.getCopyButton(messageId).click();
  }

  async isSendDisabled(): Promise<boolean> {
    return this.sendButton.isDisabled();
  }

  async getInstructionValue(): Promise<string> {
    return this.instructionTextarea.inputValue();
  }

  async clearInstruction() {
    await this.instructionTextarea.clear();
  }
}
