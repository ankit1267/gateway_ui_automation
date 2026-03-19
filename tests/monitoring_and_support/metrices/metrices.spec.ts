import { test } from '../../../fixtures/base.fixture';

test.describe('Metrics - Monitoring & Support', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoMetrics();
  });

  test('TC-MTR-01: Metrics filters and dashboard validation', async ({ metrics }) => {

    // -------- Dashboard loads --------
    await metrics.assertDashboardVisible();

    // -------- Group By filter --------
    await metrics.openGroupByDropdown();
    await metrics.assertGroupByDropdownVisible();
    await metrics.openGroupByDropdown();

    // -------- Agent filter --------
    await metrics.selectAllAgents();

    // -------- Time range filter - 30 days (index 8) --------
    await metrics.selectTimeRange(8);

    // -------- Chart rendered --------
    await metrics.assertChartVisible();
  });

});
