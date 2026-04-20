import type { Page, Locator } from '@playwright/test';

export class AccessManagementModal {
  private readonly modal: Locator;
  private readonly emailInput: Locator;
  private readonly searchResults: Locator;
  private readonly addUserButton: Locator;
  private readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('ACCESS_MANAGEMENT_MODAL');
    this.emailInput = page.getByTestId('access-management-email-input');
    this.searchResults = page.locator('#access-management-search-results');
    this.addUserButton = page.getByTestId('access-management-add-user-button');
    this.closeButton = page.locator('#access-management-close-button');
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async getEmailValue(): Promise<string> {
    return this.emailInput.inputValue();
  }

  async clearEmail() {
    await this.emailInput.clear();
  }

  async waitForSearchResults() {
    await this.searchResults.waitFor({ state: 'visible' });
  }

  async isSearchResultsVisible(): Promise<boolean> {
    return this.searchResults.isVisible();
  }

  getSearchResults(): Locator {
    return this.searchResults;
  }

  getUserResult(userId: string): Locator {
    return this.page.getByTestId(`access-management-user-result-${userId}`);
  }

  getFirstUserResult(): Locator {
    return this.page.getByTestId(/^access-management-user-result-/).first();
  }

  async selectFirstUser() {
    await this.getFirstUserResult().click();
  }

  async clickAddUser() {
    await this.addUserButton.click();
  }

  async removeMemberByEmail(email: string) {
    const member = this.page.locator('#access-management-members-list > div').filter({ hasText: email }).first();
    await member.waitFor({ state: 'visible' });
    await member.locator('[data-testid^="access-management-remove-button-"]').click();
  }

  async isAddUserButtonVisible(): Promise<boolean> {
    return this.addUserButton.isVisible();
  }

  async clickClose() {
    await this.closeButton.click();
  }

  getModal(): Locator {
    return this.modal;
  }
}
