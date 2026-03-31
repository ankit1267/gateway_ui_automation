import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;
const TESTING_AGENT = process.env.TESTING_AGENT!;

test.describe('Agent Table - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-TABLE-01: Page header is visible on agent table page', async ({ agents }) => {
    await agents.expectPageHeaderVisible();
  });

  test('TC-TABLE-02: Agent table is visible with rows', async ({ agents }) => {
    await agents.expectTableVisible();
    await agents.expectTableViewVisible();
  });

  test('TC-TABLE-03: Create New Agent button is visible', async ({ agents }) => {
    await agents.expectCreateAgentButtonVisible();
  });

  test('TC-TABLE-04: Search input is visible', async ({ agents }) => {
    await agents.expectSearchInputVisible();
  });

  test('TC-TABLE-05: Usage Filter button is visible', async ({ agents }) => {
    await agents.expectUsageFilterButtonVisible();
  });

  test('TC-TABLE-06: All table column headers are visible', async ({ agents }) => {
    await agents.expectColumnHeaderVisible('name');
    await agents.expectColumnHeaderVisible('promptDetails');
    await agents.expectColumnHeaderVisible('cost');
    await agents.expectColumnHeaderVisible('totalTokens');
    await agents.expectColumnHeaderVisible('agent_limit');
    await agents.expectColumnHeaderVisible('last_used');
    await agents.expectColumnHeaderVisible('created_by');
    await agents.expectColumnHeaderVisible('updated_by');
  });

  test('TC-TABLE-07: Known agent is visible in the table', async ({ agents }) => {
    await agents.assertAgentVisible(AGENT_NAME);
  });

  test('TC-TABLE-08: Command palette opens via Ctrl+K and shows search input', async ({ agents }) => {
    await agents.commandPalette.open();
    await agents.commandPalette.waitForVisible();
  });

  test('TC-TABLE-09: Command palette search finds agent by name', async ({ agents }) => {
    await agents.commandPalette.open();
    await agents.commandPalette.search(AGENT_NAME);
    await agents.commandPalette.expectNoResultsNotVisible();
  });

  test('TC-TABLE-10: Command palette shows no results for non-existent agent', async ({ agents }) => {
    await agents.commandPalette.open();
    await agents.commandPalette.search('zzz_nonexistent_agent_xyz_12345');
    await agents.commandPalette.expectNoResultsVisible();
  });

  test('TC-TABLE-11: Clicking agent row opens agent detail page', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agents.expectAgentTableUrl();
  });

  test('TC-TABLE-12: Clicking Create New Agent button opens create agent modal', async ({ agents }) => {
    await agents.clickCreateNewAgent();
    await expect(agents.createAgentModal.submitButton).toBeVisible();
  });

  test('TC-TABLE-13: Sorting by name column changes table order', async ({ agents }) => {
    const nameBefore = await agents.getFirstAgentName();
    await agents.clickSortByColumn('name');
    const nameAfter = await agents.getFirstAgentName();
    expect(nameBefore).not.toBe(nameAfter);
  });

  test('TC-TABLE-14: Sorting by cost column is clickable and table stays visible', async ({ agents }) => {
    await agents.clickSortByColumn('cost');
    await agents.expectTableViewVisible();
    await agents.clickSortByColumn('cost');
    await agents.expectTableViewVisible();
  });

  test('TC-TABLE-15: Agent row shows History button on hover', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);
    await agents.clickHistoryButton(TESTING_AGENT);
    await agents.expectHistoryPageUrl();
  });

  test('TC-TABLE-16: More options menu opens on agent row', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);
    await agents.openAgentMenuByName(TESTING_AGENT);
  });

});
