import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

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

  private async dismissOnboardingOverlay() {
    const overlay = this.page.getByTestId('org-page-guard-modal-overlay');
    if (await overlay.isVisible()) {
      await this.page.getByRole('button', { name: 'Close onboarding' }).click();
      await overlay.waitFor({ state: 'hidden' });
    }
  }

  async goto(folderId: string) {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/RAG_embed/${folderId}`);
    await this.page.waitForURL(`/org/${orgId}/RAG_embed/${folderId}`);
    await this.dismissOnboardingOverlay();
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

  async expectTestingControlsVisible() {
    await expect(this.testingControls).toBeVisible();
  }

  async expectRagControlsVisible() {
    await expect(this.ragControls).toBeVisible();
  }

  async expectCreateDocumentButtonVisible() {
    await expect(this.createDocumentButton).toBeVisible();
  }

  async expectShowDocumentsButtonVisible() {
    await expect(this.showDocumentsButton).toBeVisible();
  }

  async expectCloseDocumentsButtonVisible() {
    await expect(this.closeDocumentsButton).toBeVisible();
  }

  async expectThemeLightButtonVisible() {
    await expect(this.themeLightButton).toBeVisible();
  }

  async expectThemeDarkButtonVisible() {
    await expect(this.themeDarkButton).toBeVisible();
  }

  async expectTestingBackButtonVisible() {
    await expect(this.testingBackButton).toBeVisible();
  }

  async expectTestingSidebarContentVisible() {
    await expect(this.testingSidebarContent).toBeVisible();
  }

  async expectEventLogNotEmpty() {
    await expect(this.page.getByText('No events yet')).not.toBeVisible();
  }

  async expectEventLogContains(text: string) {
    await expect(this.page.locator('p').filter({ hasText: text }).first()).toBeVisible();
  }

  async clickEventLogClear() {
    await this.page.getByRole('button', { name: 'Clear' }).click({ force: true });
  }

  async expectEventLogEmpty() {
    await expect(this.page.getByText('No events yet')).toBeVisible();
  }

  getRagEmbedFrame() {
    return this.page.frameLocator('#iframe-component-ragInterfaceEmbed');
  }

  async clickAddNewDocumentInFrame() {
    const contentArea = this.page.locator('[data-testid="rag-embed-content-area"]');
    await contentArea.getByText('Add New Document').click();
  }

  async fillKnowledgeBaseName(name: string) {
    const frame = this.getRagEmbedFrame();
    await frame.getByPlaceholder('Enter document name').fill(name, { force: true });
  }

  async fillDescription(description: string) {
    const frame = this.getRagEmbedFrame();
    await frame.getByPlaceholder('Enter a description for this knowledge base entry').fill(description, { force: true });
  }

  async fillUrl(url: string) {
    const frame = this.getRagEmbedFrame();
    await frame.locator('input[type="url"]').fill(url, { force: true });
  }

  async clickCreateInFrame() {
    const frame = this.getRagEmbedFrame();
    await frame.getByText('Create', { exact: true }).dispatchEvent('click');
  }

  async expectResourceVisibleInFrame(name: string) {
    await expect(async () => {
      const container = this.page.locator('[data-testid="rag-embed-content-area"]');
      await expect(container.getByText(name).first()).toBeVisible();
    }).toPass({ timeout: 30000 });
  }

  async deleteLastResourceInFrame() {
    const contentArea = this.page.locator('[data-testid="rag-embed-content-area"]');
    await contentArea.locator('.ellipsis-btn').last().click();
    await contentArea.locator('.delete-btn').last().click({ force: true });
  }

  async expectAllStepsHaveText() {
    const contentArea = this.page.getByTestId('rag-embed-content-area');
    const stepHeaders = contentArea.locator('h3').filter({ hasText: /^Step/ });
    const count = await stepHeaders.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const header = stepHeaders.nth(i);
      await expect(header).toBeVisible();
      const text = await header.innerText();
      expect(text.trim().length).toBeGreaterThan(0);
    }
  }

  async expectAllCopyButtonsWork() {
    const containers = this.page.getByTestId('copy-button-container');
    const count = await containers.count();
    expect(count).toBeGreaterThan(0);
    let clicked = 0;
    for (let i = 0; i < count; i++) {
      const container = containers.nth(i);
      const btn = container.getByTestId('copy-button');
      if (!await btn.isVisible()) continue;
      await btn.dispatchEvent('click');
      await expect(container.getByText('Copied!')).toBeVisible();
      clicked++;
    }
    expect(clicked).toBeGreaterThan(0);
  }
}
