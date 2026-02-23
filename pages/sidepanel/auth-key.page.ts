import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';


export class AuthKeyPage {
  private readonly heading: Locator;
  private readonly createButton: Locator;
  private readonly table: Locator;
  private readonly smartLinkExternalLink: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole('heading', { name: 'Auth Key', exact: true });

    this.createButton = page.getByRole('button', {
      name: '+ Create New Auth Key'
    });
    this.table = page.getByTestId('custom-table');
    this.smartLinkExternalLink = page.getByTestId('smart-link-external-link');
  }

  async expectPageVisible() {
    await expect(this.heading).toBeVisible();
  }

  async clickCreateNewKey() {
    await this.createButton.click();
  }

  async expectKeyListed(name: string) {
    await expect(
      this.table.getByRole('row', { name: new RegExp(name) })
    ).toBeVisible();
  }

  async deleteKey(name: string) {
    const row = this.table.getByRole('row', {
      name: new RegExp(name)
    });

    await expect(row).toBeVisible();

    const deleteBtn = row.getByRole('button', { name: /delete/i });
    await deleteBtn.click();
  }

  async clickSmartLinkExternalLink() {
    await this.smartLinkExternalLink.click();
  }
}