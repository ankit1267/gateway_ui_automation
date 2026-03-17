import type { Page, Locator, FrameLocator } from '@playwright/test';
import { expect } from '@playwright/test';

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

  private async dismissOnboardingOverlay() {
    const overlay = this.page.getByTestId('org-page-guard-modal-overlay');
    if (await overlay.isVisible()) {
      await this.page.getByRole('button', { name: 'Close onboarding' }).click();
      await overlay.waitFor({ state: 'hidden' });
    }
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/feedback`);
    await this.page.waitForURL(`/org/${orgId}/feedback`);
    await this.dismissOnboardingOverlay();
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
