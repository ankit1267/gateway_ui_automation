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
    readonly workspaceButton: Locator;
    readonly userDetailsButton: Locator;
    readonly nameInputUserDetails: Locator;
    readonly updateButton: Locator;
    
    constructor(page: Page) {
        this.page = page;

        this.createWorkspaceButton = page.getByRole('button', { name: '+ Create New Workspace' });
        this.userMenuButton = page.locator('#org-header-user-menu-button-alt');
        this.nameInput = page.getByTestId('create-org-name-input');
        this.descriptionInput = page.getByTestId('create-org-description-input');
        this.timezoneTrigger = page.getByTestId('create-org-timezone-trigger');
        this.submitButton = page.getByTestId('create-org-submit-button');
        this.closeButton = page.getByTestId('create-org-close-button');
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
        this.loginButton = page.getByTestId('login-button');
        this.workspaceButton = page.getByRole('button', { name: 'T Test Space Organization' });// on agent list page
        this.userDetailsButton = page.getByRole('button', { name: 'User Details' });
        this.nameInputUserDetails = page.getByRole('textbox', { name: 'Name', exact: true });// on user detial page
        this.updateButton = page.getByRole('button', { name: 'Update' });// on user detial page

    }

    async fillNameUserDetails(name: string) {
        await this.nameInputUserDetails.fill(name);
    }

    async clickUpdateButton() {
        await this.updateButton.click();
    }

    // ---------------- Navigation ----------
    async goto() {
        await this.page.goto('/org');
        await this.page.waitForURL('/org');
        const onboardingOverlay = this.page.getByTestId('org-page-guard-modal-overlay');
        if (await onboardingOverlay.isVisible()) {
            await this.page.getByRole('button', { name: 'Close onboarding' }).click();
            await onboardingOverlay.waitFor({ state: 'hidden' });
        }
    }

    async waitForPage() {
        await expect(this.createWorkspaceButton).toBeVisible();
    }

    // ---------- Actions ----------
    async clickCreateWorkspace() {
        const onboardingOverlay = this.page.getByTestId('org-page-guard-modal-overlay');
        if (await onboardingOverlay.isVisible()) {
            await this.page.getByRole('button', { name: 'Close onboarding' }).click();
            await onboardingOverlay.waitFor({ state: 'hidden' });
        }
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
    async clickUserDetails(){
        await this.userDetailsButton.click();
    }
    async clickWorkspaceButton(){
        await this.workspaceButton.click();
    }

    // --- Create org form ---

    private get createOrgForm(): Locator {
        return this.page.getByTestId('create-org-form');
    }

    private get timezoneSearchInput(): Locator {
        return this.page.getByTestId('create-org-timezone-search-input');
    }

    private get timezoneDropdown(): Locator {
        return this.page.getByTestId('create-org-timezone-dropdown');
    }

    async isCreateFormVisible(): Promise<boolean> {
        return this.createOrgForm.isVisible();
    }

    async searchTimezone(query: string) {
        await this.timezoneTrigger.click();
        await this.timezoneSearchInput.fill(query);
    }

    async isTimezoneDropdownVisible(): Promise<boolean> {
        return this.timezoneDropdown.isVisible();
    }

    async isSubmitDisabled(): Promise<boolean> {
        return this.submitButton.isDisabled();
    }

    async getNameValue(): Promise<string> {
        return this.nameInput.inputValue();
    }

    async getDescriptionValue(): Promise<string> {
        return this.descriptionInput.inputValue();
    }

    async clearName() {
        await this.nameInput.clear();
    }

    async clearDescription() {
        await this.descriptionInput.clear();
    }

    async getOrganizationCount(): Promise<number> {
        return this.page.locator('#organization-grid-table tbody tr').count();
    }

    async expectSearchBarVisible() {
        await expect(this.page.getByTestId('search-items-input')).toBeVisible();
    }
}