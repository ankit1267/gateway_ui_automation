import type { Page, Locator } from '@playwright/test';

export class HistoryVisualizePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly goBackButton: Locator;
  readonly closeButton: Locator;
  readonly reactFlowCanvas: Locator;
  readonly reactFlowNodes: Locator;
  readonly reactFlowEdges: Locator;
  readonly reactFlowZoomIn: Locator;
  readonly reactFlowZoomOut: Locator;
  readonly reactFlowFitView: Locator;
  readonly toolSlider: Locator;
  readonly responseSlider: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Agent Execution Flow' });
    this.goBackButton = page.getByRole('button', { name: 'GO BACK' });
    this.closeButton = page.locator('button').filter({ hasText: '✕' }).first();
    this.reactFlowCanvas = page.locator('.react-flow');
    this.reactFlowNodes = page.locator('.react-flow__node');
    this.reactFlowEdges = page.locator('.react-flow__edge');
    this.reactFlowZoomIn = page.locator('.react-flow__controls-zoomin');
    this.reactFlowZoomOut = page.locator('.react-flow__controls-zoomout');
    this.reactFlowFitView = page.locator('.react-flow__controls-fitview');
    this.toolSlider = page.locator('[class*="tool-slider"], [data-testid*="tool-slider"]');
    this.responseSlider = page.locator('[class*="response-slider"], [data-testid*="response-slider"]');
    this.loadingIndicator = page.locator('.loading, .animate-spin');
  }

  private async dismissOnboardingOverlay() {
    const overlay = this.page.getByTestId('org-page-guard-modal-overlay');
    if (await overlay.isVisible()) {
      await this.page.getByRole('button', { name: 'Close onboarding' }).click();
      await overlay.waitFor({ state: 'hidden' });
    }
  }

  async goto(agentId: string, messageId: string, threadId: string, subThreadId: string) {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(
      `/org/${orgId}/agents/history/${agentId}/visualize?message_id=${messageId}&thread_id=${threadId}&subThread_id=${subThreadId}`
    );
    await this.page.waitForURL(/\/agents\/history\/.*\/visualize/);
    await this.dismissOnboardingOverlay();
  }

  async waitForPage() {
    await this.reactFlowCanvas.waitFor({ state: 'visible' });
  }

  async clickGoBack() {
    await this.goBackButton.click();
  }

  async clickClose() {
    await this.closeButton.click();
  }

  async isFlowVisible(): Promise<boolean> {
    return this.reactFlowCanvas.isVisible();
  }

  async getNodeCount(): Promise<number> {
    return this.reactFlowNodes.count();
  }

  async getEdgeCount(): Promise<number> {
    return this.reactFlowEdges.count();
  }

  async clickNode(index: number) {
    await this.reactFlowNodes.nth(index).click();
  }

  getNodeByText(text: string): Locator {
    return this.reactFlowNodes.filter({ hasText: text });
  }

  async clickNodeByText(text: string) {
    await this.getNodeByText(text).click();
  }

  async zoomIn() {
    await this.reactFlowZoomIn.click();
  }

  async zoomOut() {
    await this.reactFlowZoomOut.click();
  }

  async fitView() {
    await this.reactFlowFitView.click();
  }

  async isLoading(): Promise<boolean> {
    return this.loadingIndicator.isVisible();
  }
}
