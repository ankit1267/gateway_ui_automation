import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class KnowledgeBasePage {
  private readonly createButton: Locator;
  private readonly table: Locator;
  private readonly kbNameInput: Locator;
  private readonly kbDescriptionInput: Locator;
  private readonly contentRadio: Locator;
  private readonly uploadRadio: Locator;
  private readonly url: Locator;
  private readonly urlInput: Locator;
  private readonly contentFill: Locator;
  private readonly advancedToggle: Locator;
  private readonly moderateRadio: Locator;
  private readonly highAccuracyRadio: Locator;
  private readonly submitButton: Locator;
  private readonly resourceChunkModal: Locator;
  private readonly queryKbTextarea: Locator;
  private readonly querySubmit: Locator;

  constructor(private page: Page) {
    this.createButton = page.getByRole('button', {
      name: '+ Create Knowledge Base'
    });
    this.kbNameInput = page.getByTestId('knowledgebase-name-input');
    this.kbDescriptionInput = page.getByTestId('knowledgebase-description-textarea');
    this.table = page.getByTestId('custom-table');
    this.contentRadio = page.getByRole('radio', { name: 'Content' });
    this.uploadRadio = page.getByRole('radio', { name: 'Upload File' });
    this.url = page.getByRole('radio', { name: 'URL' });
    this.contentFill = page.getByTestId('knowledgebase-content-textarea-create');
    this.advancedToggle = page.locator('#knowledgebase-advanced-settings-toggle');
    this.moderateRadio = page.getByRole('radio', { name: 'Moderate' });
    this.highAccuracyRadio = page.getByRole('radio', { name: 'High Accuracy' });
    this.submitButton = page.getByTestId('knowledgebase-submit-button');
    this.urlInput = page.getByTestId('knowledgebase-url-input-create');
    this.resourceChunkModal = page.getByTestId('RESOURCE_CHUNKS_MODAL');
    this.queryKbTextarea = page.getByTestId('query-kb-textarea');
    this.querySubmit = page.getByTestId('query-kb-submit-button')
  }

  async clickQuerySubmit() {
    await this.querySubmit.click();
  }

  async fillQueryKbTextarea(query: string) {
    await this.queryKbTextarea.click();
    await this.queryKbTextarea.fill(query);
  }

  async expectQueryResultsVisible() {
    await expect(this.page.locator('div.divider', { hasText: 'Results' })).toBeVisible({ timeout: 15000 });
  }

  async expectResourceChunkModalVisible() {
    await expect(this.resourceChunkModal).toBeVisible();
    await expect(this.resourceChunkModal.locator('div.collapse-content')).toBeVisible();
  }

  async expectKnowledgeBaseByName(name: string) {
    await expect(
      this.table.getByRole('row', { name: new RegExp(name) })
    ).toBeVisible();
  }
  async expectKnowledgeBaseDescription(description: string) {
    await expect(
      this.table.getByRole('row', { name: new RegExp(description) })
    ).toBeVisible();
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async selectModerateRadio() {
    await this.moderateRadio.check();
  }

  async selectHighAccuracyRadio() {
    await this.highAccuracyRadio.check();
  }

  async toggleAdvancedSettings() {
    await this.advancedToggle.click();
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async fillKbDescription(description: string) {
    await this.kbDescriptionInput.click();
    await this.kbDescriptionInput.fill(description);
  }

  async fillKbName(name: string) {
    await this.kbNameInput.click();
    await this.kbNameInput.fill(name);
  }

  async selectContentRadio() {
    await this.contentRadio.check();
  }

  async selectUploadRadio() {
    await this.uploadRadio.check();
  }

  async selectUrlRadio() {
    await this.url.check();
  }

  async fillContent(content: string) {
    await this.contentFill.click();
    await this.contentFill.fill(content);
  }

  async fillUrl(url: string) {
    await this.urlInput.click();
    await this.urlInput.fill(url);
  }

  private getRowByName(name: string) {
    return this.page.getByRole('row', {
      name: new RegExp(name)
    });
  }

  async deleteKnowledgeBaseByName(name: string) {
    const kbRow = this.getRowByName(name);

    await expect(kbRow).toBeVisible();

    const deleteButton = kbRow.getByRole('cell', { name: 'Delete' })

    await deleteButton.click();

    await this.page.getByTestId('delete-modal-confirm-button').click();
  }

  async updateKbByName(name: string) {
    const kbRow = this.getRowByName(name);
    await kbRow.hover();
    await kbRow.locator('[data-tip="Update"]').click();
  }

  async clickKbByName(name: string) {
    await this.page.getByText(name, { exact: true }).click();
  }

  async queryKbByName(name: string) {
    const kbRow = this.getRowByName(name);
    await kbRow.hover();
    await kbRow.locator('[data-tip="Test Knowledgebase"]').click();
  }

}