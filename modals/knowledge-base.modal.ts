import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class KnowledgeBaseModal {
  private readonly modal: Locator;
  private readonly nameInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly urlInput: Locator;
  private readonly addResourceButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = this.page.getByTestId('KNOWLEDGE_BASE_MODAL');

    this.nameInput = this.modal.getByRole('textbox', {
      name: 'Knowledge Base name'
    });

    this.descriptionInput = this.modal.getByRole('textbox', {
      name: /Brief description/i
    });

    this.urlInput = this.modal.getByPlaceholder(
      'https://example.com/resource'
    );

    this.addResourceButton = this.modal.getByRole('button', {
      name: 'Add Resource'
    });
  }

  async createKB(name: string, description: string, url: string) {
    await expect(this.modal).toBeVisible();

    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);
    await this.urlInput.fill(url);

    await this.addResourceButton.click();
  }
}