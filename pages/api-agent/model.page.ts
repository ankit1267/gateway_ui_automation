import { Page, expect } from '@playwright/test';
import { ModelSelectors } from '../../selectors/api_agent/model.selectors';

export type ServiceProvider =
  | 'Openai'
  | 'Mistral'
  | 'Anthropic'
  | 'Groq'
  | 'Gemini'
  | 'Ai ml'
  | 'Grok';

export class ModelPage {
  constructor(private page: Page) {}

  // -------------------------
  // OPEN MODEL TAB
  // -------------------------
  async openModelTab() {
    const workspaceName = process.env.WORKSPACE_NAME!;
    const agentName = process.env.AGENT_NAME!;

    await this.page.goto('/org');

    await this.page
      .getByText(workspaceName, { exact: true })
      .click();

    await this.page
      .getByRole('table')
      .getByText(agentName, { exact: true })
      .click();

    await this.page
      .getByRole('tab', { name: 'Model' })
      .click();
  }

  // -------------------------
  // SELECT SERVICE PROVIDER
  // -------------------------
  async selectServiceProvider(provider: ServiceProvider) {
    const modelConfig = this.page.locator(
      ModelSelectors.modelConfigSection
    );

    const serviceProviderRow = modelConfig
      .getByText(ModelSelectors.serviceProviderLabel, {
        exact: true,
      })
      .locator('..');

    await serviceProviderRow
      .getByRole('button')
      .click();

    await this.page
      .getByRole('listbox')
      .getByRole('option', {
        name: provider,
        exact: true,
      })
      .click();

    await expect(
      serviceProviderRow.getByRole('button', {
        name: provider,
      })
    ).toBeVisible();
  }

  // -------------------------
  // OPEN MODEL DROPDOWN
  // -------------------------
  async openModelDropdown() {
    await this.page
      .locator(ModelSelectors.modelConfigSection)
      .getByText(ModelSelectors.modelLabel, { exact: true })
      .locator('..')
      .getByRole('button')
      .click();
  }

  // -------------------------
  // ASSERT MODELS
  // -------------------------
  async expectModelsVisible(models: string[]) {
    for (const model of models) {
      await expect(
        this.page.getByRole('option', {
          name: model,
          exact: true,
        })
      ).toBeVisible();
    }
  }

  // -------------------------
  // API KEY RELATED METHODS
  // -------------------------

  async expectNoApiKeysMessage() {
    await expect(
      this.page.getByRole('button', {
        name: 'No API keys for this service',
      })
    ).toBeVisible();
  }

  async clickGetStarted() {
    await this.page
      .locator(ModelSelectors.getStartedButton)
      .click();
  }

  async expectApiKeyRequiredError() {
    await expect(
      this.page.getByText(ModelSelectors.apiKeyErrorText)
    ).toBeVisible();
  }

  async selectApiKey(providerName: string) {
    await this.page
      .locator(ModelSelectors.apiKeyInputContainer)
      .getByRole('button', { name: providerName })
      .click();
  }

  async expectChatTextareaVisible() {
    await expect(
      this.page.locator(ModelSelectors.chatTextarea)
    ).toBeVisible();
  }
}
