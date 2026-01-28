import { Page, expect } from '@playwright/test';

export type ServiceProvider =
    | 'Openai'
    | 'Mistral'
    | 'Anthropic'
    | 'Groq'
    | 'Gemini'
    | 'Ai ml'
    | 'Grok';

export class ModelPage {
    constructor(private page: Page) { }

    // -------------------------
    // NAVIGATION
    // -------------------------

    async openChatbotAgent(agentName: string) {
        // Go to org landing
        await this.page.goto('/org');

        // Open workspace
        await this.page.getByText('Ansh Pandit', { exact: true }).click();

        // Navigate to chatbot agents
        await this.page.goto('/org/57720/agents?type=chatbot');

        // Wait for hydration
        await this.page.waitForLoadState('networkidle');

        // Open agent dynamically (no hardcoded agent)
        await this.page
            .getByRole('table')
            .getByText(agentName, { exact: true })
            .click();

        // Open Model tab
        await this.page.getByRole('tab', { name: 'Model' }).click();

        // Ensure model config section is visible
        await expect(
            this.page.locator('#model-tab-config-section')
        ).toBeVisible();
    }



    // -------------------------
    // SERVICE PROVIDER
    // -------------------------

    async selectServiceProvider(provider: ServiceProvider) {
        const modelConfig = this.page.locator('#model-tab-config-section');

        // Scope to Service Provider row
        const serviceProviderRow = modelConfig
            .getByText('Service Provider', { exact: true })
            .locator('..');

        // Open dropdown
        await serviceProviderRow.getByRole('button').click();

        // Select provider
        await this.page
            .getByRole('listbox')
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
        const modelConfig = this.page.locator('#model-tab-config-section');

        // Open Model dropdown
        const modelRow = modelConfig
            .getByText('Model', { exact: true })
            .locator('..');

        await modelRow.getByRole('button').click();

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
            this.page.getByRole('button', {
                name: 'No API keys for this service',
            })
        ).toBeVisible();
    }

    async clickGetStarted() {
        await this.page
            .locator('#agent-setup-get-started-button')
            .click();
    }

    async expectApiKeyRequiredError() {
        await expect(
            this.page.getByText(/api key required/i)
        ).toBeVisible();
    }

    async selectApiKey(providerName: string) {
        await this.page
            .locator('#apikey-input-container')
            .getByRole('button', { name: providerName })
            .click();
    }

    async expectApiKeySelected() {
        await expect(
            this.page.locator('#chat-message-textarea')
        ).toBeVisible();
    }


}
