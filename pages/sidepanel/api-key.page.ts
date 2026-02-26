import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class ApiKeysPage {
  readonly page: Page;

  // Main navigation
  readonly apiKeysButton: Locator;
  readonly apiKeyGuideButton: Locator;

  // Guide tabs
  readonly openaiTab: Locator;
  readonly groqTab: Locator;
  readonly anthropicTab: Locator;
  readonly openrouterTab: Locator;
  readonly mistralTab: Locator;
  readonly geminiTab: Locator;
  readonly aimlTab: Locator;

  readonly closeGuideButton: Locator;

  constructor(page: Page) {
   this.page = page;

    this.apiKeysButton = page.getByRole('button', { name: 'API Keys' });
    this.apiKeyGuideButton = page.getByRole('button', { name: 'API Key Guide' });
    this.openaiTab = page.getByTestId('api-key-guide-tab-openai');
    this.groqTab = page.getByTestId('api-key-guide-tab-groq');
    this.anthropicTab = page.getByTestId('api-key-guide-tab-anthropic');
    this.openrouterTab = page.getByTestId('api-key-guide-tab-openrouter');
    this.mistralTab = page.getByTestId('api-key-guide-tab-mistral');
    this.geminiTab = page.getByTestId('api-key-guide-tab-gemini');
    this.aimlTab = page.getByTestId('api-key-guide-tab-aiml');

    this.closeGuideButton = page.getByTestId('api-key-guide-close-button');
  }

  async goto(orgId: string) {
    await this.page.goto(`/org/${process.env.ORG_ID}/apikeys`);
  }

   async openApiKeys() {
    await this.apiKeysButton.click();
  }

  async openApiKeyGuide() {
    await this.apiKeyGuideButton.click();
  }

  async clickOpenAITab() {
    await this.openaiTab.click();
  }

  async clickGroqTab() {
    await this.groqTab.click();
  }

  async clickAnthropicTab() {
    await this.anthropicTab.click();
  }

  async clickOpenRouterTab() {
    await this.openrouterTab.click();
  }

  async clickMistralTab() {
    await this.mistralTab.click();
  }

  async clickGeminiTab() {
    await this.geminiTab.click();
  }

  async clickAiMlTab() {
    await this.aimlTab.click();
  }

  async closeApiKeyGuide() {
    await this.closeGuideButton.click();
  }

  // Optional helper — cleaner than calling each one in test
  async visitAllGuideTabs() {
    await this.clickOpenAITab();
    await this.clickGroqTab();
    await this.clickAnthropicTab();
    await this.clickOpenRouterTab();
    await this.clickMistralTab();
    await this.clickGeminiTab();
    await this.clickAiMlTab();
  }
}