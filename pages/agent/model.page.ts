import { Page, Locator, expect } from '@playwright/test';

export type ServiceProvider =
    | 'Openai'
    | 'Mistral'
    | 'Anthropic'
    | 'Groq'
    | 'Gemini'
    | 'Ai_ml'
    | 'Grok';

export class ModelPage {
    private readonly modelConfigSection: Locator;

    private readonly serviceProvider: Locator;
    private readonly model: Locator;

    private readonly dropdownButton: string;
    private readonly listbox: Locator;

    private readonly noApiKeysMessage: Locator;
    private readonly getStartedButton: Locator;
    private readonly apiKeyErrorText: RegExp;
    private readonly apiKeyInputContainer: Locator;

    private readonly chatTextarea: Locator;
    private readonly iframeEmbed: Locator;

    constructor(private page: Page) {
        // config section
        this.modelConfigSection = page.getByTestId('model-tab-config-section');

        // labels
        this.serviceProvider = this.modelConfigSection.getByTestId('service-dropdown-trigger-button');
        this.model = this.modelConfigSection.getByTestId('model-dropdown-trigger-button');

        // generic
        this.dropdownButton = 'role=button';
        this.listbox = page.locator('role=listbox');

        // API key
        this.noApiKeysMessage = page.getByRole('button', {
            name: 'No API keys for this service'
        });

        this.getStartedButton = page.locator('#agent-setup-get-started-button');

        this.apiKeyErrorText = /api key required/i;

        this.apiKeyInputContainer = page.locator('#apikey-input-container');

        this.chatTextarea = page.locator('#chat-message-textarea');
        this.iframeEmbed = page.locator('#iframe-component-interfaceEmbed');
    }

    // -------------------------
    // SERVICE PROVIDER
    // -------------------------

    async selectServiceProvider(provider: ServiceProvider) {
        await this.serviceProvider.click();
        await this.page.getByTestId(`service-dropdown-option-${provider.toLowerCase()}`).click();
    }

    // -------------------------
    // MODEL LIST ASSERTION
    // -------------------------

    async expectModelsVisible(models: string[]) {


        await this.model.click();

        for (const model of models) {
            await expect(
                this.page.getByTestId(`model-dropdown-grouped-option-${model.toLowerCase()}`)
            ).toBeVisible();
        }
    }

    // -------------------------
    // API KEY ASSERTIONS
    // -------------------------

    async expectNoApiKeysMessage() {
        await expect(this.noApiKeysMessage).toBeVisible();
    }

    async clickGetStarted() {
        await this.getStartedButton.click();
    }

    async expectApiKeyRequiredError() {
        await expect(
            this.page.getByText(this.apiKeyErrorText)
        ).toBeVisible();
    }

    async selectApiKey(providerName: string) {
        await this.apiKeyInputContainer
            .getByRole('button', { name: providerName })
            .click();
    }

    async expectChatTextareaVisible() {
        await expect(this.chatTextarea).toBeVisible();
    }

    async expectChatBotVisible() {
        await expect(this.iframeEmbed).toBeVisible();
    }

    // -------------------------
    // ADVANCED PARAMETERS
    // -------------------------

    async fillAdvancedParameter(parameterName: string, value: string) {
        await this.page.getByTestId(`advanced-param-slider-${parameterName}`).fill(value);
    }

    async clickAdvancedParameterMaxBtn(parameterName: string) {
        await this.page.getByTestId(`advanced-param-slider-max-btn-${parameterName}`).click();
    }

    async clickAdvancedParameterMinBtn(parameterName: string) {
        await this.page.getByTestId(`advanced-param-slider-min-btn-${parameterName}`).click();
    }

    async clickAdvancedParameterResetBtn(parameterName: string) {
        await this.page.getByTestId(`advanced-param-reset-${parameterName}`).click();
    }

    async clickAdvancedParameterDropdown(parameterName: string) {
        await this.page.getByTestId(`advanced-param-dropdown-trigger-${parameterName}`).click();
    }
    async expectAdvancedParameterMenuVisible(parameterName: string) {
        await expect(this.page.getByTestId(`advanced-param-dropdown-menu-${parameterName}`)).toBeVisible();
    }

    async selectReasoningDropdownDefault() {
        await this.page.locator('.lucide.lucide-chevron-up').click();
        await this.page.locator('div').filter({ hasText: /^ReasoningSet Defaultdefaultminimallowmediumhigh$/ }).first().click();
    }

    // -------------------------
    // FALLBACK MODEL
    // -------------------------

    async toggleParallelToolChoice(check: boolean) {
        if (check) {
            await this.page.getByTestId('advanced-param-checkbox-parallel_tool_calls').check();
        } else {
            await this.page.getByTestId('advanced-param-checkbox-parallel_tool_calls').uncheck();
        }
    }

    async clickFallbackServiceDropdown() {
        await this.page.getByTestId('fallback-service-dropdown-button').click();
    }

    async clickFallbackModelDropdown() {
        await this.page.getByTestId('fallback-model-dropdown-button').click();
    }

    async expectFallbackModelDropdownVisible() {
        await expect(this.page.getByTestId('fallback-model-dropdown-menu')).toBeVisible();
    }

    async expectFallbackServiceDropdownVisible() {
        await expect(this.page.getByTestId('fallback-service-dropdown-menu')).toBeVisible();
    }

    async toggleFallbackModel(check: boolean) {
        if (check) {
            await this.page.getByTestId('fallback-model-toggle').check();
        } else {
            await this.page.getByTestId('fallback-model-toggle').uncheck();
        }
    }


    async expectEnableFallbackModelTextVisible() {
        await expect(this.page.getByText('Enable fallback model')).toBeVisible();
    }

    async expectFallbackModelContainerVisible() {
        await expect(this.page.locator('.w-full.p-3.border.border-base-200')).toBeVisible();
    }

    async clickConfigureApiKey() {
        await this.page.locator('div').filter({ hasText: /^Configure API keys\.\.\.$/ }).nth(2).click();
    }

    async expectDropdownApiKeyVisible() {
        await expect(this.page.getByText('AnthropicNo API keys available for AnthropicGroqNo API keys available for')).toBeVisible();
    }

    // -------------------------
    // FALLBACK MODEL EXTENDED
    // -------------------------

    async selectFallbackService(serviceValue: string) {
        await this.clickFallbackServiceDropdown();
        await this.page.getByTestId(`fallback-service-item-${serviceValue}`).click();
    }

    async isFallbackSameModelAlertVisible(): Promise<boolean> {
        return this.page.getByTestId('fallback-model-same-model-alert').isVisible();
    }

    getFallbackServiceItem(serviceValue: string): Locator {
        return this.page.getByTestId(`fallback-service-item-${serviceValue}`);
    }

    // -------------------------
    // MODEL CONFIG VISIBILITY
    // -------------------------

    async isModelConfigSectionVisible(): Promise<boolean> {
        return this.modelConfigSection.isVisible();
    }

    async isServiceProviderVisible(): Promise<boolean> {
        return this.serviceProvider.isVisible();
    }

    async isModelDropdownVisible(): Promise<boolean> {
        return this.model.isVisible();
    }

    // -------------------------
    // API KEY INPUT
    // -------------------------

    async clickApikeyDropdown() {
        await this.page.getByTestId('apikey-input-dropdown').click();
    }

    async isApikeyInputVisible(): Promise<boolean> {
        return this.apiKeyInputContainer.isVisible();
    }

    async selectApikeyByName(name: string) {
        await this.clickApikeyDropdown();
        await this.page.getByRole('option', { name }).click();
    }

    async clickAddNewApiKey() {
        await this.clickApikeyDropdown();
        await this.page.getByText('+  Add new API Key').click();
    }
}