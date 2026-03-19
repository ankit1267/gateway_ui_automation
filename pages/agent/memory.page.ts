import { Page, Locator, expect } from '@playwright/test';

export class MemoryPage {
    private readonly page: Page;
    private readonly gptMemoryToggle: Locator;
    private readonly gptMemoryContextTextarea: Locator;
    private readonly memoryTabContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.gptMemoryToggle = page.getByTestId('gpt-memory-toggle');
        this.gptMemoryContextTextarea = page.getByTestId('gpt-memory-context-textarea');
        this.memoryTabContainer = page.getByTestId('memory-tab-container');
    }

    async clickMemoryContext() {
        await this.memoryTabContainer.getByText('Memory Context').click();
    }

    async enableIfDisabled() {
        if (!(await this.gptMemoryToggle.isChecked())) {
            await this.gptMemoryToggle.check();
        }
    }

    async fillGptMemoryContextTextarea(text: string) {
        await this.gptMemoryContextTextarea.fill(text);
    }

    async expectGptMemoryContextTextareaVisible() {
        await expect(this.gptMemoryContextTextarea).toBeVisible();
    }

    async expectGptMemoryContextTextareaNotVisible() {
        await expect(this.gptMemoryContextTextarea).not.toBeVisible();
    }

    async expectToggleChecked() {
        await expect(this.gptMemoryToggle).toBeChecked();
    }

    async expectToggleUnchecked() {
        await expect(this.gptMemoryToggle).not.toBeChecked();
    }

    async expectContextValue(text: string) {
        await expect(this.gptMemoryContextTextarea).toHaveValue(text);
    }

    async checkGptMemoryToggle() {
        await this.gptMemoryToggle.check();
    }

    async uncheckGptMemoryToggle() {
        await this.gptMemoryToggle.uncheck();
    }
}