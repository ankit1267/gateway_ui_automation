import { Page, Locator, expect } from '@playwright/test';

export class WorkspacePage {
    readonly page: Page;

    readonly createWorkspaceButton: Locator;
    readonly userMenuButton: Locator;
    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly timezoneTrigger: Locator;
    readonly submitButton: Locator;
    readonly closeButton: Locator;
    readonly logoutButton: Locator;
    readonly loginButton: Locator;
    constructor(page: Page) {
        this.page = page;

        this.createWorkspaceButton = page.getByRole('button', { name: '+ Create New Workspace' });
        this.userMenuButton = page.locator('#org-header-user-menu-button');
        this.nameInput = page.getByTestId('create-org-name-input');
        this.descriptionInput = page.getByTestId('create-org-description-input');
        this.timezoneTrigger = page.getByTestId('create-org-timezone-trigger');
        this.submitButton = page.getByTestId('create-org-submit-button');
        this.closeButton = page.getByTestId('create-org-close-button');
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
        this.loginButton = page.getByTestId('login-button');

    }

    // ---------------- Navigation ----------
    async goto() {
        await this.page.goto('/org');
    }

    async waitForPage() {
        await expect(this.createWorkspaceButton).toBeVisible();
    }

    // ---------- Actions ----------
    async clickCreateWorkspace() {
        await this.createWorkspaceButton.click();
    }

    async openWorkspaceDropdown() {
        await this.userMenuButton.click();
    }

    async logout() {
        await this.logoutButton.click();
    }

    async selectWorkspace(name: string) {
        await this.page.getByText(name, { exact: true }).click();
    }

    async fillName(name: string) {
        await this.nameInput.fill(name);
    }

    async fillDescription(desc: string) {
        await this.descriptionInput.fill(desc);
    }

    async selectTimezone(timezone: string) {
        await this.timezoneTrigger.click();
        await this.page.getByText(timezone, { exact: true }).click();
    }

    async submit() {
        await this.submitButton.click();
    }

    async close() {
        await this.closeButton.click();
    }

    async createWorkspace(name: string, desc: string, timezone?: string) {
        await this.fillName(name);
        await this.fillDescription(desc);
        if (timezone) {
            await this.selectTimezone(timezone);
        }
        await this.submit();
    }
    async expectLogin() {
        await expect(this.loginButton).toBeVisible();
    }
}