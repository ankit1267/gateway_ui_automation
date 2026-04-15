import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class CommandPalette {
  readonly page: Page;
  readonly backdrop: Locator;
  readonly modal: Locator;
  readonly searchInput: Locator;
  readonly closeButton: Locator;
  readonly clearFilterButton: Locator;
  readonly noResults: Locator;
  readonly apiKeysResults: Locator;
  readonly knowledgeBaseResults: Locator;
  readonly integrationResults: Locator;
  readonly authKeysResults: Locator;
  readonly widgetsResults: Locator;
  readonly ragEmbedResults: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backdrop = page.getByTestId('command-palette-backdrop');
    this.modal = page.getByTestId('command-palette-modal');
    this.searchInput = page.getByTestId('command-palette-search-input');
    this.closeButton = page.getByTestId('command-palette-close-button');
    this.clearFilterButton = page.getByTestId('command-palette-clear-filter');
    this.noResults = this.modal.getByText('No results');
    this.apiKeysResults = page.locator('[data-testid^="command-palette-result-apikeys-"]');
    this.knowledgeBaseResults = page.locator('[data-testid^="command-palette-result-docs-"]');
    this.integrationResults = page.locator('[data-testid^="command-palette-result-integrations-"]');
    this.authKeysResults = page.locator('[data-testid^="command-palette-result-Auths-"]');
    this.widgetsResults = page.locator('[data-testid^="command-palette-result-widgets-"]');
    this.ragEmbedResults = page.locator('[data-testid^="command-palette-result-rag_embed-"]');
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async waitForHidden() {
    await this.modal.waitFor({ state: 'hidden' });
  }

  async open() {
    await expect(async () => {
      await this.page.keyboard.press('Escape');
      await this.page.keyboard.press('Control+k');
      await expect(this.searchInput).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 30000 });
  }

  async close() {
    await this.closeButton.click();
  }

  async closeByBackdrop() {
    await this.backdrop.click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async getSearchValue(): Promise<string> {
    return this.searchInput.inputValue();
  }

  async clearFilter() {
    await this.clearFilterButton.click();
  }

  async isClearFilterVisible(): Promise<boolean> {
    return this.clearFilterButton.isVisible();
  }

  // --- Category and item navigation ---

  getCategoryButton(categoryKey: string): Locator {
    return this.page.getByTestId(`command-palette-category-${categoryKey}`);
  }

  async clickCategory(categoryKey: string) {
    await this.getCategoryButton(categoryKey).click();
  }

  getToggleButton(categoryKey: string): Locator {
    return this.page.getByTestId(`command-palette-toggle-${categoryKey}`);
  }

  async toggleCategory(categoryKey: string) {
    await this.getToggleButton(categoryKey).click();
  }

  getItem(type: string, id: string): Locator {
    return this.page.getByTestId(`command-palette-item-${type}-${id}`);
  }

  async clickItem(type: string, id: string) {
    await this.getItem(type, id).click();
  }

  getResult(type: string, id?: string): Locator {
    if (id) {
      return this.page.getByTestId(`command-palette-result-${type}-${id}`);
    }
    return this.page.getByTestId(new RegExp(`command-palette-result-${type}-`));
  }

  async clickResult(type: string, id?: string) {
    await this.getResult(type, id).click();
  }

  async expectNoResultsVisible() {
    await expect(this.noResults).toBeVisible();
  }

  async expectNoResultsNotVisible() {
    await expect(this.noResults).not.toBeVisible();
  }

  // --- Search results by category ---

  async getApiKeysResultsCount(): Promise<number> {
    return this.apiKeysResults.count();
  }

  async assertApiKeysResultsVisible() {
    await expect(this.apiKeysResults.first()).toBeVisible();
  }

  async getKnowledgeBaseResultsCount(): Promise<number> {
    return this.knowledgeBaseResults.count();
  }

  async assertKnowledgeBaseResultsVisible() {
    await expect(this.knowledgeBaseResults.first()).toBeVisible();
  }

  async getIntegrationResultsCount(): Promise<number> {
    return this.integrationResults.count();
  }

  async assertIntegrationResultsVisible() {
    await expect(this.integrationResults.first()).toBeVisible();
  }

  async getAuthKeysResultsCount(): Promise<number> {
    return this.authKeysResults.count();
  }

  async assertAuthKeysResultsVisible() {
    await expect(this.authKeysResults.first()).toBeVisible();
  }

  async getWidgetsResultsCount(): Promise<number> {
    return this.widgetsResults.count();
  }

  async assertWidgetsResultsVisible() {
    await expect(this.widgetsResults.first()).toBeVisible();
  }

  async getRagEmbedResultsCount(): Promise<number> {
    return this.ragEmbedResults.count();
  }

  async assertRagEmbedResultsVisible() {
    await expect(this.ragEmbedResults.first()).toBeVisible();
  }
}
