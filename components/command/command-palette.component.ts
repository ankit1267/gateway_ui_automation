import type { Page, Locator } from '@playwright/test';

export class CommandPalette {
  readonly page: Page;
  readonly backdrop: Locator;
  readonly modal: Locator;
  readonly searchInput: Locator;
  readonly closeButton: Locator;
  readonly clearFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backdrop = page.getByTestId('command-palette-backdrop');
    this.modal = page.getByTestId('command-palette-modal');
    this.searchInput = page.getByTestId('command-palette-search-input');
    this.closeButton = page.getByTestId('command-palette-close-button');
    this.clearFilterButton = page.getByTestId('command-palette-clear-filter');
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
    await this.page.keyboard.press('Control+k');
    await this.searchInput.waitFor({ state: 'visible' });
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

  getResult(type: string, id: string): Locator {
    return this.page.getByTestId(`command-palette-result-${type}-${id}`);
  }

  async clickResult(type: string, id: string) {
    await this.getResult(type, id).click();
  }
}
