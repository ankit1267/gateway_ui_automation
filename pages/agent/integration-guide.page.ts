import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class IntegrationGuidePage {
  private readonly pageTitle: Locator;
  private readonly integrationTabApi: Locator;
  private readonly integrationTabBatch: Locator;
  private readonly creatApiAuthKey: Locator;
  private readonly createBatchAuthKey: Locator;

  constructor(private page: Page) {
    this.pageTitle = page.getByRole('heading', { name: 'Integration Guide' });
    this.integrationTabApi = page.getByTestId('integration-tab-api');
    this.integrationTabBatch = page.getByTestId('integration-tab-batch');
    this.creatApiAuthKey = page.getByTestId('api-guide-create-authkey-link');
    this.createBatchAuthKey = page.getByTestId('batch-api-guide-create-authkey-link');
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
}