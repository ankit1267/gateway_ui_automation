import type { Page, Locator, FrameLocator } from '@playwright/test';
import { expect } from '@playwright/test';

export class PreToolDropdown {
    private readonly page: Page;
    private readonly addNewTool: Locator;
    private readonly searchInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addNewTool = page.getByTestId('embed-suggestion-add-new-button');
        this.searchInput = page.getByTestId('embed-suggestion-search-input');

    }

    async clickAddNewTool() {
        await this.addNewTool.click();
    }

    async search(toolName: string) {
        await this.searchInput.fill(toolName);
    }

    async selectTool(toolName: string) {
        await this.page.getByText(toolName).click();
    }

    async clearSearch() {
        await this.searchInput.clear();
    }

    async getSearchValue(): Promise<string> {
        return this.searchInput.inputValue();
    }

    async isAddNewToolVisible(): Promise<boolean> {
        return this.addNewTool.isVisible();
    }

    async searchAndSelect(toolName: string) {
        await this.search(toolName);
        // Scope click to dropdown to avoid matching text elsewhere on page,
        // and wait for the option to be visible before clicking (headless-safe)
        const option = this.page
            .getByTestId('embed-suggestion-dropdown-menu')
            .getByText(toolName, { exact: true });
        await expect(option).toBeVisible();
        await option.click();
    }
}