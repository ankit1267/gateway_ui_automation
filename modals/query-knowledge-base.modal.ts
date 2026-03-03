import type { Page, Locator } from '@playwright/test';

export class QueryKnowledgeBaseModal {
  private readonly modal: Locator;
  private readonly queryTextarea: Locator;
  private readonly submitButton: Locator;
  private readonly resultsSection: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('QUERY_KNOWLEDGE_BASE_MODAL');
    this.queryTextarea = page.getByTestId('query-kb-textarea');
    this.submitButton = page.getByTestId('query-kb-submit-button');
    this.resultsSection = page.locator('div.divider', { hasText: 'Results' });
  }

  async fillQuery(query: string) {
    await this.queryTextarea.click();
    await this.queryTextarea.fill(query);
  }

  async submit() {
    await this.submitButton.click();
  }

  async queryKnowledgeBase(query: string) {
    await this.fillQuery(query);
    await this.submit();
  }

  getResultsSection(): Locator {
    return this.resultsSection;
  }

  getModal(): Locator {
    return this.modal;
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async getQueryValue(): Promise<string> {
    return this.queryTextarea.inputValue();
  }

  async clearQuery() {
    await this.queryTextarea.clear();
  }

  async isResultsVisible(): Promise<boolean> {
    return this.resultsSection.isVisible();
  }

  async waitForResults() {
    await this.resultsSection.waitFor({ state: 'visible', timeout: 30000 });
  }
}
