import type { Page, Locator } from "@playwright/test";

export class SettingsPage {
    readonly page: Page;
    readonly toneSelect: Locator;
    readonly responseStyleSelect: Locator;
    readonly guardrailsToggle: Locator;
    readonly addGuardrailBtn: Locator;
    readonly promptInjection: Locator;
    readonly bias: Locator;
    readonly webhookUrl: Locator;
    readonly advancedConfiguration: Locator;
    readonly bridgeTypeApi: Locator;
    readonly bridgeTypeTrigger: Locator;
    readonly embedHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.toneSelect = page.getByTestId('tone-select');
        this.responseStyleSelect = page.getByTestId('response-style-select');
        this.guardrailsToggle = page.getByTestId('guardrails-toggle');
        this.addGuardrailBtn = page.getByTestId('guardrails-add-button');
        this.promptInjection = page.getByTestId('guardrail-checkbox-prompt_injection');
        this.bias = page.getByTestId('guardrail-checkbox-bias');
        this.advancedConfiguration = page.getByTestId('advanced-configuration-container');
        this.webhookUrl = page.getByTestId('webhook-url-input');
        this.bridgeTypeApi = page.getByTestId('bridge-type-api-radio');
        this.bridgeTypeTrigger = page.getByTestId('bridge-type-trigger-radio');
        this.embedHeader = page.locator('#viasocket-embed-header');
    }

    async selectCustomMode() {
        await this.advancedConfiguration.getByText('Custom').click();
    }

    async selectDefaultMode() {
        await this.advancedConfiguration.getByText('Default').click();
    }

    async ensureApiMode() {
        if (!await this.bridgeTypeApi.isChecked()) {
            await this.page.locator('#viasocket-embed-close-button').click();
            await this.bridgeTypeApi.click();
        }
    }

    async checkTriggerRadio() {
        if (!await this.bridgeTypeTrigger.isChecked()) {
            await this.bridgeTypeTrigger.click();
        }
    }

    async closeEmbedIfVisible() {
        if (await this.embedHeader.isVisible()) {
            await this.page.locator('#viasocket-embed-close-button').click();
        }
    }

    async selectApiRadio() {
        await this.bridgeTypeApi.click();
    }

    async selectTone(tone: string) {
        await this.toneSelect.selectOption(tone);
    }

    async selectResponseStyle(style: string) {
        await this.responseStyleSelect.selectOption(style);
    }

    async toggleGuardrails() {
        await this.guardrailsToggle.click();
    }

    async checkGuardrailToggle() {
        await this.guardrailsToggle.check();
    }

    async uncheckGuardrailToggle() {
        await this.guardrailsToggle.uncheck();
    }

    async clickAddGuardrailTypes() {
        await this.addGuardrailBtn.click();
    }

    async fillWebhookUrl(url: string) {
        await this.webhookUrl.fill(url);
    }

    async fillHeaders(headers: string) {
        await this.page.getByRole('textbox', { name: 'Headers (JSON format)' }).fill(headers);
    }

    async clickHiddenElement() {
        await this.page.locator('.hidden').first().click();
    }

    async checkPromptInjection() {
        await this.promptInjection.check();
    }

    async uncheckPromptInjection() {
        await this.promptInjection.uncheck();
    }

    async checkBias() {
        await this.bias.check();
    }

    async uncheckBias() {
        await this.bias.uncheck();
    }

    getByText(text: string) {
        return this.page.getByText(text);
    }
}
