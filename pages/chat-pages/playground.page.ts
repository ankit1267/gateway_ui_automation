import { type Page, type Locator, expect } from '@playwright/test';

export class PlaygroundPage {
  readonly page: Page;

  // Chat container & header
  readonly chatContainer: Locator;
  readonly chatHeader: Locator;
  readonly toggleTestCasesButton: Locator;
  readonly chatContentWrapper: Locator;
  readonly chatTestCaseSidebar: Locator;
  readonly chatMessagesSection: Locator;
  readonly chatMessagesContainer: Locator;
  readonly chatLoadingOverlay: Locator;
  readonly chatInputWrapper: Locator;

  // Chat controls
  readonly messageTextarea: Locator;
  readonly strategySelect: Locator;
  readonly addTestCaseButton: Locator;

  // Edit message
  readonly chatEditTextarea: Locator;
  readonly chatSaveEditButton: Locator;
  readonly chatCancelEditButton: Locator;

  // Attachments
  readonly chatFileInput: Locator;
  readonly chatAttachmentDropdown: Locator;
  readonly chatAttachmentButton: Locator;
  readonly chatAttachImagesOption: Locator;
  readonly chatAttachVideosOption: Locator;
  readonly chatAttachFilesOption: Locator;
  readonly chatAttachUrlOption: Locator;
  readonly chatPreviewContainer: Locator;
  readonly chatMediaUrlPreview: Locator;
  readonly chatRemoveUrlButton: Locator;

  // URL input modal
  readonly chatUrlInputModal: Locator;
  readonly chatUrlInput: Locator;
  readonly chatUrlAddButton: Locator;
  readonly chatUrlCancelButton: Locator;

  // Validation
  readonly chatValidationError: Locator;

  // YouTube link
  readonly chatYoutubeLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Chat container & header
    this.chatContainer = page.getByTestId('chat-container');
    this.chatHeader = page.getByTestId('chat-header');
    this.toggleTestCasesButton = page.getByTestId('chat-toggle-testcases-button');
    this.chatContentWrapper = page.getByTestId('chat-content-wrapper');
    this.chatTestCaseSidebar = page.getByTestId('chat-testcase-sidebar');
    this.chatMessagesSection = page.getByTestId('chat-messages-section');
    this.chatMessagesContainer = page.getByTestId('chat-messages-container');
    this.chatLoadingOverlay = page.getByTestId('chat-loading-overlay');
    this.chatInputWrapper = page.getByTestId('chat-input-wrapper');

    // Chat controls
    this.messageTextarea = page.getByTestId('chat-message-textarea');
    this.strategySelect = page.getByTestId('chat-strategy-select');
    this.addTestCaseButton = page.getByTestId('chat-add-testcase-button');

    // Edit message
    this.chatEditTextarea = page.getByTestId('chat-edit-textarea');
    this.chatSaveEditButton = page.getByTestId('chat-save-edit-button');
    this.chatCancelEditButton = page.getByTestId('chat-cancel-edit-button');

    // Attachments
    this.chatFileInput = page.getByTestId('chat-file-input');
    this.chatAttachmentDropdown = page.getByTestId('chat-attachment-dropdown');
    this.chatAttachmentButton = page.getByTestId('chat-attachment-button');
    this.chatAttachImagesOption = page.getByTestId('chat-attach-images-option');
    this.chatAttachVideosOption = page.getByTestId('chat-attach-videos-option');
    this.chatAttachFilesOption = page.getByTestId('chat-attach-files-option');
    this.chatAttachUrlOption = page.getByTestId('chat-attach-url-option');
    this.chatPreviewContainer = page.getByTestId('chat-preview-container');
    this.chatMediaUrlPreview = page.getByTestId('chat-media-url-preview');
    this.chatRemoveUrlButton = page.getByTestId('chat-remove-url-button');

    // URL input modal
    this.chatUrlInputModal = page.getByTestId('chat-url-input-modal');
    this.chatUrlInput = page.getByTestId('chat-url-input');
    this.chatUrlAddButton = page.getByTestId('chat-url-add-button');
    this.chatUrlCancelButton = page.getByTestId('chat-url-cancel-button');

    // Validation
    this.chatValidationError = page.getByTestId('chat-validation-error');

    // YouTube link
    this.chatYoutubeLink = page.getByTestId('chat-youtube-link');
  }

  // --- Basic chat actions ---

  async typeMessage(message: string) {
    await this.messageTextarea.fill(message);
    await this.page.keyboard.press('Enter');
  }

  async fillMessage(message: string) {
    await this.messageTextarea.fill(message);
  }

  async sendMessage() {
    await this.page.keyboard.press('Enter');
  }

  async getMessageValue(): Promise<string> {
    return this.messageTextarea.inputValue();
  }

  async clearMessage() {
    await this.messageTextarea.clear();
  }

  // --- Controls ---

  async expectChatControlsVisible() {
    await expect(this.addTestCaseButton).toBeVisible();
    await expect(this.strategySelect).toBeVisible();
  }

  async expectChatControlsNotVisible() {
    await expect(this.addTestCaseButton).not.toBeVisible();
    await expect(this.strategySelect).not.toBeVisible();
  }

  async selectStrategy(strategy: 'cosine' | 'ai' | 'exact') {
    await this.strategySelect.selectOption(strategy);
  }

  async clickAddNewTestCase() {
    await this.addTestCaseButton.click();
  }

  async toggleTestCases() {
    await this.toggleTestCasesButton.click();
  }

  // --- Messages ---

  getChatMessage(index: number): Locator {
    return this.page.getByTestId(`chat-message-${index}`);
  }

  async expectChatMessageVisible(i: number) {
    await expect(this.page.getByTestId(`chat-message-${i}`)).toBeVisible();
  }

  getRunTestButton(index: number): Locator {
    return this.page.getByTestId(`chat-run-test-button-${index}`);
  }

  async clickRunTest(index: number) {
    await this.getRunTestButton(index).click();
  }

  getEditMessageButton(messageId: string): Locator {
    return this.page.getByTestId(`chat-edit-message-button-${messageId}`);
  }

  getToggleResultButton(messageId: string): Locator {
    return this.page.getByTestId(`chat-toggle-result-button-${messageId}`);
  }

  // --- Edit message ---

  async fillEditTextarea(text: string) {
    await this.chatEditTextarea.fill(text);
  }

  async saveEdit() {
    await this.chatSaveEditButton.click();
  }

  async cancelEdit() {
    await this.chatCancelEditButton.click();
  }

  // --- Attachments ---

  async openAttachmentDropdown() {
    await this.chatAttachmentButton.click();
  }

  async attachImages() {
    await this.chatAttachImagesOption.click();
  }

  async attachVideos() {
    await this.chatAttachVideosOption.click();
  }

  async attachFiles() {
    await this.chatAttachFilesOption.click();
  }

  async attachUrl() {
    await this.chatAttachUrlOption.click();
  }

  async removeUploadedImage(index: number) {
    await this.page.getByTestId(`chat-remove-image-${index}`).click();
  }

  async removeUploadedFile(index: number) {
    await this.page.getByTestId(`chat-remove-file-${index}`).click();
  }

  async removeMediaUrl() {
    await this.chatRemoveUrlButton.click();
  }

  // --- URL input modal ---

  async fillUrlInput(url: string) {
    await this.chatUrlInput.fill(url);
  }

  async addUrl() {
    await this.chatUrlAddButton.click();
  }

  async cancelUrlInput() {
    await this.chatUrlCancelButton.click();
  }

  async expectChatMessageContainsText(index: number, text: string) {
    await expect(this.getChatMessage(index)).toContainText(text, { timeout: 30000 });
  }

  // --- File link ---

  getChatFileLink(index: number): Locator {
    return this.page.getByTestId(`chat-file-link-${index}`);
  }

  // --- Visibility checks ---

  async isChatContainerVisible(): Promise<boolean> {
    return this.chatContainer.isVisible();
  }

  async isLoadingOverlayVisible(): Promise<boolean> {
    return this.chatLoadingOverlay.isVisible();
  }

  async isValidationErrorVisible(): Promise<boolean> {
    return this.chatValidationError.isVisible();
  }

  async isPreviewContainerVisible(): Promise<boolean> {
    return this.chatPreviewContainer.isVisible();
  }

  async isUrlInputModalVisible(): Promise<boolean> {
    return this.chatUrlInputModal.isVisible();
  }

  async isTestCaseSidebarVisible(): Promise<boolean> {
    return this.chatTestCaseSidebar.isVisible();
  }
}