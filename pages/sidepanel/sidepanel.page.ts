import { Page, Locator } from "@playwright/test";
import { AuthKeyPage } from "./auth-key.page";
import { ApiKeysPage } from "./api-key.page";
import { KnowledgeBasePage } from "./knowledge-base.page";
import { expect } from "@playwright/test";

export class SidepanelPage {
  readonly page: Page;
  readonly authKeyPage: AuthKeyPage;
  readonly apiKeysPage: ApiKeysPage;
  readonly knowledgeBasePage: KnowledgeBasePage;
  readonly smartLinkExternal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authKeyPage = new AuthKeyPage(page);
    this.apiKeysPage = new ApiKeysPage(page);
    this.knowledgeBasePage = new KnowledgeBasePage(page);
    this.smartLinkExternal = page.getByTestId('smart-link-external-link');
  }

  async openExternalLink() {

    const popupPromise = this.page.waitForEvent('popup');
    await this.smartLinkExternal.click();

    const newPage = await popupPromise;
    await newPage.waitForLoadState();

    return newPage;
  }

  async expectExternalLinkVisible(kbPage: Page, headingName: string) {
    await expect(
      kbPage.getByRole('heading', { name: headingName, exact: true })
    ).toBeVisible();
  }

  async gotoChatbotConfig() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/chatbotConfig`);
  }

  async gotoKnowledgeBase() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/knowledge_base`);
  }

  async gotoWidgets() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/widgets`);
  }

  async gotoPauthKey() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/pauthkey`);
  }

  async gotoApiKeys() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/apikeys`);
  }

  async gotoAlerts() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/alerts`);
  }

  async gotoMetrics() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/metrics`);
  }

  async gotoIntegration() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/integration`);
  }

  async gotoRAGEmbed() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/RAG_embed`);
  }
}