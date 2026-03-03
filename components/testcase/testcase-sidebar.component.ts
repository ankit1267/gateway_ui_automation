import type { Page, Locator } from '@playwright/test';

export class TestCaseSidebar {
  private readonly sidebar: Locator;
  private readonly header: Locator;
  private readonly runAllButton: Locator;
  private readonly listContainer: Locator;
  private readonly emptyState: Locator;
  private readonly generateButton: Locator;

  constructor(private readonly page: Page) {
    this.sidebar = page.getByTestId('testcase-sidebar');
    this.header = page.getByTestId('testcase-sidebar-header');
    this.runAllButton = page.getByTestId('testcase-run-all-button');
    this.listContainer = page.getByTestId('testcase-list-container');
    this.emptyState = page.getByTestId('testcase-empty-state');
    this.generateButton = page.getByTestId('testcase-generate-button');
  }

  async isSidebarVisible(): Promise<boolean> {
    return this.sidebar.isVisible();
  }

  async isEmptyState(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  async getTestCardCount(): Promise<number> {
    return this.listContainer.locator('[data-testid^="testcase-card-"]').count();
  }

  async clickRunAll() {
    await this.runAllButton.click();
  }

  async isRunAllVisible(): Promise<boolean> {
    return this.runAllButton.isVisible();
  }

  async clickGenerate() {
    await this.generateButton.click();
  }

  async isGenerateVisible(): Promise<boolean> {
    return this.generateButton.isVisible();
  }

  async runSingleTest(testId: string) {
    await this.page.getByTestId(`testcase-run-button-${testId}`).click();
  }

  async deleteTestCase(testId: string) {
    await this.page.getByTestId(`testcase-delete-button-${testId}`).click();
  }

  async toggleExpand(testId: string) {
    await this.page.getByTestId(`testcase-toggle-expand-${testId}`).click();
  }

  async clickTestCard(testId: string) {
    await this.page.getByTestId(`testcase-card-${testId}`).click();
  }

  async toggleVersionHistory(testId: string) {
    await this.page.getByTestId(`testcase-history-toggle-${testId}`).click();
  }

  getTestCard(testId: string): Locator {
    return this.page.getByTestId(`testcase-card-${testId}`);
  }

  getTestDetails(testId: string): Locator {
    return this.page.getByTestId(`testcase-details-${testId}`);
  }

  getHistoryTable(testId: string): Locator {
    return this.page.getByTestId(`testcase-history-table-${testId}`);
  }

  getRunButton(testId: string): Locator {
    return this.page.getByTestId(`testcase-run-button-${testId}`);
  }

  getDeleteButton(testId: string): Locator {
    return this.page.getByTestId(`testcase-delete-button-${testId}`);
  }

  async isTestCardVisible(testId: string): Promise<boolean> {
    return this.getTestCard(testId).isVisible();
  }

  async isTestDetailsVisible(testId: string): Promise<boolean> {
    return this.getTestDetails(testId).isVisible();
  }

  async getTestCardText(testId: string): Promise<string> {
    return this.getTestCard(testId).innerText();
  }
}
