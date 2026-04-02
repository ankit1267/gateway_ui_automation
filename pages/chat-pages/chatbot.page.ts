import { type Page, type Locator, type FrameLocator, expect } from '@playwright/test';

export class ChatbotPage {

  private readonly frame: FrameLocator;
  private readonly scrollable: Locator;
  private readonly newThreadButton: Locator;
  private readonly input: Locator;
  private readonly copyButton: Locator;
  private readonly goodResponseButton: Locator;
  private readonly badResponseButton: Locator;
  private readonly loadingSpinner: Locator;
  private readonly sendButton: Locator;

  constructor(public readonly page: Page) {
    this.frame = this.page.locator(
      '#iframe-component-interfaceEmbed'
    ).first().contentFrame();
    this.scrollable = this.frame.locator('#scrollableDiv');
    this.newThreadButton = this.frame.locator('button:has(.lucide-square-pen)');
    this.input = this.frame.getByRole('textbox', {
      name: 'Message AI Assistant...'
    });
    this.copyButton = this.frame.getByRole('button', { name: 'Copy' });
    this.goodResponseButton = this.frame.getByRole('button', { name: 'Good response' });
    this.badResponseButton = this.frame.getByRole('button', { name: 'Bad response' });
    this.loadingSpinner = this.frame.locator('.loading-spinner, .animate-spin');
    this.sendButton = this.frame.getByRole('button', { name: /send/i });
  }

  async isHomeVisible() {
    return await this.frame
      .getByText('What can I help with?')
      .isVisible();
  }

  async buttonVisible() {
    await expect(this.newThreadButton).toBeVisible({ timeout: 40000 });
  }

  async openNewThread() {
    await this.buttonVisible();
    await this.newThreadButton.click();
  }

  async inputVisible() {
    await expect(this.input).toBeVisible();
  }

  async sendMessage(message: string) {
    await this.inputVisible();
    await this.input.fill(message);
    await this.input.press('Enter');
  }

  async expectResponse(message: string | RegExp) {
    await expect(this.scrollable.getByText(message)).toBeVisible({ timeout: 100000 });
  }
  async expectText(message: string) {
    await expect(this.scrollable)
      .toContainText(message, { timeout: 100000 });
  }

  async isCopyButtonVisible() {
    return await this.frame
      .getByRole('button', { name: 'Copy' })
      .isVisible();
  }


  async expectCopyButtonVisible() {
    await expect(this.copyButton).toBeVisible({ timeout: 40000 });
  }

  async expectGoodResponseButtonVisible() {
    await expect(this.goodResponseButton).toBeVisible({ timeout: 40000 });
  }

  async expectBadResponseButtonVisible() {
    await expect(this.badResponseButton).toBeVisible({ timeout: 40000 });
  }

  async clickCopyButton() {
    await this.copyButton.click();
  }

  async clickGoodResponseButton() {
    await this.goodResponseButton.click();
  }

  async clickBadResponseButton() {
    await this.badResponseButton.click();
  }

  // --- Additional iframe locators ---

  getFrameLocator(): FrameLocator {
    return this.frame;
  }

  getScrollable(): Locator {
    return this.scrollable;
  }

  async isLoadingVisible(): Promise<boolean> {
    return this.loadingSpinner.isVisible();
  }

  async waitForResponseComplete(timeout = 40000) {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout });
  }

  async clickSendButton() {
    await this.sendButton.click();
  }

  async getInputPlaceholder(): Promise<string | null> {
    return this.input.getAttribute('placeholder');
  }

  async clearInput() {
    await this.input.clear();
  }

  async getInputValue(): Promise<string> {
    return this.input.inputValue();
  }

  getMessageByText(text: string): Locator {
    return this.scrollable.getByText(text);
  }

  async getMessageCount(): Promise<number> {
    return this.scrollable.locator('[class*="message"]').count();
  }

  getStarterQuestion(text: string): Locator {
    return this.frame.getByRole('button', { name: text });
  }

  async clickStarterQuestion(text: string) {
    await this.getStarterQuestion(text).click();
  }
}
