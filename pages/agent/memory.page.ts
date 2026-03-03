import { Page, Locator, expect } from '@playwright/test';

export class MemoryPage {
    private readonly page: Page;
    private readonly gptMemoryToggle: Locator;
    private readonly gptMemoryContextTextarea: Locator;

    constructor(page: Page) {
        this.page = page;
        this.gptMemoryToggle = page.getByTestId('gpt-memory-toggle');
        this.gptMemoryContextTextarea = page.getByTestId('gpt-memory-context-textarea');
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

    async checkGptMemoryToggle() {
        await this.gptMemoryToggle.check();
    }

    async uncheckGptMemoryToggle() {
        await this.gptMemoryToggle.uncheck();
    }
}