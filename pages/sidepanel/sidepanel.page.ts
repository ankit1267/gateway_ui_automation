import { Page, Locator } from "@playwright/test";
import { AuthKeyPage } from "./auth-key.page";
import { ApiKeysPage } from "./api-key.page";
import { KnowledgeBasePage } from "./knowledge-base.page";
import { MetricsPage } from "./metrics.page";
import { AlertsPage } from "./alerts.page";
import { WidgetsPage } from "./widgets.page";
import { IntegrationPage } from "./integration.page";
import { ChatbotConfigPage } from "./chatbot-config.page";
import { FeedbackPage } from "./feedback.page";
import { WorkspaceSettingPage } from "./workspace-setting.page";
import { PrebuiltPromptsPage } from "./prebuilt-prompts.page";
import { RAGEmbedPage } from "./rag-embed.page";
import { RAGEmbedDetailPage } from "./rag-embed-detail.page";
import { IntegrationDetailPage } from "./integration-detail.page";
import { AddNewModelPage } from "./add-new-model.page";
import { HistoryVisualizePage } from "./history-visualize.page";
import { AuthRoutePage } from "./auth-route.page";
import { TutorialModalPage } from "./tutorial-modal.page";
import { expect } from "@playwright/test";

export class SidepanelPage {
  readonly page: Page;
  readonly authKeyPage: AuthKeyPage;
  readonly apiKeysPage: ApiKeysPage;
  readonly knowledgeBasePage: KnowledgeBasePage;
  readonly metricsPage: MetricsPage;
  readonly alertsPage: AlertsPage;
  readonly widgetsPage: WidgetsPage;
  readonly integrationPage: IntegrationPage;
  readonly chatbotConfigPage: ChatbotConfigPage;
  readonly feedbackPage: FeedbackPage;
  readonly workspaceSettingPage: WorkspaceSettingPage;
  readonly prebuiltPromptsPage: PrebuiltPromptsPage;
  readonly ragEmbedPage: RAGEmbedPage;
  readonly ragEmbedDetailPage: RAGEmbedDetailPage;
  readonly integrationDetailPage: IntegrationDetailPage;
  readonly addNewModelPage: AddNewModelPage;
  readonly historyVisualizePage: HistoryVisualizePage;
  readonly authRoutePage: AuthRoutePage;
  readonly tutorialModalPage: TutorialModalPage;
  readonly smartLinkExternal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authKeyPage = new AuthKeyPage(page);
    this.apiKeysPage = new ApiKeysPage(page);
    this.knowledgeBasePage = new KnowledgeBasePage(page);
    this.metricsPage = new MetricsPage(page);
    this.alertsPage = new AlertsPage(page);
    this.widgetsPage = new WidgetsPage(page);
    this.integrationPage = new IntegrationPage(page);
    this.chatbotConfigPage = new ChatbotConfigPage(page);
    this.feedbackPage = new FeedbackPage(page);
    this.workspaceSettingPage = new WorkspaceSettingPage(page);
    this.prebuiltPromptsPage = new PrebuiltPromptsPage(page);
    this.ragEmbedPage = new RAGEmbedPage(page);
    this.ragEmbedDetailPage = new RAGEmbedDetailPage(page);
    this.integrationDetailPage = new IntegrationDetailPage(page);
    this.addNewModelPage = new AddNewModelPage(page);
    this.historyVisualizePage = new HistoryVisualizePage(page);
    this.authRoutePage = new AuthRoutePage(page);
    this.tutorialModalPage = new TutorialModalPage(page);
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

  async gotoFeedback() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/feedback`);
  }

  async gotoWorkspaceSetting() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/workspaceSetting`);
  }

  async gotoPrebuiltPrompts() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/prebuilt-prompts`);
  }

  async gotoAddNewModel() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/addNewModel`);
  }

  async gotoAuthRoute() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/auth_route`);
  }

  async gotoAgents() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/agents`);
  }
}