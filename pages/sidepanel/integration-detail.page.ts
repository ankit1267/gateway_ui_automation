import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class IntegrationDetailPage {
  readonly page: Page;
  readonly loadingSpinner: Locator;
  readonly detailView: Locator;
  readonly sidebar: Locator;
  readonly mainNav: Locator;
  readonly integrationTab: Locator;
  readonly configurationTab: Locator;
  readonly testingTab: Locator;
  readonly contentArea: Locator;
  readonly configBackButton: Locator;
  readonly testingBackButton: Locator;
  readonly testingSidebarContent: Locator;

  readonly integrationTabContent: Locator;
  readonly integrationStep1: Locator;
  readonly integrationStep2: Locator;
  readonly integrationStep3: Locator;
  readonly configureInterface: Locator;
  readonly eventListener: Locator;

  readonly testingControls: Locator;
  readonly testingBasicControls: Locator;
  readonly testingOpenButton: Locator;
  readonly testingCloseButton: Locator;
  readonly testingSendData: Locator;
  readonly testingSendDataInput: Locator;
  readonly testingSendDataButton: Locator;
  readonly testingGetAgents: Locator;
  readonly testingGetAgentsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.locator('.loading.loading-spinner');
    this.detailView = page.getByTestId('integration-detail-view');
    this.sidebar = page.getByTestId('integration-sidebar');
    this.mainNav = page.getByTestId('integration-main-nav');
    this.integrationTab = page.getByTestId('integration-tab-integration');
    this.configurationTab = page.getByTestId('integration-tab-configuration');
    this.testingTab = page.getByTestId('integration-tab-testing');
    this.contentArea = page.getByTestId('integration-content-area');
    this.configBackButton = page.getByTestId('integration-config-back-button');
    this.testingBackButton = page.getByTestId('integration-testing-back-button');
    this.testingSidebarContent = page.getByTestId('integration-testing-sidebar-content');

    this.integrationTabContent = page.getByTestId('integration-tab');
    this.integrationStep1 = page.getByTestId('integration-tab-step1');
    this.integrationStep2 = page.getByTestId('integration-tab-step2');
    this.integrationStep3 = page.getByTestId('integration-tab-step3');
    this.configureInterface = page.getByTestId('integration-tab-configure-interface');
    this.eventListener = page.getByTestId('integration-tab-event-listener');

    this.testingControls = page.getByTestId('integration-testing-controls');
    this.testingBasicControls = page.getByTestId('integration-testing-basic-controls');
    this.testingOpenButton = page.getByTestId('integration-testing-open-button');
    this.testingCloseButton = page.getByTestId('integration-testing-close-button');
    this.testingSendData = page.getByTestId('integration-testing-send-data');
    this.testingSendDataInput = page.getByTestId('integration-testing-send-data-input');
    this.testingSendDataButton = page.getByTestId('integration-testing-send-data-button');
    this.testingGetAgents = page.getByTestId('integration-testing-get-agents');
    this.testingGetAgentsButton = page.getByTestId('integration-testing-get-agents-button');
  }

  async goto(folderId: string) {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/integration/${folderId}`);
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

  async clickConfigurationTab() {
    await this.configurationTab.click();
  }

  async clickTestingTab() {
    await this.testingTab.click();
  }

  async clickConfigBackButton() {
    await this.configBackButton.click();
  }

  async clickTestingBackButton() {
    await this.testingBackButton.click();
  }

  async clickTestingOpen() {
    await this.testingOpenButton.click();
  }

  async clickTestingClose() {
    await this.testingCloseButton.click();
  }

  async fillSendData(data: string) {
    await this.testingSendDataInput.fill(data);
  }

  async clickSendData() {
    await this.testingSendDataButton.click();
  }

  async clickGetAgents() {
    await this.testingGetAgentsButton.click();
  }

  async isTestingMode(): Promise<boolean> {
    return this.testingControls.isVisible();
  }

  async isConfigMode(): Promise<boolean> {
    return this.configBackButton.isVisible();
  }

  async isIntegrationMode(): Promise<boolean> {
    return this.mainNav.isVisible();
  }

  async expectAllStepsHaveText() {
    const stepTestIds = [
      'integration-tab-step1',
      'integration-tab-step2',
      'integration-tab-configure-interface',
      'integration-tab-step3',
      'integration-tab-event-listener',
    ];
    for (const testId of stepTestIds) {
      const section = this.page.getByTestId(testId);
      await expect(section).toBeVisible();
      const text = await section.innerText();
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
