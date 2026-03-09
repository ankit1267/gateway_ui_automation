import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class IntegrationGuidePage {
  private readonly pageTitle: Locator;
  private readonly integrationTabApi: Locator;
  private readonly integrationTabBatch: Locator;
  private readonly creatApiAuthKey: Locator;
  private readonly createBatchAuthKey: Locator;
  private readonly curlCodeBlock: Locator;
  private readonly curlCodeBlockCopyButton: Locator;
  private readonly batchCurlCodeBlock: Locator;
  private readonly batchCurlCodeBlockCopyButton: Locator;
  private readonly responseCodeBlock: Locator;
  private readonly responseCodeBlockCopyButton: Locator;
  private readonly batchResponseCodeBlock: Locator;
  private readonly batchResponseCodeBlockCopyButton: Locator;
  private readonly languageDropdownTrigger: Locator;
  private readonly languageDropdownMenu: Locator;
  private readonly apiStep1Section: Locator;
  private readonly apiStep2Section: Locator;
  private readonly batchStep1Section: Locator;
  private readonly batchStep2Section: Locator;
  private readonly apiResponseSection: Locator;
  private readonly batchResponseSection: Locator;

  constructor(private page: Page) {
    this.pageTitle = page.getByRole('heading', { name: 'Integration Guide' });
    this.integrationTabApi = page.getByTestId('integration-tab-api');
    this.integrationTabBatch = page.getByTestId('integration-tab-batch');
    this.creatApiAuthKey = page.getByTestId('api-guide-create-authkey-link');
    this.createBatchAuthKey = page.getByTestId('batch-api-guide-create-authkey-link');
    this.curlCodeBlock = page.getByTestId('api-guide-snippet-curl');
    this.curlCodeBlockCopyButton = this.curlCodeBlock.getByTestId('code-block-copy-button');
    this.batchCurlCodeBlock = page.getByTestId('batch-api-guide-curl-code-block');
    this.batchCurlCodeBlockCopyButton = this.batchCurlCodeBlock.getByTestId('copy-button');
    this.responseCodeBlock = page.getByTestId('api-guide-response-code-block');
    this.responseCodeBlockCopyButton = this.responseCodeBlock.getByTestId('code-block-copy-button');
    this.batchResponseCodeBlock = page.getByTestId('batch-api-guide-response-code-block');
    this.batchResponseCodeBlockCopyButton = this.batchResponseCodeBlock.getByTestId('copy-button');
    this.languageDropdownTrigger = page.getByTestId('language-dropdown-trigger');
    this.languageDropdownMenu = page.getByTestId('language-dropdown-menu');
    this.apiStep1Section = page.locator('#api-guide-step1-section');
    this.apiStep2Section = page.getByTestId('api-guide-step2-section');
    this.batchStep1Section = page.getByTestId('batch-api-guide-step1-section');
    this.batchStep2Section = page.getByTestId('batch-api-guide-step2-section');
    this.apiResponseSection = page.getByTestId('api-guide-response-section');
    this.batchResponseSection = page.getByTestId('batch-api-guide-response-section');
  }

  async expectPageVisible() {
    await expect(this.pageTitle).toBeVisible();
  }

  async clickApiTab() {
    await this.integrationTabApi.click();
  }

  async clickBatchTab() {
    await this.integrationTabBatch.click();
  }

  async clickCreateApiAuthKey() {
    await this.creatApiAuthKey.click();
  }

  async clickCreateBatchAuthKey() {
    await this.createBatchAuthKey.click();
  }

  async copyCurlCodeBlock() {
    await this.curlCodeBlockCopyButton.click();
  }

  async copyBatchCurlCodeBlock() {
    await this.batchCurlCodeBlockCopyButton.click();
  }

  async copyResponseCodeBlock() {
    await this.responseCodeBlockCopyButton.click();
  }

  async copyBatchResponseCodeBlock() {
    await this.batchResponseCodeBlockCopyButton.click();
  }

  async isContainerVisible(): Promise<boolean> {
    return this.page.getByTestId('integration-guide-container').isVisible();
  }

  async isLockedVisible(): Promise<boolean> {
    return this.page.getByTestId('integration-guide-locked-container').isVisible();
  }

  async isTabsVisible(): Promise<boolean> {
    return this.page.getByTestId('integration-guide-tabs').isVisible();
  }

  getTab(tabId: string): Locator {
    return this.page.getByTestId(`integration-tab-${tabId}`);
  }

  async clickTab(tabId: string) {
    await this.getTab(tabId).click();
  }

  async isCurlCodeBlockVisible(): Promise<boolean> {
    return this.curlCodeBlock.isVisible();
  }

  async isResponseCodeBlockVisible(): Promise<boolean> {
    return this.responseCodeBlock.isVisible();
  }

  async getCurlCodeText(): Promise<string> {
    return this.curlCodeBlock.innerText();
  }

  async getResponseCodeText(): Promise<string> {
    return this.responseCodeBlock.innerText();
  }

  async clickLanguageDropdown() {
    await this.languageDropdownTrigger.click();
  }

  async selectLanguage(langId: string) {
    await this.clickLanguageDropdown();
    await this.page.getByTestId(`language-option-${langId}`).click();
  }

  async expectLanguageDropdownVisible() {
    await expect(this.languageDropdownTrigger).toBeVisible();
  }

  getApiSnippet(lang: string): Locator {
    return this.page.getByTestId(`api-guide-snippet-${lang}`);
  }

  getApiSnippetCopyButton(lang: string): Locator {
    return this.getApiSnippet(lang).getByTestId('code-block-copy-button');
  }

  async expectApiSnippetVisible(lang: string) {
    await expect(this.getApiSnippet(lang)).toBeVisible();
  }

  async clickApiSnippetCopyButton(lang: string) {
    await this.getApiSnippetCopyButton(lang).click();
  }

  async expectApiSnippetCopied(lang: string) {
    await expect(this.getApiSnippetCopyButton(lang)).toHaveText('Copied!');
  }

  async expectApiResponseCopied() {
    await expect(this.responseCodeBlockCopyButton).toHaveText('Copied!');
  }

  async expectBatchCurlCopied() {
    await expect(this.batchCurlCodeBlock.getByText('Copied!')).toBeVisible();
  }

  async expectBatchResponseCopied() {
    await expect(this.batchResponseCodeBlock.getByText('Copied!')).toBeVisible();
  }

  async expectApiStep1HasText() {
    await expect(this.apiStep1Section).toBeVisible();
    const text = await this.apiStep1Section.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  }

  async expectApiStep2HasText() {
    await expect(this.apiStep2Section).toBeVisible();
    const text = await this.apiStep2Section.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  }

  async expectApiResponseSectionHasText() {
    await expect(this.apiResponseSection).toBeVisible();
    const text = await this.apiResponseSection.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  }

  async expectBatchStep1HasText() {
    await expect(this.batchStep1Section).toBeVisible();
    const text = await this.batchStep1Section.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  }

  async expectBatchStep2HasText() {
    await expect(this.batchStep2Section).toBeVisible();
    const text = await this.batchStep2Section.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  }

  async expectBatchResponseSectionHasText() {
    await expect(this.batchResponseSection).toBeVisible();
    const text = await this.batchResponseSection.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  }
}