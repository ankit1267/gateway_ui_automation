import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class A2AAgentDropdown {

    private readonly dropdown: Locator;
    private readonly searchInput: Locator;

    constructor(private readonly page: Page) {
        this.dropdown = page.getByTestId('connect-agent-suggestion-dropdown');
        this.searchInput = this.dropdown.getByTestId('connect-agent-suggestion-search-input');

    }

    async expectVisible() {
        await expect(this.dropdown).toBeVisible({ timeout: 15000 });
    }

    async isVisible() {
        return await this.dropdown.isVisible();
    }

    async selectAgent(agentName: string) {
        await this.expectVisible();
        await this.dropdown
            .getByText(agentName, { exact: true })
            .click();
    }

    async search(agentName: string) {
        await this.searchInput.fill(agentName);
    }

    async clearSearch() {
        await this.searchInput.clear();
    }

    async getSearchValue(): Promise<string> {
        return this.searchInput.inputValue();
    }

    getDropdown(): Locator {
        return this.dropdown;
    }

    async searchAndSelect(agentName: string) {
        await this.search(agentName);
        await this.selectAgent(agentName);
    }

}