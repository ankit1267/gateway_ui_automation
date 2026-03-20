import { test, expect } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;
const TEST_EMAIL = 'tilakraj.ranawat09@gmail.com';

test.describe('Agent - Manage Access', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-ACCESS-01: Open Manage Access dialog from agent More Options menu, search user by email, verify results are visible, and select user', async ({ agents }) => {
    // Verify the agent is visible in the list
    await agents.assertAgentVisible(TESTING_AGENT);

    // Click the More Options (ellipsis) button on the agent row
    // and select "Manage Access" from the dropdown menu
    await agents.openManageAccessForAgent(TESTING_AGENT);

    // Wait for the Access Management dialog to open
    await agents.accessManagementModal.waitForVisible();

    // Type the email address in the search input
    await agents.accessManagementModal.fillEmail(TEST_EMAIL);

    // Wait for search results to appear (modal triggers a debounced API search)
    await agents.accessManagementModal.waitForSearchResults();

    // Verify the search results container is visible
    await expect(agents.accessManagementModal.getSearchResults()).toBeVisible();

    // Select the first user from the search results list
    await agents.accessManagementModal.selectFirstUser();

    // Close the dialog
    await agents.accessManagementModal.clickClose();
  });

  test('TC-ACCESS-02: Open Usage & Limits popover from agent More Options, change limit, verify Update button is visible', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);

    await agents.openUsageLimitsForAgent(TESTING_AGENT);

    await agents.usageSummaryPopover.waitForVisible();

    await agents.usageSummaryPopover.fillLimit('10');

    await agents.usageSummaryPopover.expectUpdateButtonVisible();
    await agents.usageSummaryPopover.expectUpdateButtonEnabled();
  });

});
