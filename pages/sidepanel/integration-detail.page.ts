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
  readonly showHomeButtonToggle: Locator;
  readonly showHistoryToggle: Locator;
  readonly showConfigTypeToggle: Locator;
  readonly showAdvancedParametersToggle: Locator;
  readonly showCreateManuallyButtonToggle: Locator;
  readonly showAdvancedConfigurationsToggle: Locator;
  readonly showPreToolToggle: Locator;
  readonly showResponseTypeToggle: Locator;
  readonly showVariablesToggle: Locator;
  readonly showAgentNameToggle: Locator;
  readonly slidePositionSelect: Locator;
  readonly defaultOpenToggle: Locator;
  readonly showFullScreenButtonToggle: Locator;
  readonly showCloseButtonToggle: Locator;
  readonly showHeaderToggle: Locator;
  readonly addDefaultApiKeysToggle: Locator;
  readonly themeModeSelect: Locator;
  readonly configSaveButton: Locator;
  readonly useDefaultPromptToggle: Locator;
  readonly reloadEmbedButton: Locator;

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
    this.showHomeButtonToggle = page.getByTestId('embed-config-toggle-showHomeButton');
    this.showHistoryToggle = page.getByTestId('embed-config-toggle-showHistory');
    this.showConfigTypeToggle = page.getByTestId('embed-config-toggle-showConfigType');
    this.showAdvancedParametersToggle = page.getByTestId('embed-config-toggle-showAdvancedParameters');
    this.showCreateManuallyButtonToggle = page.getByTestId('embed-config-toggle-showCreateManuallyButton');
    this.showAdvancedConfigurationsToggle = page.getByTestId('embed-config-toggle-showAdvancedConfigurations');
    this.showPreToolToggle = page.getByTestId('embed-config-toggle-showPreTool');
    this.showResponseTypeToggle = page.getByTestId('embed-config-toggle-showResponseType');
    this.showVariablesToggle = page.getByTestId('embed-config-toggle-showVariables');
    this.showAgentNameToggle = page.getByTestId('embed-config-toggle-showAgentName');
    this.slidePositionSelect = page.getByTestId('embed-config-slide-position-select');
    this.defaultOpenToggle = page.getByTestId('embed-config-toggle-defaultOpen');
    this.showFullScreenButtonToggle = page.getByTestId('embed-config-toggle-showFullScreenButton');
    this.showCloseButtonToggle = page.getByTestId('embed-config-toggle-showCloseButton');
    this.showHeaderToggle = page.getByTestId('embed-config-toggle-showHeader');
    this.addDefaultApiKeysToggle = page.getByTestId('embed-config-toggle-addDefaultApiKeys');
    this.themeModeSelect = page.getByTestId('embed-config-theme-mode-select');
    this.configSaveButton = page.getByTestId('embed-config-save-button');
    this.useDefaultPromptToggle = page.locator('.form-control').filter({ has: page.locator('span', { hasText: 'Use default prompt' }) }).locator('input[type="checkbox"]');
    this.reloadEmbedButton = page.getByTestId('embed-config-reload-button');
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
    await this.page.goto(`/org/${orgId}/integration/${folderId}`);
    await this.page.waitForURL(`/org/${orgId}/integration/${folderId}`);
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
    // The send-data input is a code editor (Monaco/CodeMirror) wrapper <div>,
    // so .fill() cannot be used directly. Focus the inner editable area,
    // select-all and type the new content.
    const editable = this.testingSendDataInput
      .locator('textarea, [contenteditable="true"]')
      .first();
    await editable.waitFor({ state: 'attached' });
    await editable.click();
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await this.page.keyboard.press(`${modifier}+A`);
    await this.page.keyboard.press('Delete');
    await this.page.keyboard.type(data);
  }

  async clickSendData() {
    await this.testingSendDataButton.click();
  }

  async clickGetAgents() {
    await this.testingGetAgentsButton.click();
  }

  async checkShowHomeButton() {
    await this.showHomeButtonToggle.check();
  }

  async uncheckShowHomeButton() {
    await this.showHomeButtonToggle.uncheck();
  }

  async expectShowHomeButtonChecked() {
    await expect(this.showHomeButtonToggle).toBeChecked();
  }

  async expectShowHomeButtonUnchecked() {
    await expect(this.showHomeButtonToggle).not.toBeChecked();
  }

  async clickSaveConfig() {
    const isEnabled = await this.configSaveButton.isEnabled();
    if (isEnabled) {
      await this.configSaveButton.click();
      await expect(this.page.getByText('Configuration saved')).toBeVisible();
      await this.waitForEmbedReload();
    }
  }

  async reloadEmbed() {
    await this.reloadEmbedButton.click();
    await this.page.waitForTimeout(20000);
  }

  async clickFirstAgentInPreview() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    const firstRow = frame.locator('[data-testid^="custom-table-row-"]').first();
    const rowCount = await frame.locator('[data-testid^="custom-table-row-"]').count();

    if (rowCount > 0) {
      await expect(firstRow).toBeVisible();
      await firstRow.click();
      // After clicking an agent, wait for the chat view's navbar to appear.
      await expect(frame.locator('[data-testid="navbar"]')).toBeVisible({ timeout: 30000 });
    }
  }

  async expectEmbedHomeButtonVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    // The check for the navbar is now part of clickFirstAgentInPreview, so we can directly check for the button.
    await expect(frame.locator('[data-testid="navbar-home-button"]')).toBeVisible();
  }

  async waitForEmbedReload() {
    // 1. Wait for the iframe host element to be attached to the outer DOM.
    const iframeEl = this.page.locator('#iframe-component-gtwyInterfaceEmbed').first();
    await iframeEl.waitFor({ state: 'attached', timeout: 30000 });

    // 2. Wait for the iframe's inner document to actually load (body present).
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
    await expect(frame.locator('body')).toBeVisible({ timeout: 30000 });

    // 3. Allow any in-iframe loading spinner/skeleton to settle, then check for the agent list.
    await this.page.waitForTimeout(1000);
    await expect(frame.locator('[data-testid^="custom-table-row-"]').first()).toBeVisible({ timeout: 60000 });
  }

  async expectEmbedHomeButtonNotVisible() {
    const frame = this.page.frameLocator('#iframe-component-gtwyInterfaceEmbed');
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

  async checkShowAdvancedParameters() {
    await this.showAdvancedParametersToggle.check();
  }

  async uncheckShowAdvancedParameters() {
    await this.showAdvancedParametersToggle.uncheck();
  }

  async expectShowAdvancedParametersChecked() {
    await expect(this.showAdvancedParametersToggle).toBeChecked();
  }

  async expectShowAdvancedParametersUnchecked() {
    await expect(this.showAdvancedParametersToggle).not.toBeChecked();
  }

  async checkShowCreateManuallyButton() {
    await this.showCreateManuallyButtonToggle.check();
  }

  async uncheckShowCreateManuallyButton() {
    await this.showCreateManuallyButtonToggle.uncheck();
  }

  async expectShowCreateManuallyButtonChecked() {
    await expect(this.showCreateManuallyButtonToggle).toBeChecked();
  }

  async expectShowCreateManuallyButtonUnchecked() {
    await expect(this.showCreateManuallyButtonToggle).not.toBeChecked();
  }

  async checkShowAdvancedConfigurations() {
    await this.showAdvancedConfigurationsToggle.check();
  }

  async uncheckShowAdvancedConfigurations() {
    await this.showAdvancedConfigurationsToggle.uncheck();
  }

  async expectShowAdvancedConfigurationsChecked() {
    await expect(this.showAdvancedConfigurationsToggle).toBeChecked();
  }

  async expectShowAdvancedConfigurationsUnchecked() {
    await expect(this.showAdvancedConfigurationsToggle).not.toBeChecked();
  }

  async checkShowPreTool() {
    await this.showPreToolToggle.check();
  }

  async uncheckShowPreTool() {
    await this.showPreToolToggle.uncheck();
  }

  async expectShowPreToolChecked() {
    await expect(this.showPreToolToggle).toBeChecked();
  }

  async expectShowPreToolUnchecked() {
    await expect(this.showPreToolToggle).not.toBeChecked();
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

  async checkShowFullScreenButton() {
    await this.showFullScreenButtonToggle.check();
  }

  async uncheckShowFullScreenButton() {
    await this.showFullScreenButtonToggle.uncheck();
  }

  async expectShowFullScreenButtonChecked() {
    await expect(this.showFullScreenButtonToggle).toBeChecked();
  }

  async expectShowFullScreenButtonUnchecked() {
    await expect(this.showFullScreenButtonToggle).not.toBeChecked();
  }

  async checkShowCloseButton() {
    await this.showCloseButtonToggle.check();
  }

  async uncheckShowCloseButton() {
    await this.showCloseButtonToggle.uncheck();
  }

  async expectShowCloseButtonChecked() {
    await expect(this.showCloseButtonToggle).toBeChecked();
  }

  async expectShowCloseButtonUnchecked() {
    await expect(this.showCloseButtonToggle).not.toBeChecked();
  }

  async checkShowHeader() {
    await this.showHeaderToggle.check();
  }

  async uncheckShowHeader() {
    await this.showHeaderToggle.uncheck();
  }

  async expectShowHeaderChecked() {
    await expect(this.showHeaderToggle).toBeChecked();
  }

  async expectShowHeaderUnchecked() {
    await expect(this.showHeaderToggle).not.toBeChecked();
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

  async expectTestingControlsVisible() {
    await expect(this.testingControls).toBeVisible();
  }

  async expectTestingBasicControlsVisible() {
    await expect(this.testingBasicControls).toBeVisible();
  }

  async expectTestingOpenButtonVisible() {
    await expect(this.testingOpenButton).toBeVisible();
  }

  async expectTestingCloseButtonVisible() {
    await expect(this.testingCloseButton).toBeVisible();
  }

  async expectTestingSendDataVisible() {
    await expect(this.testingSendData).toBeVisible();
  }

  async expectTestingSendDataInputVisible() {
    await expect(this.testingSendDataInput).toBeVisible();
  }

  async expectTestingSendDataButtonVisible() {
    await expect(this.testingSendDataButton).toBeVisible();
  }

  async expectTestingGetAgentsVisible() {
    await expect(this.testingGetAgents).toBeVisible();
  }

  async expectTestingGetAgentsButtonVisible() {
    await expect(this.testingGetAgentsButton).toBeVisible();
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
    await this.page.getByRole('button', { name: 'Clear' }).click();
  }

  async expectEventLogEmpty() {
    await expect(this.page.getByText('No events yet')).toBeVisible();
  }

  async expectEmbedPreviewVisible() {
    await this.page.locator('#iframe-component-gtwyInterfaceEmbed').first().waitFor({ state: 'attached' });
  }

  async expectEmbedPreviewNotVisible() {
    await expect(this.page.locator('#iframe-component-gtwyInterfaceEmbed').first()).not.toBeVisible();
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
      .first()
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
      .getByRole('button', { name: new RegExp(serviceName, 'i') })
      .first()
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
      .filter({ has: this.page.getByText(modelName, { exact: true }) });
    await row.locator('input[type="checkbox"][title="Show/Hide model"]').uncheck();
  }

  async checkModelInSettings(modelName: string) {
    const row = this.page
      .locator('div.bg-base-100.rounded')
      .filter({ has: this.page.getByText(modelName, { exact: true }) });
    await row.locator('input[type="checkbox"][title="Show/Hide model"]').check();
  }

  async changeModelDisplayName(modelName: string, newName: string) {
    const row = this.page
      .locator('div.bg-base-100.rounded')
      .filter({ has: this.page.getByText(modelName, { exact: true }) });
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
    const containers = this.page.getByTestId('code-block-container');
    const count = await containers.count();
    expect(count).toBeGreaterThan(0);
    let clicked = 0;
    for (let i = 0; i < count; i++) {
      const container = containers.nth(i);
      const btn = container.getByTestId('code-block-copy-button');
      if (!await btn.isVisible()) continue;
      await btn.dispatchEvent('click');
      await expect(container.getByText('Copied!')).toBeVisible();
      clicked++;
    }
    expect(clicked).toBeGreaterThan(0);
  }
}
