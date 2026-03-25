import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;
const KB_RESULT = 'Resume';

test.describe('Connectors - KB Search - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-CON-KB-01: Search for Wikipedia in Add Knowledge Base dropdown shows result', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAddKB();
    await agent.connectors.knowledgeBaseDropdown.search(KB_RESULT);
    await agent.connectors.knowledgeBaseDropdown.expectItemVisible(KB_RESULT);
  });

  test('TC-CON-KB-02: Search with spaced query in Add Knowledge Base dropdown shows matching result', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAddKB();
    await agent.connectors.knowledgeBaseDropdown.search(KB_RESULT + '   ');//spaced text
    await agent.connectors.knowledgeBaseDropdown.expectItemVisible(KB_RESULT);
  });

});
