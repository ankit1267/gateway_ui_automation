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

  constructor(private page: Page) {
    this.pageTitle = page.getByRole('heading', { name: 'Integration Guide' });
    this.integrationTabApi = page.getByTestId('integration-tab-api');
    this.integrationTabBatch = page.getByTestId('integration-tab-batch');
    this.creatApiAuthKey = page.getByTestId('api-guide-create-authkey-link');
    this.createBatchAuthKey = page.getByTestId('batch-api-guide-create-authkey-link');
    this.curlCodeBlock = page.getByTestId('api-guide-curl-code-block');
    this.curlCodeBlockCopyButton = this.curlCodeBlock.getByTestId('copy-button');
    this.batchCurlCodeBlock = page.getByTestId('batch-api-guide-curl-code-block');
    this.batchCurlCodeBlockCopyButton = this.batchCurlCodeBlock.getByTestId('copy-button');
    this.responseCodeBlock = page.getByTestId('api-guide-response-code-block');
    this.responseCodeBlockCopyButton = this.responseCodeBlock.getByTestId('copy-button');
    this.batchResponseCodeBlock = page.getByTestId('batch-api-guide-response-code-block');
    this.batchResponseCodeBlockCopyButton = this.batchResponseCodeBlock.getByTestId('copy-button');
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
}