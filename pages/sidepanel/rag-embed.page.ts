import type { Page, Locator } from '@playwright/test';

export class RAGEmbedPage {
  readonly page: Page;
  readonly pageHeader: Locator;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly learnMoreLink: Locator;
  readonly createButton: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.getByTestId('page-header-container');
    this.pageTitle = page.getByRole('heading', { name: 'RAG Embed Integration' });
    this.pageDescription = page.getByText('Embedded RAG allows you to seamlessly');
    this.learnMoreLink = page.getByTestId('page-header-learn-more-link');
    this.createButton = page.getByRole('button', { name: '+ Create New RAG Embed' });
    this.emptyState = page.getByText('No RAG Embed entries found');
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/RAG_embed`);
  }

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async clickCreate() {
    await this.createButton.click();
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

  async openRAGEmbed(name: string) {
    await this.getTableRow(name).click();
  }

  async openFirstRow() {
    await this.page.locator('table tbody tr').first().click();
  }

  async clickLearnMore() {
    await this.learnMoreLink.click();
  }
}
