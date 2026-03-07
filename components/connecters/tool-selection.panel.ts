import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class ToolSelectionDropdown {
    private readonly dropdown: Locator;
    private readonly searchInput: Locator;
    private readonly addNewToolsLink: Locator;
    private readonly viasocketHeader: Locator;

    constructor(private readonly page: Page) {
        this.dropdown = page.getByTestId('embed-suggestion-dropdown-menu');
        this.searchInput = this.dropdown.getByTestId('embed-suggestion-search-input');
        this.addNewToolsLink = this.dropdown.getByTestId('embed-suggestion-add-new-button')
        this.viasocketHeader = this.page.locator('#viasocket-embed-header');
    }

    async expectVisible() {
        await expect(this.dropdown).toBeVisible({ timeout: 15000 });
    }

    async search(toolName: string) {
        await this.searchInput.fill(toolName);
    }

    async selectTool(toolName: string) {
        await this.expectVisible();
        const item = this.dropdown
            .locator('button, li')
            .filter({ hasText: toolName })
            .first();
        await item.scrollIntoViewIfNeeded();
        await item.click();
    }

    async clickAddNewTools() {
        await this.addNewToolsLink.click();
    }

    async expectNoToolsFound() {
        await expect(this.dropdown.getByText('No tools found')).toBeVisible({ timeout: 15000 });
    }

    async expectItemVisible(toolName: string) {
        await expect(this.dropdown.getByText(toolName, { exact: true })).toBeVisible({ timeout: 15000 });
    }

    async expectViaSocketVisible() {
        await expect(this.viasocketHeader).toBeVisible({ timeout: 15000 });
    }

    async clearSearch() {
        await this.searchInput.clear();
    }

    async getSearchValue(): Promise<string> {
        return this.searchInput.inputValue();
    }

    async isVisible(): Promise<boolean> {
        return this.dropdown.isVisible();
    }

    getDropdown(): Locator {
        return this.dropdown;
    }

    async isAddNewToolsVisible(): Promise<boolean> {
        return this.addNewToolsLink.isVisible();
    }

    async searchAndSelect(toolName: string) {
        await this.search(toolName);
        await this.selectTool(toolName);
    }
}