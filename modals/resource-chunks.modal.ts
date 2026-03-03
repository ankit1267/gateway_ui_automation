import type { Page, Locator } from '@playwright/test';

export class ResourceChunksModal {
  private readonly modal: Locator;
  private readonly collapseContent: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('RESOURCE_CHUNKS_MODAL');
    this.collapseContent = this.modal.locator('div.collapse-content');
  }

  getModal(): Locator {
    return this.modal;
  }

  getCollapseContent(): Locator {
    return this.collapseContent;
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async getChunkCount(): Promise<number> {
    return this.collapseContent.count();
  }

  async getChunkText(index: number): Promise<string> {
    return this.collapseContent.nth(index).innerText();
  }

  async expandChunk(index: number) {
    await this.modal.locator('.collapse-title').nth(index).click();
  }
}
