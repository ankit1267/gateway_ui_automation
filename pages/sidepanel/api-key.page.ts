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

  constructor(page: Page) {
    this.page = page;
    this.addApiKeyButton = page.getByRole('button', { name: '+ Add New API Key' });
    this.apiKeyNameInput = page.getByTestId('apikey-modal-field-name-input');
    this.apiKeyInput = page.getByTestId('apikey-modal-field-apikey-input');
    this.apiKeyCommentInput = page.getByTestId('apikey-modal-field-comment-input');
    this.apiKeyLimitInput = page.getByTestId('apikey-modal-field-apikey_limit-input');
    this.apiKeyGuideButton = page.getByRole('button', { name: 'API Key Guide' });
    this.closeGuideButton = page.getByTestId('api-key-guide-close-button');
    this.apiKeyAdd = page.getByTestId('apikey-modal-submit-button')
  }

  async goto(orgId: string) {
    await this.page.goto(`/org/${process.env.ORG_ID}/apikeys`);
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
}