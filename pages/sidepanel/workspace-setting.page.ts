import type { Page, Locator } from '@playwright/test';

export class WorkspaceSettingPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly domainLabel: Locator;
  readonly domainValue: Locator;
  readonly orgNameLabel: Locator;
  readonly orgNameValue: Locator;
  readonly emailLabel: Locator;
  readonly emailValue: Locator;
  readonly timezoneLabel: Locator;
  readonly timezoneValue: Locator;
  readonly timezonePencilIcon: Locator;
  readonly timezoneEditorPanel: Locator;
  readonly timezoneSearchInput: Locator;
  readonly timezoneList: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Workspace Settings' });

    const grid = page.locator('.grid.grid-cols-1');
    const cards = grid.locator('> div.p-3');
    this.domainLabel = cards.nth(0).getByText('Domain');
    this.domainValue = cards.nth(0).locator('p');
    this.orgNameLabel = cards.nth(1).getByText('Organization Name');
    this.orgNameValue = cards.nth(1).locator('p');
    this.emailLabel = cards.nth(2).getByText('Email Address');
    this.emailValue = cards.nth(2).locator('p');
    this.timezoneLabel = cards.nth(3).getByText('Timezone');
    this.timezoneValue = cards.nth(3).locator('p');
    this.timezonePencilIcon = cards.nth(3).locator('svg');

    this.timezoneEditorPanel = page.locator('.border.border-base-300.rounded-lg.p-4');
    this.timezoneSearchInput = page.getByPlaceholder('Search timezone...');
    this.timezoneList = page.locator('.h-48.overflow-y-auto');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/workspaceSetting`);
  }

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async getDomainValue(): Promise<string> {
    return this.domainValue.innerText();
  }

  async getOrgNameValue(): Promise<string> {
    return this.orgNameValue.innerText();
  }

  async getEmailValue(): Promise<string> {
    return this.emailValue.innerText();
  }

  async getTimezoneValue(): Promise<string> {
    return this.timezoneValue.innerText();
  }

  async openTimezoneEditor() {
    await this.timezoneLabel.click();
  }

  async isTimezoneEditorOpen(): Promise<boolean> {
    return this.timezoneEditorPanel.isVisible();
  }

  async searchTimezone(query: string) {
    await this.timezoneSearchInput.fill(query);
  }

  async clearTimezoneSearch() {
    await this.timezoneSearchInput.clear();
  }

  async selectTimezone(identifier: string) {
    await this.timezoneList.getByText(identifier, { exact: false }).first().click();
  }

  async getSelectedTimezoneClass(identifier: string): Promise<string | null> {
    return this.timezoneList.getByText(identifier, { exact: false }).first().getAttribute('class');
  }

  async isTimezoneSelected(identifier: string): Promise<boolean> {
    const cls = await this.getSelectedTimezoneClass(identifier);
    return cls?.includes('bg-primary') ?? false;
  }

  getTimezoneOption(identifier: string): Locator {
    return this.timezoneList.getByText(identifier, { exact: false }).first();
  }

  async getVisibleTimezoneCount(): Promise<number> {
    return this.timezoneList.locator('> div').count();
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async changeTimezone(identifier: string) {
    await this.openTimezoneEditor();
    await this.searchTimezone(identifier);
    await this.selectTimezone(identifier);
    await this.clickSave();
  }
}
