import process from 'process';
import { test, expect } from '../../fixtures/base.fixture';

const SEARCH_QUERY='DeleteAgent';
const AGENT_ID = process.env.DELETE_AGENT_ID!;


test('TC-SEARCH-01: Search for an agent by name using the command palette', async ({ agents }) => {
  await agents.goto();

  await agents.commandPalette.open();
  await agents.commandPalette.search(SEARCH_QUERY);

  await expect(agents.commandPalette.getResult('agents', AGENT_ID)).toBeVisible();

  await agents.commandPalette.close();
});

