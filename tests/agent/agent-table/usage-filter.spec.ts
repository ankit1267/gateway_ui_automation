import { test } from '../../../fixtures/base.fixture';

test.describe('Workspace - Usage Filter', () => {

  test('TC-USAGE-01: Usage filter presets, custom range, and reset work correctly', async ({ agents }) => {
    await agents.goto('api');

    // Last 1 day
    await agents.openUsageFilter();
    await agents.selectUsagePreset(1);
    await agents.closeUsageFilterDropdown();

    // Last 5 days
    await agents.openUsageFilter();
    await agents.selectUsagePreset(5);
    await agents.closeUsageFilterDropdown();

    // Last 10 days
    await agents.openUsageFilter();
    await agents.selectUsagePreset(10);
    await agents.closeUsageFilterDropdown();


    // Last 15 days
    await agents.openUsageFilter();
    await agents.selectUsagePreset(15);
    await agents.closeUsageFilterDropdown();

    // Last 30 days
    await agents.openUsageFilter();
    await agents.selectUsagePreset(30);
    await agents.closeUsageFilterDropdown();

    // Reset filter
    await agents.openUsageFilter();
    await agents.resetUsageFilter();
    await agents.closeUsageFilterDropdown();
    await agents.expectUsageFilterInactive();

    // Custom date range
    await agents.openUsageFilter();
    await agents.openCustomDateRange();
    await agents.fillCustomDateRange('2025-01-01', '2025-01-31');
    await agents.applyCustomDateRange();

    // Reset filter after custom range
    await agents.openUsageFilter();
    await agents.resetUsageFilter();
    await agents.closeUsageFilterDropdown();
    await agents.expectUsageFilterInactive();
  });

});
