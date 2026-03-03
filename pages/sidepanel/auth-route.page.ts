import type { Page, Locator } from '@playwright/test';

export class AuthRoutePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly authNameInput: Locator;
  readonly redirectUrlInput: Locator;
  readonly addOAuthButton: Locator;
  readonly existingRoutesHeading: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Authentication' });
    this.authNameInput = page.getByPlaceholder('Enter Auth name');
    this.redirectUrlInput = page.getByPlaceholder('https://example.com/oauth/callback');
    this.addOAuthButton = page.getByRole('button', { name: 'Add OAuth Route' });
    this.existingRoutesHeading = page.getByRole('heading', { name: 'Existing Auth Routes' });
    this.emptyState = page.getByText('No auth routes found');
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/auth_route`);
  }

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async fillAuthName(name: string) {
    await this.authNameInput.fill(name);
  }

  async fillRedirectUrl(url: string) {
    await this.redirectUrlInput.fill(url);
  }

  async clearAuthName() {
    await this.authNameInput.clear();
  }

  async clearRedirectUrl() {
    await this.redirectUrlInput.clear();
  }

  async clickAddOAuth() {
    await this.addOAuthButton.click();
  }

  async addAuthRoute(name: string, url: string) {
    await this.fillAuthName(name);
    await this.fillRedirectUrl(url);
    await this.clickAddOAuth();
  }

  async isEmptyState(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  async getTableRowCount(): Promise<number> {
    return this.page.locator('table tbody tr').count();
  }

  getTableRow(name: string): Locator {
    return this.page.locator('table tbody tr').filter({ hasText: name });
  }

  async deleteAuthRoute(name: string) {
    const row = this.getTableRow(name);
    await row.hover();
    await row.locator('[data-tip="Delete"]').click();
  }

  async viewAuthData(name: string) {
    const row = this.getTableRow(name);
    await row.hover();
    await row.locator('[data-tip="View"]').click();
  }

  async getAuthNameValue(): Promise<string> {
    return this.authNameInput.inputValue();
  }

  async getRedirectUrlValue(): Promise<string> {
    return this.redirectUrlInput.inputValue();
  }
}
