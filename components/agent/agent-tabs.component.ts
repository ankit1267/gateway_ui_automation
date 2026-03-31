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

    await this.promptTab.click();

  }



  async openModel() {

    await this.modelTab.click();

  }



  async openConnectors() {

    await this.connecterTab.click();

  }



  async openMemory() {

    await this.memoryTab.click();

  }



  async openSettings() {

    await this.settingsTab.click();

  }



  async openIntegrationGuide() {

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