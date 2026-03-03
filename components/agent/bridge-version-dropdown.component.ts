import type { Page, Locator } from '@playwright/test';

export class BridgeVersionDropdown {
  readonly page: Page;
  readonly container: Locator;
  readonly emptyState: Locator;
  readonly versionTabs: Locator;
  readonly dropdownToggle: Locator;
  readonly dropdownMenu: Locator;
  readonly createNewVersionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('bridge-version-dropdown-container');
    this.emptyState = page.getByTestId('bridge-version-dropdown-empty');
    this.versionTabs = page.getByTestId('bridge-version-tabs');
    this.dropdownToggle = page.getByTestId('version-dropdown-toggle');
    this.dropdownMenu = page.getByTestId('version-dropdown-menu');
    this.createNewVersionButton = page.getByTestId('create-new-version-button');
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible();
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  // --- Version tab buttons ---

  getVersionButton(versionId: string): Locator {
    return this.page.getByTestId(`version-button-${versionId}`);
  }

  async clickVersion(versionId: string) {
    await this.getVersionButton(versionId).click();
  }

  getVersionDeleteButton(versionId: string): Locator {
    return this.page.getByTestId(`version-delete-button-${versionId}`);
  }

  async deleteVersion(versionId: string) {
    await this.getVersionDeleteButton(versionId).click();
  }

  // --- Dropdown for overflow versions ---

  async openDropdown() {
    await this.dropdownToggle.click();
  }

  async isDropdownOpen(): Promise<boolean> {
    return this.dropdownMenu.isVisible();
  }

  getDropdownVersionButton(versionId: string): Locator {
    return this.page.getByTestId(`version-dropdown-button-${versionId}`);
  }

  async clickDropdownVersion(versionId: string) {
    await this.getDropdownVersionButton(versionId).click();
  }

  getDropdownDeleteButton(versionId: string): Locator {
    return this.page.getByTestId(`version-dropdown-delete-${versionId}`);
  }

  async deleteDropdownVersion(versionId: string) {
    await this.getDropdownDeleteButton(versionId).click();
  }

  // --- Create new version ---

  async clickCreateNewVersion() {
    await this.createNewVersionButton.click();
  }

  async isCreateNewVersionVisible(): Promise<boolean> {
    return this.createNewVersionButton.isVisible();
  }
}
