import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/** SDK/language categories exposed via the onboarding category tabs. */
export type SdkCategory = 'curl' | 'gtwy' | 'openai';

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
  private readonly codeBlockContainers: Locator;
  private readonly onboardingContainer: Locator;

  constructor(private page: Page) {
    this.pageTitle = page.getByRole('heading', { name: 'Integration Guide' });
    this.integrationTabApi = page.getByTestId('integration-tab-api');
    this.integrationTabBatch = page.getByTestId('onboarding-example-batch');
    this.creatApiAuthKey = page.getByTestId('api-guide-create-authkey-link');
    this.createBatchAuthKey = page.getByTestId('batch-api-guide-create-authkey-link');
    // NOTE: the app renders code blocks with a single generic
    // `code-block-container` testid (no per-language/per-tab testid exists).
    // The API/Batch API tabs each show exactly two: the request snippet
    // (curl) first, followed by the JSON response. Since only one tab's
    // pair is in the DOM at a time, the curl/response locators below work
    // for both the API tab and the Batch API tab.
    this.codeBlockContainers = page.getByTestId('code-block-container');
    this.curlCodeBlock = this.codeBlockContainers.nth(0);
    this.curlCodeBlockCopyButton = this.curlCodeBlock.getByTestId('code-block-copy-button');
    this.batchCurlCodeBlock = this.curlCodeBlock;
    this.batchCurlCodeBlockCopyButton = this.curlCodeBlockCopyButton;
    this.responseCodeBlock = this.codeBlockContainers.nth(1);
    this.responseCodeBlockCopyButton = this.responseCodeBlock.getByTestId('code-block-copy-button');
    this.batchResponseCodeBlock = this.responseCodeBlock;
    this.batchResponseCodeBlockCopyButton = this.responseCodeBlockCopyButton;
    this.onboardingContainer = page.getByTestId('integration-guide-onboarding');
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

  /**
   * Copy buttons on code blocks are only rendered/interactable while the
   * block is hovered (opacity-0 -> opacity-100 on hover). Hover the block
   * first, then wait for the button to be visible before clicking it.
   */
  private async clickCopyButton(codeBlock: Locator, copyButton: Locator) {
    await codeBlock.scrollIntoViewIfNeeded();
    await codeBlock.hover();
    await copyButton.waitFor({ state: 'visible' });
    await copyButton.click();
  }

  async copyCurlCodeBlock() {
    await this.clickCopyButton(this.curlCodeBlock, this.curlCodeBlockCopyButton);
  }

  async copyBatchCurlCodeBlock() {
    await this.clickCopyButton(this.batchCurlCodeBlock, this.batchCurlCodeBlockCopyButton);
  }

  async copyResponseCodeBlock() {
    await this.clickCopyButton(this.responseCodeBlock, this.responseCodeBlockCopyButton);
  }

  async copyBatchResponseCodeBlock() {
    await this.clickCopyButton(this.batchResponseCodeBlock, this.batchResponseCodeBlockCopyButton);
  }

  /** The onboarding category tab for a given SDK/language (cURL, GTWY SDK, OpenAI SDK). */
  getCategoryTab(category: SdkCategory): Locator {
    return this.page.getByTestId(`onboarding-category-${category}`);
  }

  async selectCategory(category: SdkCategory) {
    await this.getCategoryTab(category).click();
  }

  /**
   * Clicks the copy button on every code block currently rendered for the
   * active tab/category and verifies each shows "Copied!". Some code blocks
   * (e.g. the GTWY SDK's install command and response-usage snippet) don't
   * have a copy button at all, so those are skipped rather than failing.
   * Returns the number of buttons that were copied and verified.
   */
  async copyAllAvailableCodeBlocks(): Promise<number> {
    const count = await this.codeBlockContainers.count();
    let copiedCount = 0;

    for (let i = 0; i < count; i++) {
      const container = this.codeBlockContainers.nth(i);
      const copyButton = container.getByTestId('code-block-copy-button');

      if ((await copyButton.count()) === 0) {
        continue;
      }

      await this.clickCopyButton(container, copyButton);
      await expect(copyButton).toHaveText('Copied!');
      copiedCount++;
    }

    return copiedCount;
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

  /**
   * The app doesn't have a language dropdown; instead it has category tabs
   * for the SDK/language used in the snippet: cURL, GTWY SDK, OpenAI SDK.
   * This asserts all three are visible and that selecting each one swaps
   * in the expected code sample.
   */
  async expectAvailableCategoriesShowExpectedSnippets() {
    const expectations: Array<{ category: SdkCategory; expectedText: string }> = [
      { category: 'curl', expectedText: "curl --location" },
      { category: 'gtwy', expectedText: 'from gtwy import' },
      { category: 'openai', expectedText: 'import OpenAI' },
    ];

    for (const { category, expectedText } of expectations) {
      await expect(this.getCategoryTab(category)).toBeVisible();
      await this.selectCategory(category);
      await expect(this.onboardingContainer).toContainText(expectedText);
    }
  }

  async expectApiSnippetCopied(lang: string) {
    // The app has no per-language snippet testid; the curl copy button
    // shown by default is the same generic code-block copy button.
    if (lang !== 'curl') {
      throw new Error(`expectApiSnippetCopied only supports 'curl'; got "${lang}"`);
    }
    await expect(this.curlCodeBlockCopyButton).toHaveText('Copied!');
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

  /**
   * The app has no separate "step 1 / step 2" sections; the onboarding
   * container just shows the request snippet followed by the response.
   * Asserts both are present and non-empty for whichever tab (API or
   * Batch API) is currently active.
   */
  async expectRequestSnippetHasText() {
    await expect(this.curlCodeBlock).toBeVisible();
    const text = await this.curlCodeBlock.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  }

  async expectResponseSnippetHasText() {
    await expect(this.responseCodeBlock).toBeVisible();
    const text = await this.responseCodeBlock.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  }
}