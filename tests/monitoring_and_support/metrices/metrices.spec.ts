import { test } from '../../../fixtures/base.fixture';

test.describe.serial('Metrics - Monitoring & Support', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoMetrics();
  });

  test('TC-MTR-01: Metrics filters and dashboard validation', async ({ sidepanel }) => {

    // -------- Dashboard loads --------
    await sidepanel.metricsPage.assertDashboardVisible();

    // -------- Group By filter --------
    await sidepanel.metricsPage.openGroupByDropdown();
    await sidepanel.metricsPage.assertGroupByDropdownVisible();
    await sidepanel.metricsPage.openGroupByDropdown();

    // -------- Agent filter --------
    await sidepanel.metricsPage.selectAllAgents();

    // -------- Time range filter - 30 days (index 8) --------
    await sidepanel.metricsPage.selectTimeRange(8);

    // -------- Chart rendered --------
    await sidepanel.metricsPage.assertChartVisible();
  });

});
