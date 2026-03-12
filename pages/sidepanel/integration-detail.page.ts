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
  readonly hideHomeButtonToggle: Locator;
  readonly showHistoryToggle: Locator;
  readonly showConfigTypeToggle: Locator;
  readonly hideAdvancedParametersToggle: Locator;
  readonly hideCreateManuallyButtonToggle: Locator;
  readonly hideAdvancedConfigurationsToggle: Locator;
  readonly hidePreToolToggle: Locator;
  readonly showResponseTypeToggle: Locator;
  readonly showVariablesToggle: Locator;
  readonly showAgentNameToggle: Locator;
  readonly slidePositionSelect: Locator;
  readonly defaultOpenToggle: Locator;
  readonly hideFullScreenButtonToggle: Locator;
  readonly hideCloseButtonToggle: Locator;
  readonly hideHeaderToggle: Locator;
  readonly addDefaultApiKeysToggle: Locator;
  readonly themeModeSelect: Locator;
  readonly configSaveButton: Locator;
  readonly useDefaultPromptToggle: Locator;

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
    this.hideHomeButtonToggle = page.locator('label').filter({ hasText: 'Hide Home Button' }).locator('input[type="checkbox"]');
    this.showHistoryToggle = page.locator('label').filter({ hasText: 'Show History' }).locator('input[type="checkbox"]');
    this.showConfigTypeToggle = page.locator('label').filter({ hasText: 'Show Config Type' }).locator('input[type="checkbox"]');
    this.hideAdvancedParametersToggle = page.locator('label').filter({ hasText: 'Hide Advanced Parameters' }).locator('input[type="checkbox"]');
    this.hideCreateManuallyButtonToggle = page.locator('label').filter({ hasText: 'Hide Create Agent Manually Button' }).locator('input[type="checkbox"]');
    this.hideAdvancedConfigurationsToggle = page.locator('label').filter({ hasText: 'Hide Advanced Configurations' }).locator('input[type="checkbox"]');
    this.hidePreToolToggle = page.locator('label').filter({ hasText: 'Hide Pre Tool' }).locator('input[type="checkbox"]');
    this.showResponseTypeToggle = page.locator('label').filter({ hasText: 'Show Response Type' }).locator('input[type="checkbox"]');
    this.showVariablesToggle = page.locator('label').filter({ hasText: 'Show Variables' }).locator('input[type="checkbox"]');
    this.showAgentNameToggle = page.locator('label').filter({ hasText: 'Show Agent Name' }).locator('input[type="checkbox"]');
    this.slidePositionSelect = page.locator('.bg-base-200').filter({ has: page.locator('span', { hasText: 'Slide Position' }) }).locator('select');
    this.defaultOpenToggle = page.locator('label').filter({ hasText: 'Default Open' }).locator('input[type="checkbox"]');
    this.hideFullScreenButtonToggle = page.locator('label').filter({ hasText: 'Hide Full Screen' }).locator('input[type="checkbox"]');
    this.hideCloseButtonToggle = page.locator('label').filter({ hasText: 'Hide Close Button' }).locator('input[type="checkbox"]');
    this.hideHeaderToggle = page.locator('label').filter({ hasText: 'Hide Header' }).locator('input[type="checkbox"]');
    this.addDefaultApiKeysToggle = page.locator('label').filter({ hasText: 'Add Default ApiKeys' }).locator('input[type="checkbox"]');
    this.themeModeSelect = page.locator('.bg-base-200').filter({ has: page.locator('span', { hasText: 'Theme Mode' }) }).locator('select');
    this.configSaveButton = page.getByRole('button', { name: 'Save' }).first();
    this.useDefaultPromptToggle = page.locator('.form-control').filter({ has: page.locator('span', { hasText: 'Use default prompt' }) }).locator('input[type="checkbox"]');
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

  async checkHideHomeButton() {
    await this.hideHomeButtonToggle.check();
  }

  async uncheckHideHomeButton() {
    await this.hideHomeButtonToggle.uncheck();
  }

  async expectHideHomeButtonChecked() {
    await expect(this.hideHomeButtonToggle).toBeChecked();
  }

  async expectHideHomeButtonUnchecked() {
    await expect(this.hideHomeButtonToggle).not.toBeChecked();
  }

  async clickSaveConfig() {
    const isEnabled = await this.configSaveButton.isEnabled();
    if (isEnabled) {
      await this.configSaveButton.click();
      await expect(this.page.getByText('Configuration saved')).toBeVisible();
    }
  }

  async clickFirstAgentInPreview() {
    const firstRow = this.page
      .frameLocator('#iframe-component-gtwyInterfaceEmbed')
      .locator('[data-testid^="custom-table-row-"]')
      .first();
    await expect(firstRow).toBeVisible();
    await firstRow.click();
  }

  async expectEmbedHomeButtonVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await expect(frame.locator('[data-testid="navbar-home-button"]')).toBeVisible();
  }

  async expectEmbedHomeButtonNotVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await expect(frame.locator('[data-testid="navbar-home-button"]')).not.toBeVisible();
  }

  async checkShowHistory() {
    await this.showHistoryToggle.check();
  }

  async uncheckShowHistory() {
    await this.showHistoryToggle.uncheck();
  }

  async expectShowHistoryChecked() {
    await expect(this.showHistoryToggle).toBeChecked();
  }

  async expectShowHistoryUnchecked() {
    await expect(this.showHistoryToggle).not.toBeChecked();
  }

  async expectEmbedTabsVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await expect(frame.locator('[data-testid^="navbar-tab-"]').first()).toBeVisible();
  }

  async expectEmbedTabsNotVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await expect(frame.locator('[data-testid^="navbar-tab-"]').first()).not.toBeVisible();
  }

  async checkShowConfigType() {
    await this.showConfigTypeToggle.check();
  }

  async uncheckShowConfigType() {
    await this.showConfigTypeToggle.uncheck();
  }

  async expectShowConfigTypeChecked() {
    await expect(this.showConfigTypeToggle).toBeChecked();
  }

  async expectShowConfigTypeUnchecked() {
    await expect(this.showConfigTypeToggle).not.toBeChecked();
  }

  async checkHideAdvancedParameters() {
    await this.hideAdvancedParametersToggle.check();
  }

  async uncheckHideAdvancedParameters() {
    await this.hideAdvancedParametersToggle.uncheck();
  }

  async expectHideAdvancedParametersChecked() {
    await expect(this.hideAdvancedParametersToggle).toBeChecked();
  }

  async expectHideAdvancedParametersUnchecked() {
    await expect(this.hideAdvancedParametersToggle).not.toBeChecked();
  }

  async checkHideCreateManuallyButton() {
    await this.hideCreateManuallyButtonToggle.check();
  }

  async uncheckHideCreateManuallyButton() {
    await this.hideCreateManuallyButtonToggle.uncheck();
  }

  async expectHideCreateManuallyButtonChecked() {
    await expect(this.hideCreateManuallyButtonToggle).toBeChecked();
  }

  async expectHideCreateManuallyButtonUnchecked() {
    await expect(this.hideCreateManuallyButtonToggle).not.toBeChecked();
  }

  async checkHideAdvancedConfigurations() {
    await this.hideAdvancedConfigurationsToggle.check();
  }

  async uncheckHideAdvancedConfigurations() {
    await this.hideAdvancedConfigurationsToggle.uncheck();
  }

  async expectHideAdvancedConfigurationsChecked() {
    await expect(this.hideAdvancedConfigurationsToggle).toBeChecked();
  }

  async expectHideAdvancedConfigurationsUnchecked() {
    await expect(this.hideAdvancedConfigurationsToggle).not.toBeChecked();
  }

  async checkHidePreTool() {
    await this.hidePreToolToggle.check();
  }

  async uncheckHidePreTool() {
    await this.hidePreToolToggle.uncheck();
  }

  async expectHidePreToolChecked() {
    await expect(this.hidePreToolToggle).toBeChecked();
  }

  async expectHidePreToolUnchecked() {
    await expect(this.hidePreToolToggle).not.toBeChecked();
  }

  async checkShowResponseType() {
    await this.showResponseTypeToggle.check();
  }

  async uncheckShowResponseType() {
    await this.showResponseTypeToggle.uncheck();
  }

  async expectShowResponseTypeChecked() {
    await expect(this.showResponseTypeToggle).toBeChecked();
  }

  async expectShowResponseTypeUnchecked() {
    await expect(this.showResponseTypeToggle).not.toBeChecked();
  }

  async checkShowVariables() {
    await this.showVariablesToggle.check();
  }

  async uncheckShowVariables() {
    await this.showVariablesToggle.uncheck();
  }

  async expectShowVariablesChecked() {
    await expect(this.showVariablesToggle).toBeChecked();
  }

  async expectShowVariablesUnchecked() {
    await expect(this.showVariablesToggle).not.toBeChecked();
  }

  async checkShowAgentName() {
    await this.showAgentNameToggle.check();
  }

  async uncheckShowAgentName() {
    await this.showAgentNameToggle.uncheck();
  }

  async expectShowAgentNameChecked() {
    await expect(this.showAgentNameToggle).toBeChecked();
  }

  async expectShowAgentNameUnchecked() {
    await expect(this.showAgentNameToggle).not.toBeChecked();
  }

  async clickEmbedInternalTab(tabId: string) {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await frame.locator(`[data-testid="tab-button-${tabId}"]`).click();
  }

  async expectEmbedConfigTypeVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="bridge-type-toggle-container"]')).toBeVisible();
  }

  async expectEmbedConfigTypeNotVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="bridge-type-toggle-container"]')).not.toBeVisible();
  }

  async expectEmbedModelParametersSectionVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="model-tab-parameters-section"]')).toBeVisible();
  }

  async expectEmbedModelParametersSectionNotVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="model-tab-parameters-section"]')).not.toBeVisible();
  }

  async expectEmbedAdvancedConfigurationVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="advanced-configuration-container"]')).toBeVisible();
  }

  async expectEmbedAdvancedConfigurationNotVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="advanced-configuration-container"]')).not.toBeVisible();
  }

  async expectEmbedPreToolSectionVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await expect(frame.locator('[data-testid="input-section-pre-embed-wrapper"]')).toBeVisible();
  }

  async expectEmbedPreToolSectionNotVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await expect(frame.locator('[data-testid="input-section-pre-embed-wrapper"]')).not.toBeVisible();
  }

  async expectEmbedVariablesSectionVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await expect(frame.locator('[data-testid="default-variables-section"]')).toBeVisible();
  }

  async expectEmbedVariablesSectionNotVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await expect(frame.locator('[data-testid="default-variables-section"]')).not.toBeVisible();
  }

  async expectEmbedAgentNameVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await expect(frame.locator('[data-testid="navbar-agent-name-display"]')).toBeVisible();
  }

  async expectEmbedAgentNameNotVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await expect(frame.locator('[data-testid="navbar-agent-name-display"]')).not.toBeVisible();
  }

  async selectSlidePosition(value: string) {
    await this.slidePositionSelect.selectOption(value);
  }

  async expectSlidePositionSelected(value: string) {
    await expect(this.slidePositionSelect).toHaveValue(value);
  }

  async checkDefaultOpen() {
    await this.defaultOpenToggle.check();
  }

  async uncheckDefaultOpen() {
    await this.defaultOpenToggle.uncheck();
  }

  async expectDefaultOpenChecked() {
    await expect(this.defaultOpenToggle).toBeChecked();
  }

  async expectDefaultOpenUnchecked() {
    await expect(this.defaultOpenToggle).not.toBeChecked();
  }

  async checkHideFullScreenButton() {
    await this.hideFullScreenButtonToggle.check();
  }

  async uncheckHideFullScreenButton() {
    await this.hideFullScreenButtonToggle.uncheck();
  }

  async expectHideFullScreenButtonChecked() {
    await expect(this.hideFullScreenButtonToggle).toBeChecked();
  }

  async expectHideFullScreenButtonUnchecked() {
    await expect(this.hideFullScreenButtonToggle).not.toBeChecked();
  }

  async checkHideCloseButton() {
    await this.hideCloseButtonToggle.check();
  }

  async uncheckHideCloseButton() {
    await this.hideCloseButtonToggle.uncheck();
  }

  async expectHideCloseButtonChecked() {
    await expect(this.hideCloseButtonToggle).toBeChecked();
  }

  async expectHideCloseButtonUnchecked() {
    await expect(this.hideCloseButtonToggle).not.toBeChecked();
  }

  async checkHideHeader() {
    await this.hideHeaderToggle.check();
  }

  async uncheckHideHeader() {
    await this.hideHeaderToggle.uncheck();
  }

  async expectHideHeaderChecked() {
    await expect(this.hideHeaderToggle).toBeChecked();
  }

  async expectHideHeaderUnchecked() {
    await expect(this.hideHeaderToggle).not.toBeChecked();
  }

  async checkAddDefaultApiKeys() {
    await this.addDefaultApiKeysToggle.check();
  }

  async uncheckAddDefaultApiKeys() {
    await this.addDefaultApiKeysToggle.uncheck();
  }

  async expectAddDefaultApiKeysChecked() {
    await expect(this.addDefaultApiKeysToggle).toBeChecked();
  }

  async expectAddDefaultApiKeysUnchecked() {
    await expect(this.addDefaultApiKeysToggle).not.toBeChecked();
  }

  async expectApiKeysInputVisible() {
    await expect(this.page.getByText('Configure API Keys for Services')).toBeVisible();
  }

  async expectApiKeysInputNotVisible() {
    await expect(this.page.getByText('Configure API Keys for Services')).not.toBeVisible();
  }

  async selectThemeMode(value: string) {
    await this.themeModeSelect.selectOption(value);
  }

  async expectThemeModeSelected(value: string) {
    await expect(this.themeModeSelect).toHaveValue(value);
  }

  async expectEmbedThemeMode(theme: string) {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await expect(frame.locator('html')).toHaveAttribute('data-theme', theme);
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

  async expectConfigBackButtonVisible() {
    await expect(this.configBackButton).toBeVisible();
  }

  async expectMainNavVisible() {
    await expect(this.mainNav).toBeVisible();
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

  // -------------------------
  // PROMPT CONFIGURATION
  // -------------------------

  async checkUseDefaultPrompt() {
    await this.useDefaultPromptToggle.check();
  }

  async uncheckUseDefaultPrompt() {
    await this.useDefaultPromptToggle.uncheck();
  }

  async expectCustomPromptTemplateVisible() {
    await expect(this.page.getByText('Custom Prompt Template')).toBeVisible();
    await expect(this.page.getByPlaceholder('You are a {{role}}')).toBeVisible();
  }

  async expectCustomPromptTemplateNotVisible() {
    await expect(this.page.getByText('Custom Prompt Template')).not.toBeVisible();
  }

  // -------------------------
  // TOOLS CONFIGURATION
  // -------------------------

  async clickToolsAddButton() {
    await this.page
      .locator('div.space-y-3')
      .filter({ has: this.page.locator('h5', { hasText: 'Tools Configuration' }) })
      .locator('button', { hasText: 'Add' })
      .click();
  }

  async expectToolsDropdownVisible() {
    await expect(this.page.getByTestId('embed-suggestion-dropdown-menu')).toBeVisible();
  }

  // -------------------------
  // MODEL SETTINGS (config panel)
  // -------------------------

  async clickModelSettingsServiceButton(serviceName: string) {
    await this.page
      .locator('button[type="button"]')
      .filter({ has: this.page.locator('span.font-medium.capitalize', { hasText: serviceName }) })
      .click();
  }

  async getFirstModelNameInService(): Promise<string> {
    const firstRow = this.page
      .locator('div.bg-base-100.rounded')
      .filter({ has: this.page.locator('input[type="checkbox"][title="Show/Hide model"]') })
      .first();
    return (await firstRow.locator('span.truncate').textContent()) || '';
  }

  async uncheckModelInSettings(modelName: string) {
    const row = this.page
      .locator('div.bg-base-100.rounded')
      .filter({ has: this.page.locator('span', { hasText: modelName }) });
    await row.locator('input[type="checkbox"][title="Show/Hide model"]').uncheck();
  }

  async checkModelInSettings(modelName: string) {
    const row = this.page
      .locator('div.bg-base-100.rounded')
      .filter({ has: this.page.locator('span', { hasText: modelName }) });
    await row.locator('input[type="checkbox"][title="Show/Hide model"]').check();
  }

  async changeModelDisplayName(modelName: string, newName: string) {
    const row = this.page
      .locator('div.bg-base-100.rounded')
      .filter({ has: this.page.locator('span', { hasText: modelName }) });
    const input = row.locator('input[type="text"]');
    await input.clear();
    await input.fill(newName);
    await input.blur();
  }

  // -------------------------
  // EMBED MODEL TAB & DROPDOWN
  // -------------------------

  async clickEmbedModelTab() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('[data-testid="tabs-layout-container"]')).toBeVisible();
    await frame.locator('[data-testid="tab-button-model"]').click();
  }

  async selectEmbedService(serviceName: string) {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await frame.getByTestId('service-dropdown-trigger-button').click();
    await frame.getByTestId(`service-dropdown-option-${serviceName}`).click();
  }

  async openEmbedModelDropdown() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await frame.getByTestId('model-dropdown-trigger-button').click();
  }

  async expectEmbedModelVisible(modelName: string) {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.getByTestId(`model-dropdown-grouped-option-${modelName}`)).toBeVisible();
  }

  async expectEmbedModelNotVisible(modelName: string) {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.getByTestId(`model-dropdown-grouped-option-${modelName}`)).not.toBeVisible();
  }

  async expectEmbedModelHasDisplayName(modelName: string, displayName: string) {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.getByTestId(`model-dropdown-grouped-option-${modelName}`)).toContainText(displayName);
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
