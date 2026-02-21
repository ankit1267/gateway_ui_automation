import { Page, expect } from '@playwright/test';
import { ModelSelectors } from '../selectors/model.selectors';
import { navigateToAgents } from '../utils/navigation';

export type ServiceProvider =
    | 'Openai'
    | 'Mistral'
    | 'Anthropic'
    | 'Groq'
    | 'Gemini'
    | 'Ai ml'
    | 'Grok';

const ORG_NAME = process.env.WORKSPACE_NAME;

export class ModelPage {
    constructor(private page: Page) { }

    // -------------------------
    // NAVIGATION
    // -------------------------

    async openChatbotAgent(agentName: string) {

        await navigateToAgents(this.page, 'chatbot');

        // Wait for hydration
        // await this.page.waitForLoadState('networkidle');

        // Open agent dynamically (no hardcoded agent)
        await this.page
            .getByRole('table')
            .getByText(agentName, { exact: true })
            .click();

        // Open Model tab
        await this.page.locator(ModelSelectors.modelTab).click();

        // Ensure model config section is visible
        await expect(
            this.page.locator(ModelSelectors.modelConfigSection)
        ).toBeVisible();
    }

    async openModelTab() {
        const agentName = process.env.AGENT_NAME!;

        await navigateToAgents(this.page, 'api');

        await this.page
            .getByRole('table')
            .getByText(agentName, { exact: true })
            .click();

        await this.page
            .locator(ModelSelectors.modelTab)
            .click();
    }



    // -------------------------
    // SERVICE PROVIDER
    // -------------------------

    async selectServiceProvider(provider: ServiceProvider) {
        const modelConfig = this.page.locator(ModelSelectors.modelConfigSection);

        // Scope to Service Provider row
        const serviceProviderRow = modelConfig
            .getByText(ModelSelectors.serviceProviderLabel, { exact: true })
            .locator('..');

        // Open dropdown
        await serviceProviderRow.locator(ModelSelectors.dropdownButton).click();

        // Select provider
        await this.page
            .locator(ModelSelectors.listbox)
            .getByRole('option', { name: provider, exact: true })
            .click();

        // Assert selection
        await expect(
            serviceProviderRow.getByRole('button', { name: provider })
        ).toBeVisible();
    }

    // -------------------------
    // MODEL LIST ASSERTION
    // -------------------------
    async expectModelsVisible(models: string[]) {
        const modelConfig = this.page.locator(ModelSelectors.modelConfigSection);

        // Open Model dropdown
        const modelRow = modelConfig
            .getByText(ModelSelectors.modelLabel, { exact: true })
            .locator('..');

        await modelRow.locator(ModelSelectors.dropdownButton).click();

        // Assert each expected model is visible
        for (const model of models) {
            await expect(
                this.page.getByRole('option', { name: model, exact: true })
            ).toBeVisible();
        }
    }

    // -------------------------
    // API KEY ASSERTIONS
    // -------------------------

    async expectNoApiKeysMessage() {
        await expect(
            this.page.locator(ModelSelectors.noApiKeysMessage)
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

    async expectChatBotVisible() {
        await expect(
            this.page.locator(ModelSelectors.iframeEmbed)
        ).toBeVisible();
    }


}
