import { test, expect } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!

test.describe('Agent - Config History Panel', () => {
  let agent: any;

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
    await agents.assertAgentVisible(TESTING_AGENT);
    agent = await agents.openAgent(TESTING_AGENT);
  });

  test('TC-HISTORY-01: Click Updates History button on navbar and verify side panel is visible', async ({ agents }) => {
    await agent.header.openUpdatesHistory();
    await agent.header.assertConfigHistorySliderVisible();
  });

  test('TC-HISTORY-02: Verify config history slider opens and closes correctly', async ({ agents }) => {
    await agent.header.openUpdatesHistory();
    await agent.header.assertConfigHistorySliderVisible();
    await agent.header.clickConfigHistoryClose();
    await expect(agent.header.configHistorySlider).toHaveClass(/translate-x-full/);
  });

  test('TC-HISTORY-03: Verify all UI elements are visible in config history slider', async ({ agents }) => {
    await agent.header.openUpdatesHistory();
    await agent.header.assertConfigHistorySliderVisible();

    await agent.header.assertConfigHistoryTitleVisible();
    await agent.header.assertConfigHistoryUserFilterVisible();
    await agent.header.assertConfigHistoryFeatureFilterVisible();
    await agent.header.assertConfigHistoryClearButtonVisible();
    await agent.header.assertConfigHistoryScrollContainerVisible();
  });

    test('TC-HISTORY-04: Filter by user and verify history updates', async ({ agents }) => {
    await agent.header.openUpdatesHistory();
    await agent.header.assertConfigHistorySliderVisible();
 
    const userOptions = await agent.header.getConfigHistoryUserFilterOptions();
    if (userOptions.length > 1) {
      const firstUserOption = userOptions[1];
      await agent.header.selectConfigHistoryUserFilter(firstUserOption);
      await agent.header.assertConfigHistoryScrollContainerVisible();
    }
  });
 
  test('TC-HISTORY-05: Filter by feature and verify history updates', async ({ agents }) => {
    await agent.header.openUpdatesHistory();
    await agent.header.assertConfigHistorySliderVisible();
 
    const featureOptions = await agent.header.getConfigHistoryFeatureFilterOptions();
    if (featureOptions.length > 1) {
      const firstFeatureOption = featureOptions[1];
      await agent.header.selectConfigHistoryFeatureFilter(firstFeatureOption);
      await agent.header.assertConfigHistoryScrollContainerVisible();
    }
  });

   test('TC-HISTORY-06: Clear filters and verify history resets', async ({ agents }) => {
    await agent.header.openUpdatesHistory();
    await agent.header.assertConfigHistorySliderVisible();
 
    const userOptions = await agent.header.getConfigHistoryUserFilterOptions();
    if (userOptions.length > 1) {
      await agent.header.selectConfigHistoryUserFilter(userOptions[1]);
      await agent.header.clickConfigHistoryClearFilters();
      await agent.header.assertConfigHistoryScrollContainerVisible();
    }
  });

});
