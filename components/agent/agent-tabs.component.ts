import type { Page, Locator } from '@playwright/test';





export class AgentTabs {

  private readonly connecterTab: Locator;

  private readonly promptTab: Locator;

  private readonly modelTab: Locator;

  private readonly memoryTab: Locator;

  private readonly settingsTab: Locator;

  private readonly integrationGuideTab: Locator;

    

  constructor(private readonly page: Page) {

    this.connecterTab = this.page.getByTestId('tab-button-connectors');

    this.promptTab = this.page.getByTestId('tab-button-prompt');

    this.modelTab = this.page.getByTestId('tab-button-model');

    this.memoryTab = this.page.getByTestId('tab-button-memory');

    this.settingsTab = this.page.getByTestId('tab-button-settings');

    this.integrationGuideTab = this.page.getByTestId('tab-button-integration');

  }



  async openPrompt() {

    if (this.page.isClosed()) {
      throw new Error('Cannot open prompt tab: page is already closed');
    }
    await this.promptTab.click();

  }



  async openModel() {

    if (this.page.isClosed()) {
      throw new Error('Cannot open model tab: page is already closed');
    }
    await this.modelTab.click();

  }



  async openConnectors() {

    if (this.page.isClosed()) {
      throw new Error('Cannot open connectors tab: page is already closed');
    }
    await this.connecterTab.click();

  }



  async openMemory() {

    if (this.page.isClosed()) {
      throw new Error('Cannot open memory tab: page is already closed');
    }
    await this.memoryTab.click();

  }



  async openSettings() {

    if (this.page.isClosed()) {
      throw new Error('Cannot open settings tab: page is already closed');
    }
    await this.settingsTab.click();

  }



  async openIntegrationGuide() {

    if (this.page.isClosed()) {
      throw new Error('Cannot open integration guide tab: page is already closed');
    }
    await this.integrationGuideTab.click();

  }



  async isConnectorsTabVisible(): Promise<boolean> {

    return this.connecterTab.isVisible();

  }



  async isPromptTabVisible(): Promise<boolean> {

    return this.promptTab.isVisible();

  }



  async isModelTabVisible(): Promise<boolean> {

    return this.modelTab.isVisible();

  }



  async isMemoryTabVisible(): Promise<boolean> {

    return this.memoryTab.isVisible();

  }



  async isSettingsTabVisible(): Promise<boolean> {

    return this.settingsTab.isVisible();

  }



  async isIntegrationGuideTabVisible(): Promise<boolean> {

    return this.integrationGuideTab.isVisible();

  }



  getTab(tabName: string): Locator {

    return this.page.getByTestId(`tab-button-${tabName}`);

  }



  async clickTab(tabName: string) {

    await this.getTab(tabName).click();

  }

}