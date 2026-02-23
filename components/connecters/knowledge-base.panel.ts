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
    
    

}