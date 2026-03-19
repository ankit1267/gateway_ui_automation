import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { DeleteModal } from '../../modals/delete.modal';

export class AuthKeyPage {
  private readonly heading: Locator;
  private readonly createButton: Locator;
  private readonly table: Locator;
  private readonly smartLinkExternalLink: Locator;
  private readonly nameInput: Locator;
  private readonly createSubmitButton: Locator;
  readonly deleteModal: DeleteModal;

  constructor(private page: Page) {
    this.heading = page.getByRole('heading', { name: 'Auth Key', exact: true });
    this.createButton = page.getByRole('button', { name: '+ Create New Auth Key' });
    this.table = page.getByTestId('custom-table');
    this.smartLinkExternalLink = page.getByTestId('smart-link-external-link');
    this.nameInput = page.locator('#authNameInput');
    this.createSubmitButton = page.getByRole('button', { name: '+ Create', exact: true });
    this.deleteModal = new DeleteModal(page);
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

  async waitForPage() {
    await expect(this.heading).toBeVisible();
  }

  async isCreateButtonVisible(): Promise<boolean> {
    return this.createButton.isVisible();
  }

  async isTableVisible(): Promise<boolean> {
    return this.table.isVisible();
  }

  getKeyRow(name: string): Locator {
    return this.table.getByRole('row', { name: new RegExp(name) });
  }

  async getTableRowCount(): Promise<number> {
    return this.table.getByRole('row').count();
  }

  async clickKeyRow(name: string) {
    await this.getKeyRow(name).click();
  }

  async copyKeyByName(name: string) {
    const row = this.getKeyRow(name);
    await row.hover();
    await row.locator('[data-tip="copy"]').click();
  }

  async fillAuthKeyName(name: string) {
    await this.nameInput.fill(name);
  }

  async clickCreateSubmit() {
    await this.createSubmitButton.click();
  }

  async clickDeleteIconByName(name: string) {
    const row = this.getKeyRow(name);
    await row.locator('[data-tip="delete"] a').click();
  }

  async expectValidationErrorToast() {
    await expect(
      this.page.getByRole('alert').filter({ hasText: 'The name must be at least 3' })
    ).toBeVisible({ timeout: 5000 });
  }

  async expectCreateSuccessToast() {
    await expect(
      this.page.getByRole('alert').filter({ hasText: 'Auth key created successfully' })
    ).toBeVisible({ timeout: 10000 });
  }

  async expectCopySuccessToast() {
    await expect(
      this.page.getByRole('alert').filter({ hasText: 'Content copied to clipboard' })
    ).toBeVisible({ timeout: 5000 });
  }

  async expectDeleteSuccessToast() {
    await expect(
      this.page.getByRole('alert').filter({ hasText: 'Auth Key Deleted Successfully' })
    ).toBeVisible({ timeout: 10000 });
  }
}