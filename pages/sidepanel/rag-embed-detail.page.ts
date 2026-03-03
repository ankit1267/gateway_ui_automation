import type { Page, Locator } from '@playwright/test';

export class RAGEmbedDetailPage {
  readonly page: Page;
  readonly loadingSpinner: Locator;
  readonly detailView: Locator;
  readonly sidebar: Locator;
  readonly mainNav: Locator;
  readonly integrationTab: Locator;
  readonly testingTab: Locator;
  readonly contentArea: Locator;
  readonly testingBackButton: Locator;
  readonly testingSidebarContent: Locator;
  readonly testingControls: Locator;
  readonly ragControls: Locator;
  readonly createDocumentButton: Locator;
  readonly showDocumentsButton: Locator;
  readonly closeDocumentsButton: Locator;
  readonly themeLightButton: Locator;
  readonly themeDarkButton: Locator;
  readonly apiConfigCode: Locator;
  readonly accessKeyDisplay: Locator;
  readonly generateAccessKeyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.locator('.loading.loading-spinner');
    this.detailView = page.getByTestId('rag-embed-detail-view');
    this.sidebar = page.getByTestId('rag-embed-sidebar');
    this.mainNav = page.getByTestId('rag-embed-main-nav');
    this.integrationTab = page.getByTestId('rag-embed-tab-integration');
    this.testingTab = page.getByTestId('rag-embed-tab-testing');
    this.contentArea = page.getByTestId('rag-embed-content-area');
    this.testingBackButton = page.getByTestId('rag-embed-testing-back-button');
    this.testingSidebarContent = page.getByTestId('rag-embed-testing-sidebar-content');
    this.testingControls = page.getByTestId('rag-testing-controls');
    this.ragControls = page.getByTestId('rag-testing-rag-controls');
    this.createDocumentButton = page.getByTestId('rag-testing-create-document-button');
    this.showDocumentsButton = page.getByTestId('rag-testing-show-documents-button');
    this.closeDocumentsButton = page.getByTestId('rag-testing-close-documents-button');
    this.themeLightButton = page.getByTestId('rag-testing-theme-light-button');
    this.themeDarkButton = page.getByTestId('rag-testing-theme-dark-button');
    this.apiConfigCode = page.locator('#rag-embed-step1-api-config');
    this.accessKeyDisplay = page.locator('#rag-embed-access-key-display');
    this.generateAccessKeyButton = page.locator('#rag-embed-generate-access-key-button');
  }

  async goto(folderId: string) {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/RAG_embed/${folderId}`);
  }

  async waitForPage() {
    await this.detailView.waitFor({ state: 'visible' });
  }

  async isLoading(): Promise<boolean> {
    return this.loadingSpinner.isVisible();
  }

  async clickIntegrationTab() {
    await this.integrationTab.click();
  }

  async clickTestingTab() {
    await this.testingTab.click();
  }

  async clickTestingBackButton() {
    await this.testingBackButton.click();
  }

  async clickCreateDocument() {
    await this.createDocumentButton.click();
  }

  async clickShowDocuments() {
    await this.showDocumentsButton.click();
  }

  async clickCloseDocuments() {
    await this.closeDocumentsButton.click();
  }

  async selectLightTheme() {
    await this.themeLightButton.click();
  }

  async selectDarkTheme() {
    await this.themeDarkButton.click();
  }

  async clickGenerateAccessKey() {
    await this.generateAccessKeyButton.click();
  }

  async isAccessKeyVisible(): Promise<boolean> {
    return this.accessKeyDisplay.isVisible();
  }

  async isTestingMode(): Promise<boolean> {
    return this.testingControls.isVisible();
  }

  async isIntegrationMode(): Promise<boolean> {
    return this.mainNav.isVisible();
  }
}
