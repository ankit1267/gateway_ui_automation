import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class ModelGardenPage {
  readonly page: Page;

  // Page header
  readonly pageHeader: Locator;
  readonly pageTitle: Locator;

  // Services sidebar
  readonly servicesSidebar: Locator;
  readonly servicesHeading: Locator;

  // Service buttons (dynamic)
  getServiceButton(serviceName: string): Locator {
    return this.page.getByText(serviceName, { exact: false });
  }

  // Models panel
  readonly modelsPanel: Locator;
  readonly panelHeader: Locator;
  readonly panelTitle: Locator;
  readonly panelCloseButton: Locator;

  // Search bar
  readonly searchInput: Locator;

  // Model table
  readonly modelTable: Locator;
  readonly tableHeader: Locator;

  // Model detail slider
  readonly modelDetailSlider: Locator;
  readonly sliderHeader: Locator;
  readonly sliderCloseButton: Locator;
  readonly sliderContent: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page header
    this.pageHeader = this.page.locator('div.px-6.pt-6.pb-4');
    this.pageTitle = this.page.getByRole('heading', { name: 'Model Garden' });

    // Services sidebar
    this.servicesSidebar = this.page.locator('.w-56.border-r');
    this.servicesHeading = this.page.getByText('Services', { exact: true });

    // Models panel
    this.modelsPanel = this.page.locator('.absolute.inset-0.flex.flex-col.bg-base-100');
    this.panelHeader = this.page.locator('.flex.items-center.justify-between.px-5.py-4');
    this.panelTitle = this.page.locator('h2');
    this.panelCloseButton = this.page.locator('.btn.btn-ghost.btn-sm.btn-square').first();

    // Search bar
    this.searchInput = this.page.getByPlaceholder('Search models...');

    // Model table
    this.modelTable = this.page.locator('table.table');
    this.tableHeader = this.page.locator('thead');

    // Model detail slider
    this.modelDetailSlider = this.page.locator('#model-detail-sidebar');
    this.sliderHeader = this.page.locator('.flex.items-center.justify-between.px-6.py-4');
    this.sliderCloseButton = this.modelDetailSlider.locator('.btn.btn-ghost.btn-sm.btn-square');
    this.sliderContent = this.page.locator('.space-y-4');
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/model-garden`);
    await this.page.waitForURL(`/org/${orgId}/model-garden`);
  }

  async expectPageVisible() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.servicesHeading).toBeVisible();
  }

  async selectService(serviceName: string) {
    await this.getServiceButton(serviceName).click();
    await this.modelsPanel.waitFor({ state: 'visible' });
  }

  async expectModelsPanelVisible() {
    await expect(this.modelsPanel).toBeVisible();
  }

  async expectModelsPanelHidden() {
    await expect(this.modelsPanel).not.toBeVisible();
  }

  async closeModelsPanel() {
    await this.panelCloseButton.click();
    await this.modelsPanel.waitFor({ state: 'hidden' });
  }

  async searchModels(query: string) {
    await this.searchInput.fill(query);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async clickModelByName(modelName: string) {
    await this.modelTable.getByText(modelName).click();
    await this.modelDetailSlider.waitFor({ state: 'visible' });
  }

  async expectModelDetailSliderVisible() {
    await expect(this.modelDetailSlider).toBeVisible();
  }

  async expectModelDetailSliderHidden() {
    await expect(this.modelDetailSlider).not.toBeVisible();
  }

  async closeModelDetailSlider() {
    await this.sliderCloseButton.click();
    await this.modelDetailSlider.waitFor({ state: 'hidden' });
  }

  async expectModelDetailContains(text: string) {
    await expect(this.sliderContent).toContainText(text);
  }

  async getModelCount(): Promise<number> {
    const rows = await this.modelTable.locator('tbody tr').count();
    return rows;
  }
}
