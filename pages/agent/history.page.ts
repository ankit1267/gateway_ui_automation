import { Page, Locator, expect } from '@playwright/test';

export class HistoryPage {
    private readonly page: Page;
    private readonly toolItem: Locator;
    private readonly closeToolItemBtn: Locator;
    private readonly threadItemVar: Locator;
    private readonly pre_function: Locator;

    // Thread container
    private readonly threadContainer: Locator;
    private readonly threadScrollableDiv: Locator;
    private readonly scrollToBottomButton: Locator;

    // Thread item buttons
    private readonly aiConfigButton: Locator;
    private readonly systemPromptButton: Locator;
    private readonly moreButton: Locator;

    // Message type selectors
    private readonly selectChatbotMessage: Locator;
    private readonly selectLlmMessage: Locator;
    private readonly selectUpdatedMessage: Locator;

    // Tools data modal
    private readonly toolsDataModal: Locator;

    // History sidebar
    private readonly advanceFilter: Locator;
    private readonly advanceFilterToggle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.toolItem = page
            .locator('[data-testid^="thread-item-tool-data-"]')
            .first();
        this.closeToolItemBtn = page.getByTestId('tools-data-modal-close-button');
        this.threadItemVar = page.getByTestId('thread-item-user-variables-button').first();
        this.pre_function = page.getByRole('heading', { name: 'pre_function' });

        // Thread container
        this.threadContainer = page.getByTestId('thread-container');
        this.threadScrollableDiv = page.getByTestId('thread-container-scrollable-div');
        this.scrollToBottomButton = page.getByTestId('thread-container-scroll-to-bottom');

        // Thread item buttons
        this.aiConfigButton = page.getByTestId('thread-item-user-aiconfig-button').first();
        this.systemPromptButton = page.getByTestId('thread-item-user-system-prompt-button').first();
        this.moreButton = page.getByTestId('thread-item-user-more-button').first();

        // Message type selectors
        this.selectChatbotMessage = page.getByTestId('thread-item-select-chatbot-message');
        this.selectLlmMessage = page.getByTestId('thread-item-select-llm-message');
        this.selectUpdatedMessage = page.getByTestId('thread-item-select-updated-message');

        // Tools data modal
        this.toolsDataModal = page.getByTestId('tools-data-modal');

        // History sidebar
        this.advanceFilter = page.getByTestId('history-sidebar-advance-filter');
        this.advanceFilterToggle = page.getByTestId('history-sidebar-advance-filter-toggle');
    }

    async verifyPreFunctionVisible() {
        await expect(this.pre_function).toBeVisible();
    }

    async openThreadItemVar() {
        await this.threadItemVar.click();
    }

    async waitForVisible() {
        await expect(this.toolItem).toBeVisible({ timeout: 10000 });
    }

    async waitForJustNowVisible() {
        await expect(this.page.getByText('Just now').first()).toBeVisible({ timeout: 10000 });
    }

    async openToolItem() {
        await this.waitForVisible();
        await this.toolItem.click();
    }

    async verifyPreToolVariableVisible(message: string | RegExp) {
        const preFunctionSection = this.page
            .getByRole('heading', { name: 'pre_function' })
            .locator('..');

        await expect(preFunctionSection).toContainText(message);
    }
    async verifyVariableVisible(message: string | RegExp) {
        await expect(
            this.page.getByText(message)
        ).toBeVisible();
    }

    async closeToolItem() {
        await this.closeToolItemBtn.click();
    }

    // --- Thread container ---

    async isThreadContainerVisible(): Promise<boolean> {
        return this.threadContainer.isVisible();
    }

    async scrollToBottom() {
        await this.scrollToBottomButton.click();
    }

    async isScrollToBottomVisible(): Promise<boolean> {
        return this.scrollToBottomButton.isVisible();
    }

    // --- Thread item actions ---

    async clickAiConfig() {
        await this.aiConfigButton.click();
    }

    async clickSystemPrompt() {
        await this.systemPromptButton.click();
    }

    async clickMore() {
        await this.moreButton.click();
    }

    // --- Message by ID ---

    getMessageById(messageId: string): Locator {
        return this.page.getByTestId(`message-${messageId}`);
    }

    // --- Tool items by key ---

    getToolByKey(toolKey: string): Locator {
        return this.page.getByTestId(`thread-item-tool-${toolKey}`);
    }

    getToolLogs(toolKey: string): Locator {
        return this.page.getByTestId(`thread-item-tool-logs-${toolKey}`);
    }

    getToolData(toolKey: string): Locator {
        return this.page.getByTestId(`thread-item-tool-data-${toolKey}`);
    }

    // --- Message type selectors ---

    async selectChatbotMessageType() {
        await this.selectChatbotMessage.click();
    }

    async selectLlmMessageType() {
        await this.selectLlmMessage.click();
    }

    async selectUpdatedMessageType() {
        await this.selectUpdatedMessage.click();
    }

    // --- Tools data modal ---

    async isToolsDataModalVisible(): Promise<boolean> {
        return this.toolsDataModal.isVisible();
    }

    // --- Image open new tab ---

    async clickImageOpenNewTab() {
        await this.page.getByTestId('thread-item-image-open-new-tab').click();
    }

    // --- History sidebar filters ---

    async toggleAdvanceFilter() {
        await this.advanceFilterToggle.click();
    }

    async isAdvanceFilterVisible(): Promise<boolean> {
        return this.advanceFilter.isVisible();
    }

    async selectFilterOption(value: string) {
        await this.page.getByTestId(`history-sidebar-filter-${value}`).click();
    }

    // --- History sidebar extended ---

    private get versionSelect(): Locator {
        return this.page.getByTestId('history-sidebar-version-select');
    }

    private get searchInput(): Locator {
        return this.page.getByTestId('history-sidebar-search-input');
    }

    private get searchClear(): Locator {
        return this.page.getByTestId('history-sidebar-search-clear');
    }

    private get errorToggle(): Locator {
        return this.page.getByTestId('history-sidebar-error-toggle');
    }

    async selectVersion(value: string) {
        await this.versionSelect.selectOption(value);
    }

    async getSelectedVersion(): Promise<string> {
        return this.versionSelect.inputValue();
    }

    async searchHistory(query: string) {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
    }

    async clearSearch() {
        await this.searchClear.click();
    }

    async isSearchClearVisible(): Promise<boolean> {
        return this.searchClear.isVisible();
    }

    async toggleErrorHistory() {
        await this.errorToggle.click();
    }

    async isErrorToggleChecked(): Promise<boolean> {
        return this.errorToggle.isChecked();
    }

    // --- Chat details slider ---

    private get chatDetailsSlider(): Locator {
        return this.page.getByTestId('chat-details-slider');
    }

    private get chatDetailsCloseButton(): Locator {
        return this.page.getByTestId('chat-details-close-button');
    }

    private get chatDetailsCopyDropdown(): Locator {
        return this.page.getByTestId('chat-details-variables-copy-dropdown');
    }

    private get chatDetailsCopyCurrentValues(): Locator {
        return this.page.getByTestId('chat-details-copy-current-values');
    }

    private get chatDetailsCopyKeyValuePairs(): Locator {
        return this.page.getByTestId('chat-details-copy-key-value-pairs');
    }

    private get chatDetailsCopySystemPrompt(): Locator {
        return this.page.getByTestId('chat-details-copy-system-prompt');
    }

    async isChatDetailsVisible(): Promise<boolean> {
        return this.chatDetailsSlider.isVisible();
    }

    async closeChatDetails() {
        await this.chatDetailsCloseButton.click();
    }

    async openCopyDropdown() {
        await this.chatDetailsCopyDropdown.click();
    }

    async copyCurrentValues() {
        await this.chatDetailsCopyCurrentValues.click();
    }

    async copyKeyValuePairs() {
        await this.chatDetailsCopyKeyValuePairs.click();
    }

    async copySystemPrompt() {
        await this.chatDetailsCopySystemPrompt.click();
    }

    // --- Date range picker ---

    private get dateRangePicker(): Locator {
        return this.page.getByTestId('history-date-range-picker');
    }

    private get dateRangeFromInput(): Locator {
        return this.page.getByTestId('history-date-range-from-input');
    }

    private get dateRangeToInput(): Locator {
        return this.page.getByTestId('history-date-range-to-input');
    }

    private get dateRangeApplyButton(): Locator {
        return this.page.getByTestId('history-date-range-apply-button');
    }

    private get dateRangeClearButton(): Locator {
        return this.page.getByTestId('history-date-range-clear-button');
    }

    async isDateRangePickerVisible(): Promise<boolean> {
        return this.dateRangePicker.isVisible();
    }

    async fillDateFrom(value: string) {
        await this.dateRangeFromInput.fill(value);
    }

    async fillDateTo(value: string) {
        await this.dateRangeToInput.fill(value);
    }

    async applyDateRange() {
        await this.dateRangeApplyButton.click();
    }

    async clearDateRange() {
        await this.dateRangeClearButton.click();
    }

    async setDateRange(from: string, to: string) {
        await this.fillDateFrom(from);
        await this.fillDateTo(to);
        await this.applyDateRange();
    }
}