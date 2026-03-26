import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class TestCasePage {
    readonly page: Page;
    readonly table: Locator;
    readonly tableBody: Locator;
    readonly userInputHeading: Locator;
    readonly expectedOutputHeading: Locator;
    readonly editButton: Locator;
    readonly deleteButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.table = page.locator('table');
        this.tableBody = this.table.locator('tbody');
        this.userInputHeading = page.getByRole('heading', { name: 'User Input' });
        this.expectedOutputHeading = page.getByRole('heading', { name: 'Expected Output' });
        this.editButton = this.table.getByRole('button', { name: 'Edit', exact: true });
        this.deleteButton = this.table.getByRole('button', { name: 'Delete', exact: true });
    }

    getRow(index: number): Locator {
        return this.tableBody.locator('tr').nth(index);
    }

    async clickRow(index: number) {
        await this.getRow(index).click();
    }

    async expectUserInputVisible() {
        await expect(this.userInputHeading).toBeVisible();
    }

    async expectExpectedOutputVisible() {
        await expect(this.expectedOutputHeading).toBeVisible();
    }

    async expectEditButtonVisible() {
        await expect(this.editButton).toBeVisible();
    }

    async expectDeleteButtonVisible() {
        await expect(this.deleteButton).toBeVisible();
    }

    async clickEditButton() {
        await this.editButton.click();
    }

    async clickDeleteButton() {
        await this.deleteButton.click();
    }

    getRunTestCaseButton(versionIndex: number): Locator {
        return this.table.locator('thead th').nth(versionIndex + 5).getByRole('button');
    }

    async clickRunTestCaseVersion(versionIndex: number) {
        await this.getRunTestCaseButton(versionIndex).click();
    }

    async expectRunTestCaseVersionVisible(versionIndex: number) {
        await expect(this.getRunTestCaseButton(versionIndex)).toBeVisible();
    }

    async expectTestCaseRunSuccessToast() {
        await expect(
            this.page.getByRole('alert').filter({ hasText: 'Test case run successfully' })
        ).toBeVisible();
    }

    async closeSuccessToast() {
        await this.page.getByLabel('close', { exact: true }).click();
    }

    async expectTableVisible() {
        await expect(this.table).toBeVisible();
    }
}
