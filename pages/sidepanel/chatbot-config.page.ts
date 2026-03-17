import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

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

  private async dismissOnboardingOverlay() {
    const overlay = this.page.getByTestId('org-page-guard-modal-overlay');
    if (await overlay.isVisible()) {
      await this.page.getByRole('button', { name: 'Close onboarding' }).click();
      await overlay.waitFor({ state: 'hidden' });
    }
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/chatbotConfig`);
    await this.page.waitForURL(`/org/${orgId}/chatbotConfig`);
    await this.dismissOnboardingOverlay();
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

  // --- Testing tab visibility assertions ---

  async clickTestingTab() {
    await this.clickConfigTab('testing');
  }

  async expectTestingControlsVisible() {
    await expect(this.testingControls).toBeVisible({ timeout: 15000 });
  }

  async expectTestingOpenButtonVisible() {
    await expect(this.testingOpenButton).toBeVisible();
  }

  async expectTestingCloseButtonVisible() {
    await expect(this.testingCloseButton).toBeVisible();
  }

  async expectTestingShowIconButtonVisible() {
    await expect(this.testingShowIconButton).toBeVisible();
  }

  async expectTestingHideIconButtonVisible() {
    await expect(this.testingHideIconButton).toBeVisible();
  }

  async expectTestingReloadChatsButtonVisible() {
    await expect(this.testingReloadChatsButton).toBeVisible();
  }

  async expectTestingSendDataVisible() {
    await expect(this.testingSendDataInput).toBeVisible();
    await expect(this.testingSendDataButton).toBeVisible();
  }

  async expectTestingAskAiVisible() {
    await expect(this.testingAskAiInput).toBeVisible();
    await expect(this.testingAskAiButton).toBeVisible();
  }

  async expectTestingBackButtonVisible() {
    await expect(this.testingBackButton).toBeVisible();
  }

  // --- Testing tab event log methods ---

  async expectEventLogNotEmpty() {
    await expect(this.page.getByText('No events yet')).not.toBeVisible();
  }

  async expectEventLogContains(text: string) {
    await expect(this.page.getByText(text).first()).toBeVisible({ timeout: 10000 });
  }

  async clickEventLogClear() {
    await this.page.getByRole('button', { name: 'Clear' }).click({ force: true });
  }

  async expectEventLogEmpty() {
    await expect(this.page.getByText('No events yet')).toBeVisible();
  }

  // --- Integration Guide assertions ---

  async expectFirstStepVisible() {
    await expect(this.firstStepContainer).toBeVisible();
  }

  async expectSecondStepVisible() {
    await expect(this.secondStepContainer).toBeVisible();
  }

  async expectAllStepsHaveText() {
    await expect(this.firstStepContainer).toBeVisible();
    await expect(this.firstStepContainer.locator('h3')).toContainText('Step 1');
    await expect(this.secondStepContainer).toBeVisible();
    await expect(this.secondStepContainer.locator('h3').first()).toContainText('Step 2');
  }

  async expectAllCopyButtonsWork() {
    const containers = this.page.getByTestId('copy-button-container');
    const count = await containers.count();
    expect(count).toBeGreaterThan(0);
    let clicked = 0;
    for (let i = 0; i < count; i++) {
      const container = containers.nth(i);
      const btn = container.getByTestId('copy-button');
      if (!await btn.isVisible()) continue;
      await btn.dispatchEvent('click');
      await expect(container.getByText('Copied!')).toBeVisible();
      clicked++;
    }
    expect(clicked).toBeGreaterThan(0);
  }

  // --- Configuration tab sidebar methods ---

  async clickConfigurationTab() {
    await this.clickConfigTab('configuration');
  }

  async expectConfigSidebarContentVisible() {
    await expect(this.configSidebarContent).toBeVisible({ timeout: 15000 });
  }

  async fillConfigChatbotTitle(title: string) {
    const input = this.configSidebarContent.getByPlaceholder('Enter chatbot title');
    await input.clear();
    await input.fill(title);
    await input.blur();
  }

  async fillConfigChatbotSubtitle(subtitle: string) {
    const input = this.configSidebarContent.getByPlaceholder('Enter chatbot subtitle');
    await input.clear();
    await input.fill(subtitle);
    await input.blur();
  }

  async fillConfigButtonTitle(title: string) {
    const input = this.configSidebarContent.getByPlaceholder('Enter button title');
    await input.clear();
    await input.fill(title);
    await input.blur();
  }

  async fillConfigIconUrl(url: string) {
    const input = this.configSidebarContent.getByPlaceholder('Enter icon URL');
    await input.clear();
    await input.fill(url);
    await input.blur();
  }

  async fillConfigHeight(value: string) {
    const input = this.configSidebarContent.locator('#dimension-input-height');
    await input.clear();
    await input.fill(value);
    await input.blur();
  }

  async selectConfigHeightUnit(unit: string) {
    const select = this.configSidebarContent.locator('#dimension-select-height-unit');
    await select.selectOption(unit);
  }

  async fillConfigWidth(value: string) {
    const input = this.configSidebarContent.locator('#dimension-input-width');
    await input.clear();
    await input.fill(value);
    await input.blur();
  }

  async selectConfigWidthUnit(unit: string) {
    const select = this.configSidebarContent.locator('#dimension-select-width-unit');
    await select.selectOption(unit);
  }

  async selectConfigPosition(position: string) {
    const select = this.configSidebarContent.locator('#radio-group-position select');
    await select.selectOption(position);
  }

  async fillConfigThemeColor(color: string) {
    const input = this.configSidebarContent.locator('input[name="themeColor"]');
    await input.evaluate((el: HTMLInputElement, c: string) => {
      el.value = c;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
    }, color);
  }

  async getConfigThemeColorDisplay(): Promise<string> {
    return await this.configSidebarContent.locator('input[name="themeColor"]').evaluate((el: HTMLInputElement) => el.value);
  }

  // --- Live Preview iframe assertions ---

  getPreviewFrame() {
    return this.page.frameLocator('iframe[src*="chatbot"]');
  }

  async expectPreviewFrameVisible() {
    await expect(this.page.locator('iframe[src*="chatbot"]')).toBeVisible({ timeout: 30000 });
  }

  async reloadPreview() {
    await this.page.getByRole('button', { name: 'Reload preview' }).click();
    await this.page.locator('iframe[src*="chatbot"]').waitFor({ state: 'attached', timeout: 30000 });
  }

  async closeChatbotInPreview() {
    await this.page.evaluate(() => {
      if ((window as any).Chatbot?.close) {
        (window as any).Chatbot.close();
      }
    });
  }

  async expectPreviewContainsText(text: string) {
    const frame = this.getPreviewFrame();
    await expect(frame.getByText(text).first()).toBeVisible({ timeout: 15000 });
  }

  async expectFloatingButtonText(text: string) {
    await expect(this.page.locator('#chatbot-preview-container').getByText(text)).toBeVisible({ timeout: 15000 });
  }

  async expectShowAccessKeyRevealsKeyWithCopy() {
    await expect(this.firstStepShowAccessKey).toBeVisible();
    await this.clickShowAccessKey();
    await expect(this.inputWithCopyInput).toBeVisible({ timeout: 10000 });
    const value = await this.getAccessKeyValue();
    expect(value.length).toBeGreaterThan(0);
    await expect(this.inputWithCopyButton).toBeVisible();
    await this.copyAccessKey();
  }
}
