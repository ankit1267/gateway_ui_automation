import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export type ApiKeyGuideTab = 'openai' | 'groq' | 'anthropic' | 'openrouter' | 'mistral' | 'gemini' | 'aiml';

export class ApiKeysPage {
  readonly page: Page;
  readonly apiKeyGuideButton: Locator;
  readonly addApiKeyButton: Locator;
  readonly closeGuideButton: Locator;
  readonly apiKeyNameInput: Locator;
  readonly apiKeyInput: Locator;
  readonly apiKeyCommentInput: Locator;
  readonly apiKeyLimitInput: Locator;
  readonly apiKeyAdd: Locator;
  readonly guideSlider: Locator;
  readonly guideTabs: Locator;
  readonly emptyState: Locator;
  readonly pageTitle: Locator;
  readonly apiKeyModalCancel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addApiKeyButton = page.getByRole('button', { name: '+ Add New API Key' });
    this.apiKeyNameInput = page.getByTestId('apikey-modal-field-name-input');
    this.apiKeyInput = page.getByTestId('apikey-modal-field-apikey-input');
    this.apiKeyCommentInput = page.getByTestId('apikey-modal-field-comment-input');
    this.apiKeyLimitInput = page.getByTestId('apikey-modal-field-apikey_limit-input');
    this.apiKeyGuideButton = page.getByRole('button', { name: 'API Key Guide' });
    this.closeGuideButton = page.getByTestId('api-key-guide-close-button');
    this.apiKeyAdd = page.getByTestId('apikey-modal-submit-button');
    this.guideSlider = page.getByTestId('api-key-guide-slider');
    this.guideTabs = page.getByTestId('api-key-guide-tabs');
    this.emptyState = page.getByText('No API keys entries found');
    this.pageTitle = page.getByRole('heading', { name: 'API Keys' });
    this.apiKeyModalCancel = page.getByTestId('apikey-modal-cancel-button');
  }

  async goto(orgId: string) {
    await this.page.goto(`/org/${process.env.ORG_ID}/apikeys`);
    await this.page.waitForURL(`/org/${process.env.ORG_ID}/apikeys`);
  }

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async addNewApiKey() {
    await this.addApiKeyButton.click();
  }

  async openApiKeyGuide() {
    await this.apiKeyGuideButton.click();
  }

  async clickGuideTab(tab: ApiKeyGuideTab) {
    await this.page.getByTestId(`api-key-guide-tab-${tab}`).click();
  }

  async closeApiKeyGuide() {
    await this.closeGuideButton.click();
  }

  async visitAllGuideTabs() {
    const tabs: ApiKeyGuideTab[] = ['openai', 'groq', 'anthropic', 'openrouter', 'mistral', 'gemini', 'aiml'];
    for (const tab of tabs) {
      await this.clickGuideTab(tab);
    }
  }

  async fillApiKeyName(name: string) {
    await this.apiKeyNameInput.fill(name);
  }

  async fillApiKey(apiKey: string) {
    await this.apiKeyInput.fill(apiKey);
  }

  async fillApiKeyComment(comment: string) {
    await this.apiKeyCommentInput.fill(comment);
  }

  async fillApiKeyLimit(limit: string) {
    await this.apiKeyLimitInput.fill(limit);
  }

  async clickAddApiKey() {
    await this.apiKeyAdd.click();
  }

  async deleteApiKeyByName(name: string) {
    const row = this.page.getByRole('row', { name: new RegExp(name) });
    await row.hover();
    await row.locator('[data-tip="delete"]').click();
    await this.page.getByTestId('delete-modal-confirm-button').click();
  }

  async updateApiKeyByName(name: string) {
    const row = this.page.getByRole('row', { name: new RegExp(name) });
    await row.hover();
    await row.locator('[data-tip="Update"]').click();
  }

  async resetUsageByName(name: string) {
    const row = this.page.getByRole('row', { name: new RegExp(name) });
    await row.hover();
    await row.locator('[data-tip="Reset Usage"]').click();
  }

  getApiKeyRow(name: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(name) });
  }

  async isEmptyState(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  async isGuideSliderVisible(): Promise<boolean> {
    return this.guideSlider.isVisible();
  }

  async expectGuideSliderVisible() {
    await expect(this.guideSlider).toBeVisible();
  }

  async expectGuideTabsVisible() {
    await expect(this.guideTabs).toBeVisible();
  }

  async expectCloseGuideButtonVisible() {
    await expect(this.closeGuideButton).toBeVisible();
  }

  async expectGuideTabVisible(tab: ApiKeyGuideTab) {
    await expect(this.page.getByTestId(`api-key-guide-tab-${tab}`)).toBeVisible();
  }

  async expectAllGuideTabsVisible() {
    const tabs: ApiKeyGuideTab[] = ['openai', 'groq', 'anthropic', 'openrouter', 'mistral', 'gemini', 'aiml'];
    for (const tab of tabs) {
      await this.expectGuideTabVisible(tab);
    }
  }

  async expectProviderLinkVisible() {
    await expect(this.page.getByTestId('api-key-guide-provider-link')).toBeVisible();
  }

  private readonly guideTabTitles: Record<ApiKeyGuideTab, string> = {
    openai: 'OpenAI API Key Setup',
    groq: 'Groq API Key Setup',
    anthropic: 'Anthropic API Key Setup',
    openrouter: 'OpenRouter API Key Setup',
    mistral: 'Mistral AI API Key Setup',
    gemini: 'Google Gemini API Key Setup',
    aiml: 'AI ML API Key Setup',
  };

  async expectGuideTabContentVisible(tab: ApiKeyGuideTab) {
    await this.clickGuideTab(tab);
    await expect(
      this.page.getByRole('heading', { name: this.guideTabTitles[tab], exact: true })
    ).toBeVisible();
  }

  async expectAllGuideTabContentsVisible() {
    const tabs: ApiKeyGuideTab[] = ['openai', 'groq', 'anthropic', 'openrouter', 'mistral', 'gemini', 'aiml'];
    for (const tab of tabs) {
      await this.expectGuideTabContentVisible(tab);
    }
  }

  async getApiKeyNameValue(): Promise<string> {
    return this.apiKeyNameInput.inputValue();
  }

  async getApiKeyValue(): Promise<string> {
    return this.apiKeyInput.inputValue();
  }

  async getApiKeyCommentValue(): Promise<string> {
    return this.apiKeyCommentInput.inputValue();
  }

  async getApiKeyLimitValue(): Promise<string> {
    return this.apiKeyLimitInput.inputValue();
  }

  async clearApiKeyName() {
    await this.apiKeyNameInput.clear();
  }

  async clearApiKey() {
    await this.apiKeyInput.clear();
  }

  async clearApiKeyComment() {
    await this.apiKeyCommentInput.clear();
  }

  async clearApiKeyLimit() {
    await this.apiKeyLimitInput.clear();
  }

  async createApiKey(name: string, apiKey: string, comment?: string, limit?: string) {
    await this.addNewApiKey();
    await this.fillApiKeyName(name);
    await this.fillApiKey(apiKey);
    if (comment) await this.fillApiKeyComment(comment);
    if (limit) await this.fillApiKeyLimit(limit);
    await this.clickAddApiKey();
  }
  
  async cancelApiKey() {
    await this.apiKeyModalCancel.click();
  }
}
