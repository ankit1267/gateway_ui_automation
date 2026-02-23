import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class KnowledgeBasePage {
  private readonly createButton: Locator;
  private readonly table: Locator;

  constructor(private page: Page) {
    this.createButton = page.getByRole('button', {
      name: '+ Create Knowledge Base'
    });

    this.table = page.getByTestId('custom-table');
  }

  async clickCreate() {
    await this.createButton.click();
  }

  private getRowByName(name: string) {
    return this.page.getByRole('row', {
      name: new RegExp(name)
    });
  }

  async deleteKnowledgeBaseByName(name: string) {
    const kbRow = this.getRowByName(name);

    await expect(kbRow).toBeVisible();

    const deleteButton = kbRow.getByRole('cell', { name: 'Test Knowledgebase delete' })

    await deleteButton.click();

    await this.page.getByTestId('delete-modal-confirm-button').click();
  }

}