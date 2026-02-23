import { Page, Locator, expect } from '@playwright/test';

export class HistoryPage {
    private readonly page: Page
    private readonly toolItem: Locator;
    private readonly closeToolItemBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.toolItem = page
            .locator('[data-testid^="thread-item-tool-data-"]')
            .first();
        this.closeToolItemBtn = page.getByTestId('tools-data-modal-close-button');
    }

    /**
     * Waits for the history page to be visible
     */
    async waitForVisible() {
        await expect(this.toolItem).toBeVisible({ timeout: 10000 });
    }

    async openToolItem() {
        await this.waitForVisible();
        await this.toolItem.click();
    }

    async verifyVariableVisible(message: string | RegExp) {
        await expect(
            this.page.getByText(message)
        ).toBeVisible();
    }

    async closeToolItem() {

        await this.closeToolItemBtn.click();
    }

}
