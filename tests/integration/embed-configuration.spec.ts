import { test, expect } from '../../fixtures/base.fixture';

test.describe('GTWY Embed - Configuration', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoIntegration();
    await sidepanel.integrationPage.waitForPage();
    await sidepanel.integrationPage.openFirstRow();
    await sidepanel.integrationDetailPage.waitForPage();
    await sidepanel.integrationDetailPage.clickConfigurationTab();
  });

  test('TC-EMBED-CONFIG-01: Home button is hidden in live preview when Hide Home Button is enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkHideHomeButton();
    await sidepanel.integrationDetailPage.expectHideHomeButtonChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedHomeButtonNotVisible();
  });

  test('TC-EMBED-CONFIG-02: Home button is visible in live preview when Hide Home Button is disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckHideHomeButton();
    await sidepanel.integrationDetailPage.expectHideHomeButtonUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedHomeButtonVisible();
  });

  test('TC-EMBED-CONFIG-03: History tabs are visible in live preview when Show History is enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkShowHistory();
    await sidepanel.integrationDetailPage.expectShowHistoryChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedTabsVisible();
  });

  test('TC-EMBED-CONFIG-04: History tabs are not visible in live preview when Show History is disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckShowHistory();
    await sidepanel.integrationDetailPage.expectShowHistoryUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedTabsNotVisible();
  });

  test('TC-EMBED-CONFIG-05: Config type toggle is visible in Settings tab when Show Config Type is enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkShowConfigType();
    await sidepanel.integrationDetailPage.expectShowConfigTypeChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.clickEmbedInternalTab('settings');
    await sidepanel.integrationDetailPage.expectEmbedConfigTypeVisible();
  });

  test('TC-EMBED-CONFIG-06: Config type toggle is not visible in Settings tab when Show Config Type is disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckShowConfigType();
    await sidepanel.integrationDetailPage.expectShowConfigTypeUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.clickEmbedInternalTab('settings');
    await sidepanel.integrationDetailPage.expectEmbedConfigTypeNotVisible();
  });

  test('TC-EMBED-CONFIG-07: Parameters section is visible in Model tab when Hide Advanced Parameters is disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckHideAdvancedParameters();
    await sidepanel.integrationDetailPage.expectHideAdvancedParametersUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.clickEmbedInternalTab('model');
    await sidepanel.integrationDetailPage.expectEmbedModelParametersSectionVisible();
  });

  test('TC-EMBED-CONFIG-08: Parameters section is not visible in Model tab when Hide Advanced Parameters is enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkHideAdvancedParameters();
    await sidepanel.integrationDetailPage.expectHideAdvancedParametersChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.clickEmbedInternalTab('model');
    await sidepanel.integrationDetailPage.expectEmbedModelParametersSectionNotVisible();
  });

  test('TC-EMBED-CONFIG-09: Hide Create Agent Manually Button toggle can be enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkHideCreateManuallyButton();
    await sidepanel.integrationDetailPage.expectHideCreateManuallyButtonChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-10: Hide Create Agent Manually Button toggle can be disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckHideCreateManuallyButton();
    await sidepanel.integrationDetailPage.expectHideCreateManuallyButtonUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-11: Advanced configurations are visible in Settings tab when Hide Advanced Configurations is disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckHideAdvancedConfigurations();
    await sidepanel.integrationDetailPage.expectHideAdvancedConfigurationsUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.clickEmbedInternalTab('settings');
    await sidepanel.integrationDetailPage.expectEmbedAdvancedConfigurationVisible();
  });

  test('TC-EMBED-CONFIG-12: Advanced configurations are not visible in Settings tab when Hide Advanced Configurations is enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkHideAdvancedConfigurations();
    await sidepanel.integrationDetailPage.expectHideAdvancedConfigurationsChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.clickEmbedInternalTab('settings');
    await sidepanel.integrationDetailPage.expectEmbedAdvancedConfigurationNotVisible();
  });

  test('TC-EMBED-CONFIG-13: Pre Tool section is visible in live preview when Hide Pre Tool is disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckHidePreTool();
    await sidepanel.integrationDetailPage.expectHidePreToolUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedPreToolSectionVisible();
  });

  test('TC-EMBED-CONFIG-14: Pre Tool section is not visible in live preview when Hide Pre Tool is enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkHidePreTool();
    await sidepanel.integrationDetailPage.expectHidePreToolChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedPreToolSectionNotVisible();
  });

  test('TC-EMBED-CONFIG-15: Show Response Type toggle can be enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkShowResponseType();
    await sidepanel.integrationDetailPage.expectShowResponseTypeChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-16: Show Response Type toggle can be disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckShowResponseType();
    await sidepanel.integrationDetailPage.expectShowResponseTypeUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-17: Variables section is visible in live preview when Show Variables is enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkShowVariables();
    await sidepanel.integrationDetailPage.expectShowVariablesChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedVariablesSectionVisible();
  });

  test('TC-EMBED-CONFIG-18: Variables section is not visible in live preview when Show Variables is disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckShowVariables();
    await sidepanel.integrationDetailPage.expectShowVariablesUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedVariablesSectionNotVisible();
  });

  test('TC-EMBED-CONFIG-19: Agent name is visible in navbar when Show Agent Name is enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkShowAgentName();
    await sidepanel.integrationDetailPage.expectShowAgentNameChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedAgentNameVisible();
  });

  test('TC-EMBED-CONFIG-20: Agent name is not visible in navbar when Show Agent Name is disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckShowAgentName();
    await sidepanel.integrationDetailPage.expectShowAgentNameUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedAgentNameNotVisible();
  });

  test('TC-EMBED-CONFIG-21: Slide Position can be set to left', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.selectSlidePosition('left');
    await sidepanel.integrationDetailPage.expectSlidePositionSelected('left');
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-22: Slide Position can be set to right', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.selectSlidePosition('right');
    await sidepanel.integrationDetailPage.expectSlidePositionSelected('right');
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-23: Slide Position can be set to full', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.selectSlidePosition('full');
    await sidepanel.integrationDetailPage.expectSlidePositionSelected('full');
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-24: Default Open toggle can be enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkDefaultOpen();
    await sidepanel.integrationDetailPage.expectDefaultOpenChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-25: Default Open toggle can be disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckDefaultOpen();
    await sidepanel.integrationDetailPage.expectDefaultOpenUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-26: Hide Full Screen toggle can be enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkHideFullScreenButton();
    await sidepanel.integrationDetailPage.expectHideFullScreenButtonChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-27: Hide Full Screen toggle can be disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckHideFullScreenButton();
    await sidepanel.integrationDetailPage.expectHideFullScreenButtonUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-28: Hide Close Button toggle can be enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkHideCloseButton();
    await sidepanel.integrationDetailPage.expectHideCloseButtonChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-29: Hide Close Button toggle can be disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckHideCloseButton();
    await sidepanel.integrationDetailPage.expectHideCloseButtonUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-30: Hide Header toggle can be enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkHideHeader();
    await sidepanel.integrationDetailPage.expectHideHeaderChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-31: Hide Header toggle can be disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckHideHeader();
    await sidepanel.integrationDetailPage.expectHideHeaderUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
  });

  test('TC-EMBED-CONFIG-32: Add Default ApiKeys toggle can be enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkAddDefaultApiKeys();
    await sidepanel.integrationDetailPage.expectAddDefaultApiKeysChecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
    await sidepanel.integrationDetailPage.expectApiKeysInputVisible();
  });

  test('TC-EMBED-CONFIG-33: Add Default ApiKeys toggle can be disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckAddDefaultApiKeys();
    await sidepanel.integrationDetailPage.expectAddDefaultApiKeysUnchecked();
    await sidepanel.integrationDetailPage.clickSaveConfig();
    await sidepanel.integrationDetailPage.expectApiKeysInputNotVisible();
  });

  test('TC-EMBED-CONFIG-34: Embed renders with dark theme when Theme Mode is set to dark', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.selectThemeMode('dark');
    await sidepanel.integrationDetailPage.expectThemeModeSelected('dark');
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedThemeMode('dark');
  });

  test('TC-EMBED-CONFIG-35: Embed renders with light theme when Theme Mode is set to light', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.selectThemeMode('light');
    await sidepanel.integrationDetailPage.expectThemeModeSelected('light');
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.expectEmbedThemeMode('light');
  });

  test('TC-EMBED-CONFIG-36: Custom prompt template is visible when default prompt is disabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.uncheckUseDefaultPrompt();
    await sidepanel.integrationDetailPage.expectCustomPromptTemplateVisible();
  });

  test('TC-EMBED-CONFIG-37: Custom prompt template is hidden when default prompt is enabled', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.checkUseDefaultPrompt();
    await sidepanel.integrationDetailPage.expectCustomPromptTemplateNotVisible();
  });

  test('TC-EMBED-CONFIG-38: Clicking Add button in Tools Configuration opens dropdown', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.clickToolsAddButton();
    await sidepanel.integrationDetailPage.expectToolsDropdownVisible();
  });

  test('TC-EMBED-CONFIG-39: Back button in Configuration navigates back to main view', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.expectConfigBackButtonVisible();
    await sidepanel.integrationDetailPage.clickConfigBackButton();
    await sidepanel.integrationDetailPage.expectMainNavVisible();
  });

});
