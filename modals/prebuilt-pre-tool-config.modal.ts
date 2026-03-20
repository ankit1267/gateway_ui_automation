import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class PrebuiltPreToolConfigModal {
  readonly page: Page;
  readonly container: Locator;
  private readonly closeButton: Locator;
  private readonly saveButton: Locator;
  private readonly refinementPromptTextarea: Locator;
  private readonly kbSearchInput: Locator;
  private readonly urlInput: Locator;
  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('prebuilt-pre-tool-config-modal');
    this.closeButton = this.container.getByRole('button', { name: 'Close', exact: true });
    this.saveButton = this.container.getByRole('button', { name: 'Save', exact: true });
    this.refinementPromptTextarea = this.container.getByPlaceholder('e.g. Rewrite the user\'s query to be more specific and search-engine friendly. Focus on intent and remove ambiguity.');
    this.kbSearchInput = this.container.getByPlaceholder('Search knowledge bases...');
    this.urlInput = this.container.getByPlaceholder('example.com');
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible();
  }

  async waitForVisible() {
    await this.container.waitFor({ state: 'visible' });
  }

  async close() {
    await this.closeButton.click();
  }


  async isQueryRefinerConfigModalVisible(){
    expect(this.container.isVisible()); 
  }
  
  async isSaveButtonDisabled(){
    expect(this.saveButton.isDisabled());
  }

  async fillRefinementPrompt(text: string) {
    await this.refinementPromptTextarea.fill(text);
  }

  async isSaveButtonEnabled() {
    await expect(this.saveButton).toBeEnabled();
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async searchKnowledgeBase(name: string) {
    await this.kbSearchInput.fill(name);
  }

  async selectKnowledgeBase(name: string) {
    await this.container.locator('ul li').filter({ hasText: name }).click();
  }

  async expectKnowledgeBaseSelected(name: string) {
    await expect(this.container.locator('p').filter({ hasText: 'Selected:' })).toContainText(name);
  }

  async searchAndSelectKnowledgeBase(name: string) {
    await this.searchKnowledgeBase(name);
    await this.selectKnowledgeBase(name);
  }

  async fillUrl(url: string) {
    await this.urlInput.fill(url);
  }

  async getUrlValue(): Promise<string> {
    return this.urlInput.inputValue();
  }

  async checkOutputFormat(format: string) {
    await this.container.getByRole('checkbox', { name: format, exact: true }).check();
  }

  async uncheckOutputFormat(format: string) {
    await this.container.getByRole('checkbox', { name: format, exact: true }).uncheck();
  }
}
