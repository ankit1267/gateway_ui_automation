import type { Page, Locator } from '@playwright/test';

export class IntegrationPage {
  readonly page: Page;
  readonly pageHeader: Locator;
  readonly pageTitle: Locator;
  readonly learnMoreLink: Locator;
  readonly createNewEmbedButton: Locator;
  readonly emptyStateText: Locator;
  readonly ellipsisMenuUsageLimit: Locator;
  readonly ellipsisMenuResetUsage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.getByTestId('page-header-container');
    this.pageTitle = page.getByRole('heading', { name: /GTWY Embed Integration/i });
    this.learnMoreLink = page.getByTestId('page-header-learn-more-link');
    this.createNewEmbedButton = page.getByRole('button', { name: '+ Create New Embed' });
    this.emptyStateText = page.getByText('No integration entries found');
    this.ellipsisMenuUsageLimit = page.getByRole('link', { name: /Usage Limit/i });
    this.ellipsisMenuResetUsage = page.getByRole('link', { name: /Reset Usage/i });
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/integration`);
  }

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async clickCreateNewEmbed() {
    await this.createNewEmbedButton.click();
  }

  async openIntegration(name: string) {
    await this.page.getByText(name, { exact: true }).click();
  }

  async isEmptyState(): Promise<boolean> {
    return this.emptyStateText.isVisible();
  }

  async getTableRowCount(): Promise<number> {
    return this.page.locator('table tbody tr').count();
  }

  getTableRow(name: string): Locator {
    return this.page.locator('table tbody tr').filter({ hasText: name });
  }

  async openEllipsisMenu(name: string) {
    const row = this.getTableRow(name);
    await row.locator('[role="button"]').click();
  }

  async setUsageLimit(name: string) {
    await this.openEllipsisMenu(name);
    await this.ellipsisMenuUsageLimit.click();
  }

  async resetUsage(name: string) {
    await this.openEllipsisMenu(name);
    await this.ellipsisMenuResetUsage.click();
  }

  async clickLearnMore() {
    await this.learnMoreLink.click();
  }
}
