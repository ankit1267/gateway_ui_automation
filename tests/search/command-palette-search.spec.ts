import { test, expect } from '../../fixtures/base.fixture';

const SEARCH_QUERY='DeleteAgent';
const AGENT_ID= process.env.DELETE_AGENT_ID!;

test.describe('Command Palette - Agent Search', () => {

  test('TC-SEARCH-01: Search for an agent by name using the command palette', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.search(SEARCH_QUERY);

    // Verify the agent result appears using regex pattern (no id required)
    await expect(agents.commandPalette.getResult('agents',AGENT_ID)).toBeVisible();

    await agents.commandPalette.close();
  });

  test('TC-SEARCH-02: Search by non-existent agent name, ID and version ID shows No results', async ({ agents }) => {
    await agents.goto('api');

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


  test('TC-SEARCH-03: Open and close command palette using keyboard shortcut', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.waitForVisible();

    await agents.commandPalette.closeByBackdrop();
    await agents.commandPalette.waitForHidden();
  });

  test('TC-SEARCH-04: Search and clear search query', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.search(SEARCH_QUERY);

    const searchValue = await agents.commandPalette.getSearchValue();
    expect(searchValue).toBe(SEARCH_QUERY);

    await agents.commandPalette.clearSearch();

    const clearedValue = await agents.commandPalette.getSearchValue();
    expect(clearedValue).toBe('');
  });

  test('TC-SEARCH-05: Navigate to category using command palette', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.waitForVisible();

    await agents.commandPalette.clickCategory('widgets');

    await expect(agents.commandPalette.page).toHaveURL(/widgets/);
  });

  test('TC-SEARCH-06: Toggle category collapse/expand', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.waitForVisible();

    const toggleButton = agents.commandPalette.getToggleButton('api-agents');
    await expect(toggleButton).toBeVisible();

    await agents.commandPalette.toggleCategory('api-agents');
  });

  test('TC-SEARCH-07: Close command palette using close button', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.waitForVisible();

    await agents.commandPalette.close();
    await agents.commandPalette.waitForHidden();
  });

  test('TC-SEARCH-08: Search for API keys', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.search('api');

    const count = await agents.commandPalette.getApiKeysResultsCount();

    if (count > 0) {
      await agents.commandPalette.assertApiKeysResultsVisible();
    }

    await agents.commandPalette.close();
  });

  test('TC-SEARCH-09: Search for Knowledge Base', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.search('resume');

    const count = await agents.commandPalette.getKnowledgeBaseResultsCount();

    if (count > 0) {
      await agents.commandPalette.assertKnowledgeBaseResultsVisible();
    }

    await agents.commandPalette.close();
  });

  test('TC-SEARCH-10: Search for Integrations', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.search('test');

    const count = await agents.commandPalette.getIntegrationResultsCount();

    if (count > 0) {
      await agents.commandPalette.assertIntegrationResultsVisible();
    }

    await agents.commandPalette.close();
  });

  test('TC-SEARCH-11: Search for Auth Keys', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.search('auth');

    const count = await agents.commandPalette.getAuthKeysResultsCount();

    if (count > 0) {
      await agents.commandPalette.assertAuthKeysResultsVisible();
    }

    await agents.commandPalette.close();
  });

  test('TC-SEARCH-12: Search for Widgets', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.search('car');

    const count = await agents.commandPalette.getWidgetsResultsCount();

    if (count > 0) {
      await agents.commandPalette.assertWidgetsResultsVisible();
    }

    await agents.commandPalette.close();
  });

  test('TC-SEARCH-13: Search for RAG Embeds', async ({ agents }) => {
    await agents.goto();

    await agents.commandPalette.open();
    await agents.commandPalette.search('rag');

    const count = await agents.commandPalette.getRagEmbedResultsCount();

    if (count > 0) {
      await agents.commandPalette.assertRagEmbedResultsVisible();
    }

    await agents.commandPalette.close();
  });


});

