import type { Page, Locator } from '@playwright/test';

export class ChatbotConfigPage {
  readonly page: Page;
  readonly formSectionContainer: Locator;
  readonly chatbotTitleInput: Locator;
  readonly chatbotSubtitleInput: Locator;
  readonly buttonTitleInput: Locator;
  readonly iconUrlInput: Locator;
  readonly themeColorInput: Locator;
  readonly positionRadioGroup: Locator;
  readonly firstStepContainer: Locator;
  readonly firstStepShowAccessKey: Locator;
  readonly inputWithCopyInput: Locator;
  readonly inputWithCopyButton: Locator;
  readonly secondStepContainer: Locator;
  readonly secondStepMainScriptCode: Locator;
  readonly testingControls: Locator;
  readonly testingOpenButton: Locator;
  readonly testingCloseButton: Locator;
  readonly testingShowIconButton: Locator;
  readonly testingHideIconButton: Locator;
  readonly testingReloadChatsButton: Locator;
  readonly testingSendDataInput: Locator;
  readonly testingSendDataButton: Locator;
  readonly testingAskAiInput: Locator;
  readonly testingAskAiButton: Locator;
  readonly configDetailView: Locator;
  readonly configSidebar: Locator;
  readonly configMainNav: Locator;
  readonly configBackButton: Locator;
  readonly testingBackButton: Locator;
  readonly configSidebarContent: Locator;
  readonly testingSidebarContent: Locator;
  readonly configContentArea: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formSectionContainer = page.getByTestId('form-section-container');
    this.chatbotTitleInput = page.getByTestId('form-section-chatbot-title');
    this.chatbotSubtitleInput = page.getByTestId('form-section-chatbot-subtitle');
    this.buttonTitleInput = page.getByTestId('form-section-button-title');
    this.iconUrlInput = page.getByTestId('form-section-icon-url');
    this.themeColorInput = page.getByTestId('form-section-theme-color');
    this.positionRadioGroup = page.getByTestId('radio-group-position');
    this.firstStepContainer = page.getByTestId('first-step-container');
    this.firstStepShowAccessKey = page.getByTestId('first-step-show-access-key');
    this.inputWithCopyInput = page.getByTestId('input-with-copy-input');
    this.inputWithCopyButton = page.getByTestId('input-with-copy-button');
    this.secondStepContainer = page.getByTestId('second-step-container');
    this.secondStepMainScriptCode = page.getByTestId('second-step-main-script-code');
    this.testingControls = page.getByTestId('chatbot-testing-controls');
    this.testingOpenButton = page.getByTestId('chatbot-testing-open-button');
    this.testingCloseButton = page.getByTestId('chatbot-testing-close-button');
    this.testingShowIconButton = page.getByTestId('chatbot-testing-show-icon-button');
    this.testingHideIconButton = page.getByTestId('chatbot-testing-hide-icon-button');
    this.testingReloadChatsButton = page.getByTestId('chatbot-testing-reload-chats-button');
    this.testingSendDataInput = page.getByTestId('chatbot-testing-send-data-input');
    this.testingSendDataButton = page.getByTestId('chatbot-testing-send-data-button');
    this.testingAskAiInput = page.getByTestId('chatbot-testing-ask-ai-input');
    this.testingAskAiButton = page.getByTestId('chatbot-testing-ask-ai-button');
    this.configDetailView = page.getByTestId('chatbot-config-detail-view');
    this.configSidebar = page.getByTestId('chatbot-config-sidebar');
    this.configMainNav = page.getByTestId('chatbot-config-main-nav');
    this.configBackButton = page.getByTestId('chatbot-config-back-button');
    this.testingBackButton = page.getByTestId('chatbot-testing-back-button');
    this.configSidebarContent = page.getByTestId('chatbot-config-sidebar-content');
    this.testingSidebarContent = page.getByTestId('chatbot-testing-sidebar-content');
    this.configContentArea = page.getByTestId('chatbot-config-content-area');
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/chatbotConfig`);
  }

  async waitForPage() {
    await this.page.waitForLoadState('networkidle');
  }

  async fillChatbotTitle(title: string) {
    await this.chatbotTitleInput.fill(title);
  }

  async fillChatbotSubtitle(subtitle: string) {
    await this.chatbotSubtitleInput.fill(subtitle);
  }

  async fillButtonTitle(title: string) {
    await this.buttonTitleInput.fill(title);
  }

  async fillIconUrl(url: string) {
    await this.iconUrlInput.fill(url);
  }

  async setThemeColor(color: string) {
    await this.themeColorInput.fill(color);
  }

  async selectPosition(position: string) {
    await this.positionRadioGroup
      .getByTestId(`radio-position-${position.replace(' ', '-').toLowerCase()}`)
      .click();
  }

  async setDimension(name: string, value: string) {
    await this.page.getByTestId(`dimension-input-${name}`).fill(value);
  }

  async setDimensionUnit(name: string, unit: string) {
    await this.page.getByTestId(`dimension-select-${name}-unit`).selectOption(unit);
  }

  async clickShowAccessKey() {
    await this.firstStepShowAccessKey.click();
  }

  async getAccessKeyValue(): Promise<string> {
    return this.inputWithCopyInput.inputValue();
  }

  async copyAccessKey() {
    await this.inputWithCopyButton.click();
  }

  async clickTestingOpen() {
    await this.testingOpenButton.click();
  }

  async clickTestingClose() {
    await this.testingCloseButton.click();
  }

  async isFormSectionVisible(): Promise<boolean> {
    return this.formSectionContainer.isVisible();
  }

  async isFirstStepVisible(): Promise<boolean> {
    return this.firstStepContainer.isVisible();
  }

  async isSecondStepVisible(): Promise<boolean> {
    return this.secondStepContainer.isVisible();
  }

  getSecondStepMethod(index: number): Locator {
    return this.page.getByTestId(`second-step-method-${index}`);
  }

  // --- Testing tab actions ---

  async clickTestingShowIcon() {
    await this.testingShowIconButton.click();
  }

  async clickTestingHideIcon() {
    await this.testingHideIconButton.click();
  }

  async clickTestingReloadChats() {
    await this.testingReloadChatsButton.click();
  }

  async fillSendData(json: string) {
    await this.testingSendDataInput.fill(json);
  }

  async clickSendData() {
    await this.testingSendDataButton.click();
  }

  async sendData(json: string) {
    await this.fillSendData(json);
    await this.clickSendData();
  }

  async fillAskAi(question: string) {
    await this.testingAskAiInput.fill(question);
  }

  async clickAskAi() {
    await this.testingAskAiButton.click();
  }

  async askAi(question: string) {
    await this.fillAskAi(question);
    await this.clickAskAi();
  }

  // --- Config detail view ---

  getConfigTab(tabId: string): Locator {
    return this.page.getByTestId(`chatbot-config-tab-${tabId}`);
  }

  async clickConfigTab(tabId: string) {
    await this.getConfigTab(tabId).click();
  }

  async clickConfigBack() {
    await this.configBackButton.click();
  }

  async clickTestingBack() {
    await this.testingBackButton.click();
  }

  async isConfigDetailViewVisible(): Promise<boolean> {
    return this.configDetailView.isVisible();
  }

  async isConfigSidebarVisible(): Promise<boolean> {
    return this.configSidebar.isVisible();
  }

  async isTestingControlsVisible(): Promise<boolean> {
    return this.testingControls.isVisible();
  }
}
