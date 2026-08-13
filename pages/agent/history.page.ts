import { Page, Locator, expect } from '@playwright/test';



export class HistoryPage {

    private readonly page: Page;

    private readonly toolItem: Locator;

    private readonly closeToolItemBtn: Locator;

    private readonly threadItemVar: Locator;

    private readonly pre_function: Locator;

    private readonly showGeneratedButton: Locator;



    // Thread container

    private readonly threadContainer: Locator;

    private readonly threadScrollableDiv: Locator;

    private readonly scrollToBottomButton: Locator;



    // Thread item buttons

    private readonly aiConfigButton: Locator;

    private readonly systemPromptButton: Locator;

    private readonly moreButton: Locator;

    private readonly latencyButton: Locator;



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

      this.pre_function = page.locator('span').filter({ hasText: 'pre_function' }).first();

        this.showGeneratedButton = page.getByTestId('edit-message-show-generated-button');



        // Thread container

        this.threadContainer = page.getByTestId('thread-container');

        this.threadScrollableDiv = page.getByTestId('thread-container-scrollable-div');

        this.scrollToBottomButton = page.getByTestId('thread-container-scroll-to-bottom');



        // Thread item buttons

        this.aiConfigButton = page.getByTestId('thread-item-user-aiconfig-button').first();

        this.systemPromptButton = page.getByTestId('thread-item-user-system-prompt-button').first();

        this.moreButton = page.getByTestId('thread-item-user-more-button').first();

        this.latencyButton = page.getByTestId('thread-item-user-latency-button').first();



        // Message type selectors

        this.selectChatbotMessage = page.getByTestId('thread-item-select-chatbot-message');

        this.selectLlmMessage = page.getByTestId('thread-item-select-llm-message');

        this.selectUpdatedMessage = page.getByTestId('thread-item-select-updated-message');



        // Tools data modal

        this.toolsDataModal = page.getByTestId('tools-data-modal').first();



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

     const preFunctionRow = this.pre_function.locator('..');



        await expect(preFunctionRow).toContainText(message);

    }

    async verifyVariableVisible(message: string | RegExp) {

        await this.toolsDataModal.waitFor({ state: 'visible' });

        await expect(this.toolsDataModal).toContainText(message, { timeout: 30000 });

    }



    async closeToolItem() {

        await this.closeToolItemBtn.click();

    }



    async clickMainAgent() {

        const mainAgent = this.page.locator('[data-testid^="trace-agent-header-"]').filter({ hasText: /Sales Assistant|Parental Guidance/ }).first();

        await expect(mainAgent).toBeVisible();

        await mainAgent.click();

    }



    async clickSubAgent() {

        const subAgent = this.page.locator('[data-testid="trace-agent-header-sales_agent_B"]');

        await expect(subAgent).toBeVisible();

        await subAgent.click();

    }



    async verifyTraceAgentVariable(key: string, value: string) {

        const traceAgentSection = this.page.locator('[data-testid="trace-agent-header-sales_agent_B"]').locator('..').locator('..');

        await expect(traceAgentSection).toBeVisible();

        const variableBlockHeader = traceAgentSection.locator('[data-testid="variables-block-header"]');

        await expect(variableBlockHeader).toBeVisible();

        await variableBlockHeader.click();

        const variableBlockExpanded = traceAgentSection.locator('[data-testid="variables-block-expanded"]');

        await expect(variableBlockExpanded).toBeVisible();

        const variableRow = variableBlockExpanded.locator('div').filter({ hasText: key }).filter({ hasText: value });

        await expect(variableRow).toBeVisible({ timeout: 30000 });

    }



    async verifyVariableInModal(key: string, value: string) {

        await this.toolsDataModal.waitFor({ state: 'visible' });

        const variableRow = this.toolsDataModal.locator('div').filter({ hasText: key }).filter({ hasText: value });

        await expect(variableRow).toBeVisible({ timeout: 30000 });

    }



    // --- Thread container ---



    private get firstSidebarThread(): Locator {

        return this.page

            .locator('li[data-testid^="history-sidebar-thread-"]:not([data-testid^="history-sidebar-thread-toggle-"])')

            .first();

    }



    private get sidebarThreads(): Locator {

        return this.page

            .locator('li[data-testid^="history-sidebar-thread-"]:not([data-testid^="history-sidebar-thread-toggle-"])');

    }



    private get firstThreadResponseItem(): Locator {

        return this.page.locator('[data-testid^="thread-item-"]').first();

    }



    async isThreadContainerVisible(): Promise<boolean> {

        return this.threadContainer.isVisible();

    }



    async expectThreadContainerVisible() {

        await expect(this.threadContainer).toBeVisible();

    }



    async openFirstSidebarThread() {

        await expect(this.firstSidebarThread).toBeVisible();

        await this.firstSidebarThread.click();

    }



    async openFirstSidebarThreadAndGetApiStatus(): Promise<number> {

        await expect(this.firstSidebarThread).toBeVisible();



        const threadCount = await this.sidebarThreads.count();

        const maxAttempts = Math.min(threadCount, 3);



        for (let index = 0; index < maxAttempts; index++) {

            const responsePromise = this.page

                .waitForResponse((response) => {

                    const url = decodeURIComponent(response.url());

                    return response.request().method() === 'GET'

                        && url.includes('/api/history/')

                        && (

                            url.includes('thread_id=')

                            || url.includes('message_id=')

                            || /\/api\/history\/[^/?]+/.test(url)

                        );

                }, { timeout: 7000 })

                .catch(() => null);



            await this.sidebarThreads.nth(index).click();



            const response = await responsePromise;

            if (response) {

                return response.status();

            }

        }



        throw new Error('No history detail API response captured after clicking visible sidebar threads.');

    }



    async expectThreadResponseVisible() {

        await expect(this.threadContainer).toBeVisible();

        await expect(this.firstThreadResponseItem).toBeVisible();

    }



    async hoverGroupChatAgentsResponse() {

        const responseBubble = this.page.getByTestId('final-response-card').first();



        await expect(responseBubble).toBeVisible();

        await responseBubble.hover();

    }



    async expectGroupChatHoverActionsVisible() {

        const editMessageButton = this.page.getByTestId('thread-item-edit-message-button').first();

        const editMessageTooltip = editMessageButton.locator('xpath=ancestor::div[@data-tip][1]');



        await expect(this.page.locator('#thread-item-add-test-case-button').first()).toBeVisible();

        await expect(this.page.locator('#thread-item-debug-agent-button').first()).toBeVisible();

        await expect(editMessageButton).toBeVisible();

       

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



    async clickLastAiConfig() {

        await this.page.getByTestId('thread-item-user-aiconfig-button').last().click();

    }



    async clickSystemPrompt() {

        await this.systemPromptButton.click();

    }



    async clickMore() {

        await this.moreButton.click();

    }

    async clicklatency() {

        await this.latencyButton.click();

    }



    async clickVisualizeButton() {

        const visualizeButton = this.page.locator('button', { hasText: 'Visualize' }).first();

        await expect(visualizeButton).toBeVisible();

        await visualizeButton.click();

    }



    async closeVisualize() {

        const goBackButton = this.page.getByTestId('visualize-go-back');

        await expect(goBackButton).toBeVisible();

        await goBackButton.click();

    }



    async expectChatDetailsSliderVisible() {

        await expect(this.page.getByRole('main').getByTestId('chat-details-slider')).toBeVisible();

    }



    async expectChatDetailsAiConfigValueVisible() {

        await expect(this.page.locator('#chat-details-AiConfig-value')).toBeVisible();

    }



    async expectChatDetailsLatencyValueVisible() {

        await expect(this.page.locator('#chat-details-latency-value')).toBeVisible();

    }



    async expectChatDetailsVariablesValueVisible() {

        await expect(this.page.locator('#chat-details-variables-value')).toBeVisible();

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



    async expectAdvanceFilterControlsVisible() {

        await expect(this.advanceFilterToggle).toBeVisible();

        await this.advanceFilterToggle.check();

        await expect(this.advanceFilter).toBeVisible();



        await expect(this.dateRangeFromInput).toBeVisible();

        await expect(this.dateRangeToInput).toBeVisible();

        await expect(this.dateRangeApplyButton).toBeVisible();

        await expect(this.dateRangeClearButton).toBeVisible();



        await expect(this.errorToggle).toBeVisible();

        await expect(this.page.getByTestId('history-sidebar-filter-all')).toBeVisible();

        await expect(this.page.getByTestId('history-sidebar-filter-1')).toBeVisible();

        await expect(this.page.getByTestId('history-sidebar-filter-2')).toBeVisible();

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



private async resolveVersionOption(value: string): Promise<{ value: string; label: string }> {

    const target = value.trim();

    await this.versionSelect.waitFor({ state: 'visible' });



    const options = await this.versionSelect

        .locator('option')

        .evaluateAll((nodes) =>

            nodes.map((node) => {

                const option = node as HTMLOptionElement;

                return {

                    value: option.value,

                    label: (option.label || option.textContent || '').trim()

                };

            })

        );



    const exactMatch = options.find((option) =>

        option.value === target || option.label === target

    );



    const versionLabelMatch = options.find((option) =>

        /version/i.test(option.label)

        && option.label.includes(target)

    );



    const containsMatch = options.find((option) =>

        option.value.includes(target) || option.label.includes(target)

    );



    const selectedOption = exactMatch ?? versionLabelMatch ?? containsMatch;

    if (!selectedOption) {

        const available = options

            .map((option) => `${option.label} [${option.value}]`)

            .join(', ');

        throw new Error(`Unable to select history version "${target}". Available options: ${available}`);

    }



    return selectedOption;

}



async selectVersion(value: string) {

    const selectedOption = await this.resolveVersionOption(value);

    await this.versionSelect.selectOption({ value: selectedOption.value });

}



async selectVersionAndGetHistoryResponse(value: string): Promise<any> {

    const selectedOption = await this.resolveVersionOption(value);

    const currentValue = await this.getSelectedVersion();



    if (currentValue === selectedOption.value) {

        const fallback = this.versionSelect.locator('option').filter({ hasNotText: selectedOption.label }).first();

        if (await fallback.count()) {

            const fallbackValue = (await fallback.getAttribute('value')) || '';

            if (fallbackValue && fallbackValue !== selectedOption.value) {

                const fallbackResponsePromise = this.page.waitForResponse((response) =>

                    response.status() === 200

                    && response.request().method() === 'GET'

                    && response.url().includes('/api/history/')

                    && decodeURIComponent(response.url()).includes('page=1')

                );

                await this.versionSelect.selectOption({ value: fallbackValue });

                await fallbackResponsePromise;

            }

        }

    }



    const responsePromise = this.page.waitForResponse((response) =>

        response.status() === 200

        && response.request().method() === 'GET'

        && response.url().includes('/api/history/')

        && decodeURIComponent(response.url()).includes('page=1')

        && decodeURIComponent(response.url()).includes('limit=40')

        && decodeURIComponent(response.url()).includes(`version_id=${selectedOption.value}`)

        && !decodeURIComponent(response.url()).includes('thread_id=')

        && !decodeURIComponent(response.url()).includes('message_id=')

    );



    await this.versionSelect.selectOption({ value: selectedOption.value });



    const response = await responsePromise;

    return response.json();

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



private get chatDetailsSlider(): Locator {

    return this.page.getByRole('main').getByTestId('chat-details-slider');

}



private get chatDetailsCloseButton(): Locator {

    return this.page.getByTestId('chat_details_view').getByTestId('chat-details-close-button').first();

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

    await this.chatDetailsCloseButton.click({ force: true });

}



private get chatDetailsViewModal(): Locator {

    return this.page.getByRole('main').locator('dialog[data-testid="chat_details_view"]');

}



async expectChatDetailsModalVisible() {

    await expect(this.chatDetailsViewModal).toBeVisible();

}

// Replace expectChatDetailsModalVisible with these for the respective actions:

async expectInlineVariablesVisible() {

    await expect(this.page.locator('span').filter({ hasText: 'Variables' })).toBeVisible();

}

 

async expectInlineSystemPromptVisible() {

    await expect(this.page.getByText('System Prompt')).toBeVisible();

}

 

async expectInlineMoreDetailsVisible() {

    await expect(this.page.getByText('Optional Details')).toBeVisible();

}





async closeChatDetailsModal() {

    await this.chatDetailsViewModal.getByTestId('chat-details-close-button').click();

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



async applyDateFilter(from: string, to: string): Promise<any> {

    await this.advanceFilterToggle.check();

    await this.fillDateFrom(from);

    await this.fillDateTo(to);



    const responsePromise = this.page.waitForResponse((response) =>

        response.status() === 200

        && response.url().includes('/api/history/')

        && decodeURIComponent(response.url()).includes(`page=1`)

        && decodeURIComponent(response.url()).includes(`limit=40`)

        && decodeURIComponent(response.url()).includes(`user_feedback=all`)

        && decodeURIComponent(response.url()).includes(`error=false`)

        && decodeURIComponent(response.url()).includes(`start_date=${from}`)

        && decodeURIComponent(response.url()).includes(`end_date=${to}`)

    );



    await this.applyDateRange();



    const response = await responsePromise;



    return response.json();

}



async getUIThreadIds(): Promise<string[]> {

    const ids = await this.page

        .locator('li[data-testid^="history-sidebar-thread-"]:visible')

        .evaluateAll((nodes) =>

            nodes.map((node) =>

                node

                    .getAttribute('data-testid')

                    ?.replace('history-sidebar-thread-', '') ?? ''

            )

        );



    return [...new Set(ids.filter((id) => id && !id.startsWith('toggle-')))];

}



private collectThreadIdsFromApi(payload: unknown): string[] {

    const result = new Set<string>();

    const maybeUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;



    const visit = (value: unknown) => {

        if (!value) return;



        if (Array.isArray(value)) {

            for (const item of value) {

                visit(item);

            }

            return;

        }



        if (typeof value !== 'object') return;



        const record = value as Record<string, unknown>;

        for (const [key, entry] of Object.entries(record)) {

            if (typeof entry === 'string') {

                const isThreadKey =

                    key === 'thread_id'

                    || key === 'threadId'

                    || key === 'subThread_id'

                    || key === 'subThreadId';



                const isGenericIdKey =

                    key === 'id'

                    || key === '_id';



                if (isThreadKey && entry.length > 0) {

                    result.add(entry);

                } else if (isGenericIdKey && maybeUuid.test(entry)) {

                    result.add(entry);

                }

            }



            visit(entry);

        }

    };



    visit(payload);

    return [...result];

}



// --- Edit Message Modal ---



private get editMessageButton(): Locator {

    return this.page.getByTestId('thread-item-edit-message-button').first();

}



private get editMessageModalContainer(): Locator {

    return this.page.locator('#edit-message-modal-container');

}



private get editMessageImproveButton(): Locator {

    return this.page.getByTestId('edit-message-improve-button');

}



private get editMessageCancelButton(): Locator {

    return this.page.getByTestId('edit-message-cancel-button');

}



// --- History Prompt Update Modal ---



private get historyPromptUpdateModalContainer(): Locator {

    return this.page.locator('#history-prompt-update-modal-container');

}



private get historyPromptPreviousTextarea(): Locator {

    return this.page.getByTestId('history-prompt-previous-textarea');

}



private get historyPromptUpdatedTextarea(): Locator {

    return this.page.getByTestId('history-prompt-updated-textarea');

}



private get historyPromptRegenerateButton(): Locator {

    return this.page.getByTestId('history-prompt-regenerate-button');

}



private get historyPromptSaveButton(): Locator {

    return this.page.getByTestId('history-prompt-save-button');

}



// --- Add Test Case Modal Locators ---



private get addTestCaseModalForm(): Locator {

    return this.page.locator('#add-testcase-modal-form');

}



private get addTestCaseNameInput(): Locator {

    return this.page.getByTestId('add-testcase-name-input');

}



private get addTestCaseLastUserMessage(): Locator {

    return this.page.locator('#add-testcase-last-user-message');

}



private get addTestCaseCloseXButton(): Locator {

    return this.page.getByTestId('ADD_TEST_CASE_MODAL-close-button');

}



private get addTestCaseCreateButton(): Locator {

    return this.page.getByTestId('add-testcase-create-button');

}



private get addTestCaseCancelButton(): Locator {

    return this.page.getByTestId('add-testcase-cancel-button');

}



private get addTestCaseMatchingStrategySelect(): Locator {

    return this.page.getByTestId('add-testcase-matching-strategy-select');

}



private get addTestCaseExpectedOutputLabel(): Locator {

    return this.addTestCaseModalForm.locator('div').filter({ hasText: 'User Expected Output' }).first();

}



async clickEditMessageButton() {

    await expect(this.editMessageButton).toBeVisible();

    await this.editMessageButton.click();

}



async expectEditMessageTextareaVisible() {

    await expect(this.page.getByTestId('edit-message-textarea')).toBeVisible();

}



async expectShowGeneratedButtonVisible() {

    await expect(this.page.getByTestId('edit-message-show-generated-button')).toBeVisible();

}







async clickBetterPromptButton() {

    await expect(this.editMessageModalContainer).toBeVisible();

    await expect(this.editMessageImproveButton).toBeVisible();

    await this.editMessageImproveButton.click();

}



async expectPromptPreviousTextareaVisible() {

    await expect(this.historyPromptUpdateModalContainer).toBeVisible();

    await expect(this.historyPromptPreviousTextarea).toBeVisible();

}



async expectPromptUpdatedTextareaVisible() {

    await expect(this.historyPromptUpdateModalContainer).toBeVisible();

    await expect(this.historyPromptUpdatedTextarea).toBeVisible();

}



async expectPromptRegenerateButtonVisible() {

    await expect(this.historyPromptRegenerateButton).toBeVisible();

}



async clickPromptRegenerateButton() {

    await expect(this.historyPromptRegenerateButton).toBeVisible();

    await this.historyPromptRegenerateButton.click();

}



async clickShowGeneratedButton() {

    await expect(this.showGeneratedButton).toBeVisible();

    await this.showGeneratedButton.click();

}



async clickPromptSaveButton() {

    await expect(this.historyPromptSaveButton).toBeVisible();

    await this.historyPromptSaveButton.click();

}



async clickPromptCancelButton() {

    await expect(this.page.getByTestId('history-prompt-cancel-button')).toBeVisible();

    await this.page.getByTestId('history-prompt-cancel-button').click();

}



async clickEditMessageCancelButton() {

    await expect(this.editMessageCancelButton).toBeVisible();

    await this.editMessageCancelButton.click();

}



async fillEditMessageTextarea(text: string) {

    await this.page.getByTestId('edit-message-textarea').fill(text);

}



async expectEditMessageModalClosed() {

    await expect(this.page.locator('dialog#EDIT_MESSAGE_MODAL')).not.toHaveAttribute('open');

}



// --- Debug Agent ---



async clickDebugAgentButton() {

    const debugButton = this.page.locator('#thread-item-debug-agent-button').first();

    await expect(debugButton).toBeVisible();

    await debugButton.click();

}



async expectIframeParentContainerVisible() {

    await expect(this.page.locator('#iframe-parent-container').first()).toBeVisible();

}



// --- Add Test Case Modal ---



async clickAddTestCaseButton() {

    const addTestCaseButton = this.page.locator('#thread-item-add-test-case-button').first();

    await expect(addTestCaseButton).toBeVisible();

    await addTestCaseButton.click();

}



// async expectAddTestCaseSecondLastRemoveToolVisible() {

//     await expect(this.page.locator('[id^="add-testcase-second-last-remove-tool-"]').first()).toBeVisible();

// }



async expectAddTestCaseNameInputVisible() {

    await expect(this.addTestCaseNameInput).toBeVisible();

}



async fillAddTestCaseNameInput(text: string) {

    await expect(this.addTestCaseNameInput).toBeVisible();

    await this.addTestCaseNameInput.fill(text);

}



async expectAddTestCaseLastUserMessageVisible() {

    await expect(this.addTestCaseLastUserMessage).toBeVisible();

}



async expectAddTestCaseExpectedContentTextareaVisible() {

    // Expected output is displayed as read-only content in the modal

    await expect(this.addTestCaseExpectedOutputLabel).toBeVisible();

    const outputContainer = this.page.getByTestId('add-testcase-bottom-panel');

    await expect(outputContainer).toBeVisible();

}



async expectAddTestCaseCloseXButtonVisible() {

    await expect(this.addTestCaseCloseXButton).toBeVisible();

}



async expectAddTestCaseCreateButtonVisible() {

    await expect(this.addTestCaseCreateButton).toBeVisible();

}



async expectAddTestCaseCancelButtonVisible() {

    await expect(this.addTestCaseCancelButton).toBeVisible();

}



async selectAddTestCaseMatchingStrategy(value: string) {

    await expect(this.addTestCaseMatchingStrategySelect).toBeVisible();

    await this.addTestCaseMatchingStrategySelect.selectOption(value);

}



async clickAddTestCaseCreateButton() {

    await expect(this.addTestCaseCreateButton).toBeVisible();

    await this.addTestCaseCreateButton.click();

}



async clickAddTestCaseCancelButton() {

    await expect(this.addTestCaseCancelButton).toBeVisible();

    await this.addTestCaseCancelButton.click();

}



async expectAddTestCaseModalClosed() {

    await expect(this.page.locator('dialog#ADD_TEST_CASE_MODAL')).not.toHaveAttribute('open');

}



async expectTestCaseCreatedToastVisible() {

    await expect(this.page.getByText('Test case created successfully')).toBeVisible();

}



async expectAiConfigDetailModalContainsText(text: string) {

    

    const contentContainer = this.page.getByRole('main').getByTestId('chat_details_view');

    await expect(contentContainer).toBeVisible();

    await expect(contentContainer).toContainText(text);

}



async verifyHistoryMatchesAPI(apiResponse: any) {

    const apiIds = this.collectThreadIdsFromApi(apiResponse);



    await expect(async () => {

        const uiIds = await this.getUIThreadIds();

        expect([...uiIds].sort()).toEqual([...apiIds].sort());

    }).toPass({ timeout: 15000 });

}

}