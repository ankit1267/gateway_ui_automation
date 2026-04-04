import process from 'process';
import { test, expect } from '../../fixtures/base.fixture';

const SEARCH_QUERY='SearchDeleteAgent';
const AGENT_ID = process.env.DELETE_AGENT_ID!;
const TESTING_AGENT = 'SearchDeleteAgent';

test('TC-SEARCH-01: Search for an agent by name using the command palette', async ({ agents }) => {
  await agents.goto();

  await agents.commandPalette.open();
  await agents.commandPalette.search(SEARCH_QUERY);

  await expect(agents.commandPalette.getResult('agents', AGENT_ID)).toBeVisible();

  await agents.commandPalette.close();
});

test('TC-SEARCH-02: Deleted agent is no longer visible in search results', async ({ agents,page }) => {
  await agents.goto('api');

  await agents.commandPalette.open();
  await agents.commandPalette.search(SEARCH_QUERY);
  await expect(agents.commandPalette.getResult('agents', AGENT_ID)).toBeVisible();
  await agents.commandPalette.close();

  await agents.deleteAgentByName(TESTING_AGENT);
  // await agents.deleteModal.waitForHidden();
  await page.waitForTimeout(3000)
  await agents.commandPalette.open();
  await agents.commandPalette.search(SEARCH_QUERY);
  
  await expect(agents.commandPalette.getResult('agents', AGENT_ID)).not.toBeVisible();
  await agents.commandPalette.close();

  await agents.undoDeleteAgentByName(TESTING_AGENT);
  await page.waitForTimeout(3000)
});
