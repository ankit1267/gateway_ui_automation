import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class PrebuiltToolsConfigModal {
  readonly page: Page;
  readonly container: Locator;
  readonly domainInput: Locator;
  readonly addDomainButton: Locator;
  readonly domainsList: Locator;
  readonly closeButton: Locator;
  private readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('prebuilt-tools-config-modal-container');
    this.domainInput = page.getByTestId('prebuilt-tools-config-domain-input');
    this.addDomainButton = page.getByTestId('prebuilt-tools-config-add-domain-button');
    this.domainsList = page.getByTestId('prebuilt-tools-config-domains-list');
    this.closeButton = page.getByTestId('prebuilt-tools-config-close-button');
    this.validationError = this.container.locator('.label-text-alt.text-error');
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible();
  }

  async waitForVisible() {
    await this.container.waitFor({ state: 'visible' });
  }

  async fillDomain(domain: string) {
    await this.domainInput.fill(domain);
  }

  async getDomainValue(): Promise<string> {
    return this.domainInput.inputValue();
  }

  async clearDomain() {
    await this.domainInput.clear();
  }

  async clickAddDomain() {
    await this.addDomainButton.click();
  }

  async addDomain(domain: string) {
    await this.fillDomain(domain);
    await this.clickAddDomain();
  }

  async close() {
    await this.closeButton.click();
  }

  getDomainItem(index: number): Locator {
    return this.page.getByTestId(`prebuilt-tools-config-domain-item-${index}`);
  }

  getEditInput(index: number): Locator {
    return this.page.getByTestId(`prebuilt-tools-config-edit-input-${index}`);
  }

  async clickEditDomain(index: number) {
    await this.page.getByTestId(`prebuilt-tools-config-edit-button-${index}`).click();
  }

  async clickSaveEdit(index: number) {
    await this.page.getByTestId(`prebuilt-tools-config-save-edit-button-${index}`).click();
  }

  async clickCancelEdit(index: number) {
    await this.page.getByTestId(`prebuilt-tools-config-cancel-edit-button-${index}`).click();
  }

  async clickDeleteDomain(index: number) {
    await this.page.getByTestId(`prebuilt-tools-config-delete-button-${index}`).click();
  }

  async expectDomainItemVisible(index: number) {
    await expect(this.getDomainItem(index)).toBeVisible({ timeout: 10000 });
  }

  async expectDomainItemNotVisible(index: number) {
    await expect(this.getDomainItem(index)).not.toBeVisible({ timeout: 10000 });
  }

  async expectDomainAlreadyExistsError() {
    await expect(this.validationError).toHaveText('This domain already exists', { timeout: 10000 });
  }

  async expectInvalidDomainError() {
    await expect(this.validationError).toHaveText('Please enter a valid domain', { timeout: 10000 });
  }

  async expectEditInvalidDomainError(index: number) {
    await expect(this.getDomainItem(index).locator('.text-xs.text-error')).toHaveText('Please enter a valid domain', { timeout: 10000 });
  }

  async editDomain(index: number, newDomain: string) {
    await this.clickEditDomain(index);
    await this.getEditInput(index).fill(newDomain);
    await this.clickSaveEdit(index);
  }
}
