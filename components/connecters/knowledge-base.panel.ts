import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class KnowledgeBaseDropdown {

    private readonly dropdown: Locator;
    private readonly searchInput: Locator;
    private readonly addNewKBButton: Locator;

    constructor(private readonly page: Page) {
        this.dropdown = page.getByTestId('knowledgebase-dropdown');
        this.searchInput = this.dropdown.getByTestId('knowledgebase-search-input');
        this.addNewKBButton = this.dropdown.getByTestId('knowledgebase-add-new-button');
    }

    async expectVisible() {
        await expect(this.dropdown).toBeVisible({ timeout: 15000 });
    }

    async addNewKnowledgeBase() {
        await this.addNewKBButton.click();
    }

    async selectKB(kbName: string) {
        await this.expectVisible();
        await this.dropdown
            .getByText(kbName, { exact: true })
            .click();
    }


    async search(kbName: string) {
        await this.searchInput.fill(kbName);
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

    async isAddNewKBVisible(): Promise<boolean> {
        return this.addNewKBButton.isVisible();
    }

    async expectItemVisible(kbName: string) {
        await expect(this.dropdown.getByText(kbName, { exact: true })).toBeVisible({ timeout: 15000 });
    }

    async searchAndSelect(kbName: string) {
        await this.search(kbName);
        await this.selectKB(kbName);
    }
}