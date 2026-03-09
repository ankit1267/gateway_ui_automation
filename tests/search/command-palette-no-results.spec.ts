import { test, expect } from '../../fixtures/base.fixture';

test.describe('Command Palette - No Results on API Page', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-SEARCH-03: Search by non-existent agent name, ID and version ID shows No results', async ({ agents }) => {
    await agents.commandPalette.open();
    //by agent name
    await agents.commandPalette.search('untitled_agent_8');
    await agents.commandPalette.expectNoResultsVisible();
    
    //by agent id
    await agents.commandPalette.search('6985c5b61d29a9a22321a786');
    await agents.commandPalette.expectNoResultsVisible();
    
    //by version id
    await agents.commandPalette.search('6985c5b71d29a9a22321a788');
    await agents.commandPalette.expectNoResultsVisible();
    await agents.commandPalette.close();
  });
});
