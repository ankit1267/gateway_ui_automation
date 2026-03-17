import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class AlertsPage {
  readonly page: Page;
  readonly alertEmbedParent: Locator;
  readonly alertEmbedIframe: Locator;
  readonly accessRestrictedHeading: Locator;
  readonly accessRestrictedMessage: Locator;
  readonly lockIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.alertEmbedParent = page.locator('#alert-embed-parent');
    this.alertEmbedIframe = page.locator('#viasocket-embed-iframe-component');
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

  async expectAlertEmbedVisible() {
    await expect(this.alertEmbedParent).toBeVisible();
  }

  async expectAlertIframeVisible() {
    await expect(this.alertEmbedIframe).toBeVisible();
  }

  async expectAlertsHeadingVisible() {
    const frame = this.page.frameLocator('#viasocket-embed-iframe-component');
    await expect(frame.locator('[role="progressbar"]')).toBeHidden();
    await expect(frame.getByRole('heading', { name: 'Alerts' })).toBeVisible();
  }

  async clickAddApps() {
    await this.alertEmbedIframe.scrollIntoViewIfNeeded();
    const frame = this.page.frameLocator('#viasocket-embed-iframe-component');
    await frame.getByText('Add apps from 2500+ apps').click();
  }

  async expectAlertTypeButtonsVisible() {
    const frame = this.page.frameLocator('#viasocket-embed-iframe-component');
    await expect(frame.getByRole('button', { name: 'Error Alert' })).toBeVisible();
    await expect(frame.getByRole('button', { name: 'Missing Variable Alert' })).toBeVisible();
    await expect(frame.getByRole('button', { name: 'New Broadcast Response' })).toBeVisible();
    await expect(frame.getByRole('button', { name: 'Retry Alert is Created' })).toBeVisible();
  }
}
