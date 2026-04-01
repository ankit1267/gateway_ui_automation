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

    async setSliderValue(parameterName: string, targetValue: number) {
        const slider = this.page.getByTestId(`advanced-param-slider-${parameterName}`);
        const box = await slider.boundingBox();
        if (!box) throw new Error(`Slider ${parameterName} not found or not visible`);

        const min = Number(await slider.getAttribute('min'));
        const max = Number(await slider.getAttribute('max'));
        const ratio = (targetValue - min) / (max - min);
        const targetX = box.x + box.width * ratio;
        const targetY = box.y + box.height / 2;

        await this.page.mouse.click(targetX, targetY);
        await slider.focus();

        let currentVal = Number(await slider.inputValue());
        let diff = targetValue - currentVal;

        if (Math.abs(diff) > 10) {
            await slider.evaluate((el, step) => { (el as HTMLInputElement).step = String(Math.abs(step)); }, diff);
            await this.page.keyboard.press(diff > 0 ? 'ArrowRight' : 'ArrowLeft');
            await slider.evaluate(el => { (el as HTMLInputElement).step = '1'; });
            currentVal = Number(await slider.inputValue());
            diff = targetValue - currentVal;
        }

        const key = diff > 0 ? 'ArrowRight' : 'ArrowLeft';
        for (let i = 0; i < Math.abs(diff); i++) {
            await this.page.keyboard.press(key);
        }

        return Number(await slider.inputValue());
    }

    async getSliderValue(parameterName: string): Promise<string> {
        return this.page.getByTestId(`advanced-param-slider-${parameterName}`).inputValue();
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
        const checkbox = this.page.getByTestId('advanced-param-checkbox-parallel_tool_calls');
        
        // Wait for checkbox to be enabled and stable
        await checkbox.waitFor({ state: 'attached', timeout: 5000 });
        await checkbox.waitFor({ state: 'visible', timeout: 5000 });
        
        // Check current state and only toggle if needed
        const currentState = await checkbox.isChecked();
        
        if (check !== currentState) {
            if (check) {
                await checkbox.check({ timeout: 5000 });
            } else {
                await checkbox.uncheck({ timeout: 5000 });
            }
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
    // MODEL HOVER PREVIEW
    // -------------------------

    async openModelDropdown() {
        await this.model.click();
    }

    async hoverOverModelOption(modelName: string) {
        const option = this.page.getByTestId(`model-dropdown-grouped-option-${modelName}`);
        await expect(option).toBeVisible();
        await option.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(2000);
        const box = await option.boundingBox();
        // Hover left edge to avoid the preview portal that renders to the right of the dropdown
        await this.page.mouse.move(box!.x + 10, box!.y + box!.height / 2);
        await this.page.waitForTimeout(2000);
    }

    async expectModelPreviewVisible() {
        await expect(this.page.getByTestId('model-preview-container')).toBeVisible({ timeout: 10000 });
    }

// ... (rest of the code remains the same)
    async expectModelPreviewNotVisible() {
        await expect(this.page.getByTestId('model-preview-container')).not.toBeVisible();
    }

    async expectModelPreviewContainsName(modelName: string) {
        await expect(
            this.page.getByTestId('model-preview-container').getByRole('heading', { name: modelName })
        ).toBeVisible();
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

async selectModel(modelName: string) {
    await this.model.click();
    await this.page.getByTestId(`model-dropdown-grouped-option-${modelName.toLowerCase()}`).click();
}

async expectParameterVisible(paramName: string) {
    await expect(this.page.locator(`#advanced-param-field-${paramName}`)).toBeVisible();
}

async expectParameterNotVisible(paramName: string) {
    await expect(this.page.locator(`#advanced-param-field-${paramName}`)).not.toBeVisible();
}

async fillAdvancedParameterText(paramName: string, value: string) {
    const input = this.page.getByTestId(`advanced-param-text-${paramName}`);
    await input.clear();
    await input.pressSequentially(value, { delay: 50 });
    await expect(input).toHaveValue(value);
}

async clickOutsideToSave() {
    await this.page.getByTestId('model-tab-container').click();
}

    // -------------------------
    // AUTO SELECT MODEL
    // -------------------------

    async checkAutoSelectModelToggle() {
        await this.page.getByTestId('auto-select-model-toggle').check();
    }

    async uncheckAutoSelectModelToggle() {
        await this.page.getByTestId('auto-select-model-toggle').uncheck();
    }

    async isAutoSelectModelToggleChecked(): Promise<boolean> {
        return this.page.getByTestId('auto-select-model-toggle').isChecked();
    }

    async getSelectedModelText(): Promise<string> {
        return (await this.model.textContent()) ?? '';
    }

    async expectModelAutoSelected() {
        await expect(this.model).not.toContainText('Select model');
    }

    async expectModelNotAutoSelected() {
        await expect(this.model).toContainText('Select model');
    }
}