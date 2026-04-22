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
import { MembersPage } from "./members.page";
import { ModelGardenPage } from "./model-garden.page";
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
  readonly membersPage: MembersPage;
  readonly modelGardenPage: ModelGardenPage;
  readonly smartLinkExternal: Locator;
  readonly adminSettingsToggle: Locator;
  readonly adminSidebarHeading: Locator;
  readonly adminMenuWorkspace: Locator;
  readonly adminMenuMembers: Locator;
  readonly adminMenuAuth: Locator;
  readonly adminMenuAddModel: Locator;
  readonly adminMenuGtwyTools: Locator;

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
    this.membersPage = new MembersPage(page);
    this.modelGardenPage = new ModelGardenPage(page);
    this.smartLinkExternal = page.getByTestId('smart-link-external-link');
    this.adminSettingsToggle = page.locator('#main-slider-admin-settings-toggle');
    this.adminSidebarHeading = page.locator('h3', { hasText: 'Admin Settings' });
    this.adminMenuWorkspace = page.locator('#main-slider-admin-workspace');
    this.adminMenuMembers = page.locator('#main-slider-admin-Members');
    this.adminMenuAuth = page.locator('#main-slider-admin-auth');
    this.adminMenuAddModel = page.locator('#main-slider-admin-addModel');
    this.adminMenuGtwyTools = page.locator('#main-slider-admin-prebuiltPrompts');
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

  private async dismissOnboardingOverlay() {
    const overlay = this.page.getByTestId('org-page-guard-modal-overlay');
    if (await overlay.isVisible()) {
      await this.page.getByRole('button', { name: 'Close onboarding' }).click();
      await overlay.waitFor({ state: 'hidden' });
    }
  }

  async gotoChatbotConfig() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/chatbotConfig`);
    await this.page.waitForURL(`/org/${orgId}/chatbotConfig`);
    await this.dismissOnboardingOverlay();
  }

  async gotoKnowledgeBase() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/knowledge_base`);
    await this.page.waitForURL(`/org/${orgId}/knowledge_base`);
    await this.dismissOnboardingOverlay();
  }

  async gotoWidgets() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/widgets`);
    await this.page.waitForURL(`/org/${orgId}/widgets`);
    await this.dismissOnboardingOverlay();
  }

  async gotoPauthKey() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/pauthkey`);
    await this.page.waitForURL(`/org/${orgId}/pauthkey`);
    await this.dismissOnboardingOverlay();
  }

  async gotoApiKeys() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/apikeys`);
    await this.page.waitForURL(`/org/${orgId}/apikeys`);
    await this.dismissOnboardingOverlay();
  }

  async gotoAlerts() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/alerts`);
    await this.page.waitForURL(`/org/${orgId}/alerts`);
    await this.dismissOnboardingOverlay();
  }

  async gotoMetrics() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/metrics`);
    await this.page.waitForURL(`/org/${orgId}/metrics`);
    await this.dismissOnboardingOverlay();
  }

  async gotoIntegration() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/integration`);
    await this.page.waitForURL(`/org/${orgId}/integration`);
    await this.dismissOnboardingOverlay();
  }

  async gotoRAGEmbed() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/RAG_embed`);
    await this.page.waitForURL(`/org/${orgId}/RAG_embed`);
    await this.dismissOnboardingOverlay();
  }

  async gotoFeedback() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/feedback`);
    await this.page.waitForURL(`/org/${orgId}/feedback`);
    await this.dismissOnboardingOverlay();
  }

  async gotoWorkspaceSetting() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/workspaceSetting`);
    await this.page.waitForURL(`/org/${orgId}/workspaceSetting`);
    await this.dismissOnboardingOverlay();
  }

  async gotoPrebuiltPrompts() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/prebuilt-prompts`);
    await this.page.waitForURL(`/org/${orgId}/prebuilt-prompts`);
    await this.dismissOnboardingOverlay();
  }

  async gotoAddNewModel() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/addNewModel`);
    await this.page.waitForURL(`/org/${orgId}/addNewModel`);
    await this.dismissOnboardingOverlay();
  }

  async gotoAuthRoute() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/auth_route`);
    await this.page.waitForURL(`/org/${orgId}/auth_route`);
    await this.dismissOnboardingOverlay();
  }

  async gotoInvite() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/invite`);
    await this.page.waitForURL(`/org/${orgId}/invite`);
    await this.dismissOnboardingOverlay();
  }

  async gotoModelGarden() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/model-garden`);
    await this.page.waitForURL(`/org/${orgId}/model-garden`);
    await this.dismissOnboardingOverlay();
  }

  async clickAdminSettingsToggle() {
    await this.adminSettingsToggle.click();
  }

  async expectAdminSidebarVisible() {
    await expect(this.adminSidebarHeading).toBeVisible();
  }

  async expectAdminMenuItemsVisible() {
    await expect(this.adminMenuWorkspace).toBeVisible();
    await expect(this.adminMenuMembers).toBeVisible();
    await expect(this.adminMenuAuth).toBeVisible();
    await expect(this.adminMenuAddModel).toBeVisible();
    await expect(this.adminMenuGtwyTools).toBeVisible();
  }

  async clickAdminMenuWorkspace() {
    await this.adminMenuWorkspace.click();
  }

  async clickAdminMenuMembers() {
    await this.adminMenuMembers.click();
  }

  async clickAdminMenuAuth() {
    await this.adminMenuAuth.click();
  }

  async clickAdminMenuAddModel() {
    await this.adminMenuAddModel.click();
  }

  async clickAdminMenuGtwyTools() {
    await this.adminMenuGtwyTools.click();
  }

  async gotoAgents() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/agents`);
    await this.page.waitForURL(`/org/${orgId}/agents`);
    await this.dismissOnboardingOverlay();
  }
}