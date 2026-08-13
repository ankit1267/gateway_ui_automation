import type { Page, Locator } from '@playwright/test';

export class AddNewModelPage {
  readonly page: Page;
  readonly pageHeader: Locator;
  readonly pageTitle: Locator;
  readonly learnMoreLink: Locator;
  readonly addNewModelButton: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.getByTestId('page-header-container');
    this.pageTitle = page.getByRole('heading', { name: 'Model Management' });
    this.learnMoreLink = page.getByTestId('page-header-learn-more-link');
    this.addNewModelButton = page.getByRole('button', { name: '+ Add New Model' });
    this.emptyState = page.getByText('No model entries found');
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/addNewModel`);
    await this.page.waitForURL(`/org/${orgId}/addNewModel`);
  }

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async clickAddNewModel() {
    await this.addNewModelButton.click();
  }

  async closeAddNewModelModal() {
    await this.page
      .getByTestId('ADD_NEW_MODEL_MODAL-close-button')
      .click();
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

  async deleteModelByName(name: string) {
    const row = this.getTableRow(name);
    await row.hover();
    await row.locator('[data-tip="Delete"]').click();
  }

  async openModelUsageDetails(name: string) {
    const row = this.getTableRow(name);
    await row.hover();
    await row.locator('[data-tip="Usage Details"]').click();
  }

  async clickLearnMore() {
    await this.learnMoreLink.click();
  }
}
