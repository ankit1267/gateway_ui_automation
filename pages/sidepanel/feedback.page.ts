import type { Page, Locator, FrameLocator } from '@playwright/test';

export class FeedbackPage {
  readonly page: Page;
  readonly feedbackIframe: FrameLocator;
  readonly iframeElement: Locator;
  readonly container: Locator;

  constructor(page: Page) {
    this.page = page;
    this.feedbackIframe = page.frameLocator('iframe[title="Feedback Widget"]');
    this.iframeElement = page.locator('iframe[title="Feedback Widget"]');
    this.container = page.locator('.w-full.h-screen');
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/feedback`);
    await this.page.waitForURL(`/org/${orgId}/feedback`);
  }

  async waitForPage() {
    await this.iframeElement.waitFor({ state: 'visible' });
  }

  async isIframeVisible(): Promise<boolean> {
    return this.iframeElement.isVisible();
  }

  async getIframeSrc(): Promise<string | null> {
    return this.iframeElement.getAttribute('src');
  }
}
