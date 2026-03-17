import type { Page, Locator } from '@playwright/test';

export class AlertsPage {
  readonly page: Page;
  readonly alertEmbedParent: Locator;
  readonly accessRestrictedHeading: Locator;
  readonly accessRestrictedMessage: Locator;
  readonly lockIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.alertEmbedParent = page.locator('#alert-embed-parent');
    this.accessRestrictedHeading = page.getByRole('heading', { name: 'Access Restricted' });
    this.accessRestrictedMessage = page.getByText('This page is locked for viewers');
    this.lockIcon = page.locator('svg.text-error');
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/alerts`);
    await this.page.waitForURL(`/org/${orgId}/alerts`);
  }

  async waitForPage() {
    await this.page.waitForLoadState('networkidle');
  }

  async isAccessRestricted(): Promise<boolean> {
    return this.accessRestrictedHeading.isVisible();
  }

  async isAlertEmbedVisible(): Promise<boolean> {
    return this.alertEmbedParent.isVisible();
  }
}
