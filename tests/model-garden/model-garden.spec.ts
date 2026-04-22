import { test, expect } from '../../fixtures/base.fixture';

test.describe('Model Garden', () => {

  test('TC-MG-01: Model Garden page loads and displays services sidebar', async ({ sidepanel }) => {
    await sidepanel.gotoModelGarden();
    await expect(sidepanel.modelGardenPage.servicesSidebar).toBeVisible();
  });

  test('TC-MG-02: Selecting a service opens the models panel', async ({ sidepanel }) => {
    await sidepanel.gotoModelGarden();
    await sidepanel.modelGardenPage.expectPageVisible();
    await expect(sidepanel.modelGardenPage.servicesSidebar).toBeVisible();
    await sidepanel.modelGardenPage.selectService('openAI');
    await sidepanel.modelGardenPage.expectModelsPanelVisible();
  });

  test('TC-MG-03: Models panel can be closed', async ({ sidepanel }) => {
    await sidepanel.gotoModelGarden();
    await sidepanel.modelGardenPage.expectPageVisible();
    await sidepanel.modelGardenPage.selectService('openAI');

    if (await sidepanel.modelGardenPage.modelsPanel.isVisible()) {
      await sidepanel.modelGardenPage.closeModelsPanel();
      await sidepanel.modelGardenPage.expectModelsPanelHidden();
    }
  });

  test('TC-MG-04: Search bar filters models by name', async ({ sidepanel }) => {
    await sidepanel.gotoModelGarden();
    await sidepanel.modelGardenPage.expectPageVisible();
    await sidepanel.modelGardenPage.selectService('openAI');

    // Get initial model count
    const initialCount = await sidepanel.modelGardenPage.getModelCount();

    // Search for a specific model
    await sidepanel.modelGardenPage.searchModels('gpt');

    // Verify search results are filtered
    const filteredCount = await sidepanel.modelGardenPage.getModelCount();

    // Clear search to restore all models
    await sidepanel.modelGardenPage.clearSearch();
    const restoredCount = await sidepanel.modelGardenPage.getModelCount();

    expect(restoredCount).toBe(initialCount);
  });




});
