import type { Page, Locator, FrameLocator } from '@playwright/test';
import { expect } from '@playwright/test';

export class PromptHelperPanel {
  private readonly page: Page;
  private readonly openHelperButton: Locator;
  private readonly closeHelperButton: Locator;
  private readonly messagesPanel: Locator;
  private readonly configScrollContainer: Locator;
  private readonly canvasInstructionTextarea: Locator;
  private readonly techDocFrame: FrameLocator;
  private readonly mainContent: Locator;
  private readonly applyButton: Locator;
  private readonly copyButton: Locator;
  private readonly resetChatButton: Locator;
  private readonly canvasSendButton: Locator;
  private readonly promptHelperContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.promptHelperContainer = page.getByTestId('prompt-helper-container');
    this.openHelperButton = page.getByTestId('prompt-header-open-helper-button');
    this.closeHelperButton = page.getByTestId('prompt-header-close-helper-button');
    this.messagesPanel = this.promptHelperContainer.locator('#messages');
    this.configScrollContainer = page.locator('#config-scroll-container');
    this.canvasInstructionTextarea = page.getByTestId('canvas-instruction-textarea');
    this.techDocFrame = page.frameLocator('#iframe-component-techdocEmbed');
    this.mainContent = page.getByRole('main');
    this.applyButton = page.locator('[data-testid^="canvas-apply-button-"]');
    this.copyButton = page.locator('[data-testid^="canvas-copy-button-"]');
    this.resetChatButton = page.getByTestId('canvas-reset-chat-button');
    this.canvasSendButton = page.getByTestId('canvas-send-button');
  }

  async clickApplyButton() {
    await this.applyButton.click();
  }


  async OpenHelperButtonVisible() {
    return await this.openHelperButton.isVisible();
  }

  async clickCanvasSendButton() {
    await this.canvasSendButton.click();
  }

  async expectCanvasInputVisible() {
    await expect(this.canvasInstructionTextarea).toBeVisible();
    await expect(this.canvasSendButton).toBeVisible();
  }

  async expectResetChatVisible() {
    await expect(this.resetChatButton).toBeVisible();
  }

  async expectApplyButtonVisible() {
    await expect(this.applyButton).toBeVisible();
  }

  async expectCopyButtonVisible() {
    await expect(this.copyButton).toBeVisible();
  }

  async generateInstruction(text: string) {
    await this.canvasInstructionTextarea.click();
    await this.canvasInstructionTextarea.fill(text);
  }

  async applyGeneratedInstruction() {
    await this.applyButton.first().click();
  }

  async copyGeneratedInstruction() {
    await this.copyButton.first().click();
  }

  async open() {
    await expect(async () => {
      await this.page.getByRole('textbox', { name: 'e.g. Always be polite. Never' }).click();
      await expect(this.openHelperButton).toBeVisible();
    }).toPass();
    await this.openHelperButton.click();
  }

  async close() {
    await expect(this.closeHelperButton).toBeVisible();
    await this.closeHelperButton.click();
  }

  async expectVisible() {
    await expect(this.messagesPanel).toBeVisible();
    await expect(this.configScrollContainer).toBeVisible();
    await expect(this.canvasInstructionTextarea).toBeVisible();
  }

  async expectTipTapEditorVisible() {
    await expect(
      this.techDocFrame.locator('#tiptap-editor')
    ).toBeVisible();
  }

  async expectMainVisible() {
    await expect(this.mainContent).toBeVisible();
  }

  async isOpen(): Promise<boolean> {
    return this.promptHelperContainer.isVisible();
  }

  async isOpenButtonVisible(): Promise<boolean> {
    return this.openHelperButton.isVisible();
  }

  async isCloseButtonVisible(): Promise<boolean> {
    return this.closeHelperButton.isVisible();
  }

  async getInstructionValue(): Promise<string> {
    return this.canvasInstructionTextarea.inputValue();
  }

  async clearInstruction() {
    await this.canvasInstructionTextarea.clear();
  }

  async clickResetChat() {
    await this.resetChatButton.click();
  }

  async expectConversationsCleared() {
    await expect(this.page.getByTestId('canvas-empty-state')).toBeVisible();
  }

  async expectMessagesPanelScrollable() {
    const isScrollable = await this.messagesPanel.evaluate(
      (el: HTMLElement) => el.scrollHeight > el.clientHeight
    );
    expect(isScrollable).toBe(true);
  }

  async clickCopyButton() {
    await this.copyButton.first().click();
  }

  getMessagesPanel(): Locator {
    return this.messagesPanel;
  }

  getContainer(): Locator {
    return this.promptHelperContainer;
  }

  async generateAndApply(text: string) {
    await this.generateInstruction(text);
    await this.clickCanvasSendButton();
  }
}