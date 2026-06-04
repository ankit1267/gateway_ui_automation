import { type Page, type Locator, expect } from '@playwright/test';
export class ChatbotPage {

  readonly page: Page;

  private readonly scrollable: Locator;
  private readonly loadingSpinner: Locator;
  private readonly sendButton: Locator;

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

  // Test case sidebar
  readonly testcaseSidebar: Locator;
  readonly testcaseRunAllButton: Locator;
  readonly testcaseListContainer: Locator;

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

    // Test case sidebar
    this.testcaseSidebar = page.getByTestId('testcase-sidebar');
    this.testcaseRunAllButton = page.getByTestId('testcase-run-all-button');
    this.testcaseListContainer = page.getByTestId('testcase-list-container');

    this.scrollable = this.page.getByTestId('chat-messages-container');
   
 
    this.loadingSpinner = this.page.locator('div.loading.loading-spinner');
    this.sendButton = this.page.getByRole('button', { name: /send/i });
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
    // Wait for the strategy select to be stable before interacting
    await this.strategySelect.waitFor({ state: 'attached', timeout: 5000 });
    await this.strategySelect.waitFor({ state: 'visible', timeout: 5000 });
    
    try {
      await this.strategySelect.selectOption(strategy);
    } catch (error) {
      // If element is detached, wait and retry with fresh locator
      await this.page.waitForTimeout(1000);
      const freshStrategySelect = this.page.getByTestId('chat-strategy-select');
      await freshStrategySelect.waitFor({ state: 'attached', timeout: 5000 });
      await freshStrategySelect.waitFor({ state: 'visible', timeout: 5000 });
      await freshStrategySelect.selectOption(strategy);
    }
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
    await expect(this.page.getByTestId(`chat-message-${i}`)).toBeVisible({timeout:40000});
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
    const msg = this.getChatMessage(index);
    // Wait for the AI response to actually load (not just the empty bubble)
    await expect.poll(async () => (await msg.textContent())?.trim().length ?? 0, { timeout: 60000 }).toBeGreaterThan(20);
    await expect(msg).toContainText(text, { timeout: 10000 });
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

  // --- Test Case Sidebar ---

  async expectTestCaseSidebarVisible() {
    await expect(this.chatTestCaseSidebar).toBeVisible();
  }

  async expectRunAllButtonVisible() {
    await expect(this.testcaseRunAllButton).toBeVisible();
  }

  getTestCaseCard(testId: string): Locator {
    return this.page.getByTestId(`testcase-card-${testId}`);
  }

  getTestCaseExpandButton(testId: string): Locator {
    return this.page.getByTestId(`testcase-toggle-expand-${testId}`);
  }

  getTestCaseRunButton(testId: string): Locator {
    return this.page.getByTestId(`testcase-run-button-${testId}`);
  }

  getTestCaseDeleteButton(testId: string): Locator {
    return this.page.getByTestId(`testcase-delete-button-${testId}`);
  }

  getTestCaseDetails(testId: string): Locator {
    return this.page.getByTestId(`testcase-details-${testId}`);
  }

  async getLastTestCaseCard(): Promise<Locator> {
    const cards = this.testcaseListContainer.locator('[data-testid^="testcase-card-"]');
    const count = await cards.count();
    return cards.nth(count - 1);
  }

  async getLastTestCaseId(): Promise<string> {
    const card = await this.getLastTestCaseCard();
    const testId = await card.getAttribute('data-testid');
    return testId?.replace('testcase-card-', '') || '';
  }

  async clickLastTestCaseCard() {
    const card = await this.getLastTestCaseCard();
    await card.click();
  }

  async clickLastTestCaseExpandButton() {
    const testId = await this.getLastTestCaseId();
    await this.getTestCaseExpandButton(testId).click();
  }

  async expectLastTestCaseDetailsVisible() {
    const testId = await this.getLastTestCaseId();
    await expect(this.getTestCaseDetails(testId)).toBeVisible();
  }

  async expectLastTestCaseDetailsNotVisible() {
    const testId = await this.getLastTestCaseId();
    await expect(this.getTestCaseDetails(testId)).not.toBeVisible();
  }

  async clickLastTestCaseRunButton() {
    const testId = await this.getLastTestCaseId();
    await this.getTestCaseRunButton(testId).click();
  }

  async clickLastTestCaseDeleteButton() {
    const testId = await this.getLastTestCaseId();
    await this.getTestCaseDeleteButton(testId).click();
  }

  async expectLastTestCaseExpandButtonVisible() {
    const testId = await this.getLastTestCaseId();
    await expect(this.getTestCaseExpandButton(testId)).toBeVisible();
  }

  async expectLastTestCaseRunButtonVisible() {
    const testId = await this.getLastTestCaseId();
    await expect(this.getTestCaseRunButton(testId)).toBeVisible();
  }

  async expectLastTestCaseDeleteButtonVisible() {
    const testId = await this.getLastTestCaseId();
    await expect(this.getTestCaseDeleteButton(testId)).toBeVisible();
  }

  async getTestCaseCardCount(): Promise<number> {
    return this.testcaseListContainer.locator('[data-testid^="testcase-card-"]').count();
  }

  // --- API Response Verification Methods ---

  /**
   * Sends a message and returns the intercepted chat completion API response.
   * Sets up the listener before sending so we never miss the response.
   */
  async typeMessageAndWaitForApi(message: string, options?: { timeout?: number }) {
    const timeout = options?.timeout ?? 30000;

    const responsePromise = this.page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/v2/model/playground/chat/completion/') &&
        resp.request().method() === 'POST' &&
        resp.status() === 200,
      { timeout }
    );

    await this.messageTextarea.focus();
    await this.messageTextarea.fill(message);
    await this.messageTextarea.focus();
    await this.page.keyboard.press('Enter');

    const response = await responsePromise;
    const requestBody = JSON.parse(response.request().postData() || '{}');
    const responseBody = await response.json();
    
    // Wait for UI to be ready before next message
    await this.page.waitForTimeout(10000);

    return { requestBody, responseBody, response };
  }

  /**
   * Verifies the chat completion API request body contains expected fields.
   */
  verifyChatRequestBody(requestBody: any, expectedMessage: string) {
    expect(requestBody).toHaveProperty('version_id');
    expect(requestBody).toHaveProperty('user', expectedMessage);
    expect(requestBody).toHaveProperty('configuration');
    expect(requestBody.configuration).toHaveProperty('type', 'chat');
  }

  /**
   * Verifies the chat completion API response indicates success.
   */
  verifyChatResponseBody(responseBody: any) {
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody).toHaveProperty('message_id');
  }

  /**
   * Runs a test case by ID and returns the intercepted API response.
   */
  async runTestCaseAndWaitForApi(testId: string, options?: { timeout?: number }) {
    const timeout = options?.timeout ?? 100000;

    const responsePromise = this.page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/v2/model/testcases') &&
        resp.request().method() === 'POST' &&
        resp.status() === 200,
      { timeout }
    );

    await this.getTestCaseRunButton(testId).click();

    const response = await responsePromise;
    const requestBody = JSON.parse(response.request().postData() || '{}');

    return { requestBody, response };
  }

  /**
   * Verifies the run-test-case API request body contains expected fields.
   */
  verifyRunTestCaseRequestBody(requestBody: any) {
    expect(requestBody).toHaveProperty('version_id');
    expect(requestBody).toHaveProperty('testcase_id');
    expect(requestBody).toHaveProperty('bridge_id');
    expect(requestBody.testcases).toBe(true);
  }

  /**
   * Deletes a test case by ID and returns the intercepted API response.
   */
  async deleteTestCaseAndWaitForApi(testId: string, options?: { timeout?: number }) {
    const timeout = options?.timeout ?? 15000;

    const responsePromise = this.page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/testcases/') &&
        resp.request().method() === 'DELETE',
      { timeout }
    );

    await this.getTestCaseDeleteButton(testId).click();

    const response = await responsePromise;

    return { response, status: response.status() };
  }

  /**
   * Verifies the matching_type sent in the chat request matches the selected strategy.
   */
  verifyChatStrategy(requestBody: any, expectedStrategy: string) {
    expect(requestBody?.testcase_data?.matching_type).toBe(expectedStrategy);
  }



  

  
  

  async sendMessage(message: string) {
     await this.messageTextarea.focus();
    await this.messageTextarea.fill(message);
    await this.messageTextarea.focus();
    await this.page.keyboard.press('Enter');
  }

  async expectResponse(message: string | RegExp) {
    await expect(this.scrollable.getByText(message)).toBeVisible({ timeout: 100000 });
  }
  async expectText(message: string) {
    await expect(this.scrollable)
      .toContainText(message, { timeout: 100000 });
  }






 
 
 

  // --- Additional iframe locators ---


  getScrollable(): Locator {
    return this.scrollable;
  }

  async isLoadingVisible(): Promise<boolean> {
    return this.loadingSpinner.isVisible();
  }

  async waitForResponseComplete(timeout = 120000) {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout });
  }

  async clickSendButton() {
    await this.sendButton.click();
  }

  getMessageByText(text: string): Locator {
    return this.scrollable.getByText(text);
  }

  async getMessageCount(): Promise<number> {
    return this.scrollable.locator('[class*="message"]').count();
  }

  getStarterQuestion(text: string): Locator {
    return this.page.getByRole('button', { name: text });
  }

  async clickStarterQuestion(text: string) {
    await this.getStarterQuestion(text).click();
  }
}
