import { test } from '../../fixtures/base.fixture';

test.describe('GTWY Embed - Model Settings', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoIntegration();
    await sidepanel.integrationPage.waitForPage();
    await sidepanel.integrationPage.openFirstRow();
    await sidepanel.integrationDetailPage.waitForPage();
    await sidepanel.integrationDetailPage.clickConfigurationTab();
  });

  test('TC-MODEL-01: Unchecked model is not shown in agent model dropdown', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.clickModelSettingsServiceButton('grok');
    const modelName = await sidepanel.integrationDetailPage.getFirstModelNameInService();

    await sidepanel.integrationDetailPage.uncheckModelInSettings(modelName);
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.clickEmbedModelTab();
    await sidepanel.integrationDetailPage.selectEmbedService('grok');
    await sidepanel.integrationDetailPage.openEmbedModelDropdown();
    await sidepanel.integrationDetailPage.expectEmbedModelNotVisible(modelName);
  });

  test('TC-MODEL-02: Checked model is shown in agent model dropdown', async ({ sidepanel }) => {
    await sidepanel.integrationDetailPage.clickModelSettingsServiceButton('grok');
    const modelName = await sidepanel.integrationDetailPage.getFirstModelNameInService();

    await sidepanel.integrationDetailPage.checkModelInSettings(modelName);
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.clickEmbedModelTab();
    await sidepanel.integrationDetailPage.selectEmbedService('grok');
    await sidepanel.integrationDetailPage.openEmbedModelDropdown();
    await sidepanel.integrationDetailPage.expectEmbedModelVisible(modelName);
  });

  test('TC-MODEL-03: Custom Grok model display name appears in agent model dropdown', async ({ sidepanel }) => {
    const customName = 'My Custom Grok';

    await sidepanel.integrationDetailPage.clickModelSettingsServiceButton('grok');
    const modelName = await sidepanel.integrationDetailPage.getFirstModelNameInService();

    await sidepanel.integrationDetailPage.changeModelDisplayName(modelName, customName);
    await sidepanel.integrationDetailPage.clickSaveConfig();

    await sidepanel.integrationDetailPage.clickFirstAgentInPreview();
    await sidepanel.integrationDetailPage.clickEmbedModelTab();
    await sidepanel.integrationDetailPage.selectEmbedService('grok');
    await sidepanel.integrationDetailPage.openEmbedModelDropdown();
    await sidepanel.integrationDetailPage.expectEmbedModelHasDisplayName(modelName, customName);
  });

});
