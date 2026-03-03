import type { Page, Locator } from "@playwright/test";

export class SettingsPage {
    readonly page: Page;
    readonly toneSelect: Locator;
    readonly responseStyleSelect: Locator;
    readonly guardrailsToggle: Locator;
    readonly addGuardrailBtn: Locator;
    readonly guardrailsCloseButton: Locator;
    readonly guardrailCustomCheckbox: Locator;
    readonly guardrailCustomPromptTextarea: Locator;
    readonly promptInjection: Locator;
    readonly bias: Locator;
    readonly webhookUrl: Locator;
    readonly webhookHeadersTextarea: Locator;
    readonly advancedConfiguration: Locator;
    readonly bridgeTypeApi: Locator;
    readonly bridgeTypeTrigger: Locator;
    readonly bridgeTypeToggleContainer: Locator;
    readonly embedHeader: Locator;

    // Starter question
    readonly starterQuestionContainer: Locator;
    readonly starterQuestionToggle: Locator;

    // Slug name
    readonly slugNameContainer: Locator;
    readonly slugNameInput: Locator;

    // User reference
    readonly userReferenceContainer: Locator;
    readonly richTextToggle: Locator;
    readonly userReferenceStatusSection: Locator;
    readonly userReferenceEditButton: Locator;
    readonly userReferenceInputSection: Locator;
    readonly userReferenceTextarea: Locator;

    // Response format
    readonly responseFormatApplyButton: Locator;

    // Tool call count
    readonly toolCallCountInput: Locator;

    // Triggers
    readonly triggersAddButton: Locator;
    readonly triggersAddFirstButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.toneSelect = page.getByTestId('tone-select');
        this.responseStyleSelect = page.getByTestId('response-style-select');
        this.guardrailsToggle = page.getByTestId('guardrails-toggle');
        this.addGuardrailBtn = page.getByTestId('guardrails-add-button');
        this.guardrailsCloseButton = page.getByTestId('guardrails-close-button');
        this.guardrailCustomCheckbox = page.getByTestId('guardrail-checkbox-custom');
        this.guardrailCustomPromptTextarea = page.getByTestId('guardrail-custom-prompt-textarea');
        this.promptInjection = page.getByTestId('guardrail-checkbox-prompt_injection');
        this.bias = page.getByTestId('guardrail-checkbox-bias');
        this.advancedConfiguration = page.getByTestId('advanced-configuration-container');
        this.webhookUrl = page.getByTestId('webhook-url-input');
        this.webhookHeadersTextarea = page.getByTestId('webhook-headers-textarea');
        this.bridgeTypeApi = page.getByTestId('bridge-type-api-radio');
        this.bridgeTypeTrigger = page.getByTestId('bridge-type-trigger-radio');
        this.bridgeTypeToggleContainer = page.getByTestId('bridge-type-toggle-container');
        this.embedHeader = page.locator('#viasocket-embed-header');

        // Starter question
        this.starterQuestionContainer = page.getByTestId('starter-question-container');
        this.starterQuestionToggle = page.getByTestId('starter-question-toggle');

        // Slug name
        this.slugNameContainer = page.getByTestId('slug-name-input-container');
        this.slugNameInput = page.getByTestId('slug-name-input');

        // User reference
        this.userReferenceContainer = page.getByTestId('user-reference-container');
        this.richTextToggle = page.getByTestId('rich-text-toggle');
        this.userReferenceStatusSection = page.getByTestId('user-reference-status-section');
        this.userReferenceEditButton = page.getByTestId('user-reference-edit-button');
        this.userReferenceInputSection = page.getByTestId('user-reference-input-section');
        this.userReferenceTextarea = page.getByTestId('user-reference-textarea');

        // Response format
        this.responseFormatApplyButton = page.getByTestId('response-format-apply-button');

        // Tool call count
        this.toolCallCountInput = page.getByTestId('tool-call-count-input');

        // Triggers
        this.triggersAddButton = page.getByTestId('triggers-add-button');
        this.triggersAddFirstButton = page.getByTestId('triggers-add-first-button');
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

    // --- Starter question ---

    async toggleStarterQuestion() {
        await this.starterQuestionToggle.click();
    }

    async checkStarterQuestion() {
        await this.starterQuestionToggle.check();
    }

    async uncheckStarterQuestion() {
        await this.starterQuestionToggle.uncheck();
    }

    async isStarterQuestionVisible(): Promise<boolean> {
        return this.starterQuestionContainer.isVisible();
    }

    // --- Slug name ---

    async fillSlugName(name: string) {
        await this.slugNameInput.fill(name);
    }

    async getSlugNameValue(): Promise<string> {
        return this.slugNameInput.inputValue();
    }

    async clearSlugName() {
        await this.slugNameInput.clear();
    }

    async isSlugNameVisible(): Promise<boolean> {
        return this.slugNameContainer.isVisible();
    }

    // --- User reference ---

    async toggleRichText() {
        await this.richTextToggle.click();
    }

    async checkRichText() {
        await this.richTextToggle.check();
    }

    async uncheckRichText() {
        await this.richTextToggle.uncheck();
    }

    async clickUserReferenceEdit() {
        await this.userReferenceEditButton.click();
    }

    async fillUserReference(text: string) {
        await this.userReferenceTextarea.fill(text);
    }

    async getUserReferenceValue(): Promise<string> {
        return this.userReferenceTextarea.inputValue();
    }

    async isUserReferenceVisible(): Promise<boolean> {
        return this.userReferenceContainer.isVisible();
    }

    // --- Response format ---

    selectResponseFormatRadio(value: string): Locator {
        return this.page.getByTestId(`response-format-radio-${value}`);
    }

    async clickResponseFormatRadio(value: string) {
        await this.selectResponseFormatRadio(value).click();
    }

    async clickResponseFormatApply() {
        await this.responseFormatApplyButton.click();
    }

    // --- Tool call count ---

    async fillToolCallCount(count: string) {
        await this.toolCallCountInput.fill(count);
    }

    async getToolCallCountValue(): Promise<string> {
        return this.toolCallCountInput.inputValue();
    }

    async clearToolCallCount() {
        await this.toolCallCountInput.clear();
    }

    // --- Triggers ---

    async clickAddTrigger() {
        await this.triggersAddButton.click();
    }

    async clickAddFirstTrigger() {
        await this.triggersAddFirstButton.click();
    }

    getTriggerCard(triggerId: string): Locator {
        return this.page.getByTestId(`trigger-card-${triggerId}`);
    }

    async clickTriggerCard(triggerId: string) {
        await this.getTriggerCard(triggerId).click();
    }

    // --- Guardrails extended ---

    async closeGuardrailOptions() {
        await this.guardrailsCloseButton.click();
    }

    getGuardrailCheckbox(key: string): Locator {
        return this.page.getByTestId(`guardrail-checkbox-${key}`);
    }

    async checkGuardrail(key: string) {
        await this.getGuardrailCheckbox(key).check();
    }

    async uncheckGuardrail(key: string) {
        await this.getGuardrailCheckbox(key).uncheck();
    }

    getGuardrailBadge(key: string): Locator {
        return this.page.getByTestId(`guardrail-badge-${key}`);
    }

    async checkCustomGuardrail() {
        await this.guardrailCustomCheckbox.check();
    }

    async fillCustomGuardrailPrompt(prompt: string) {
        await this.guardrailCustomPromptTextarea.fill(prompt);
    }

    async getCustomGuardrailPromptValue(): Promise<string> {
        return this.guardrailCustomPromptTextarea.inputValue();
    }

    // --- Webhook extended ---

    async getWebhookUrlValue(): Promise<string> {
        return this.webhookUrl.inputValue();
    }

    async clearWebhookUrl() {
        await this.webhookUrl.clear();
    }

    async fillWebhookHeaders(headers: string) {
        await this.webhookHeadersTextarea.fill(headers);
    }

    async getWebhookHeadersValue(): Promise<string> {
        return this.webhookHeadersTextarea.inputValue();
    }

    async clearWebhookHeaders() {
        await this.webhookHeadersTextarea.clear();
    }

    // --- Connected Agent Flow Panel ---

    private get agentFlowPanel(): Locator {
        return this.page.getByTestId('connected-agent-flow-panel');
    }

    private get agentFlowBackButton(): Locator {
        return this.page.getByTestId('agent-flow-back-button');
    }

    private get agentFlowCanvasContainer(): Locator {
        return this.page.getByTestId('agent-flow-canvas-container');
    }

    private get agentFlowSection(): Locator {
        return this.page.getByTestId('agent-flow-section');
    }

    async isAgentFlowPanelVisible(): Promise<boolean> {
        return this.agentFlowPanel.isVisible();
    }

    async clickAgentFlowBack() {
        await this.agentFlowBackButton.click();
    }

    async isAgentFlowCanvasVisible(): Promise<boolean> {
        return this.agentFlowCanvasContainer.isVisible();
    }
}