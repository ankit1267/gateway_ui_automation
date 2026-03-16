import { test } from '../../../fixtures/base.fixture';

const AGENT_ID = process.env.AGENT_ID!;
const K_BASE = 'Resume';

test('Knowledgebase renders inside embed container after selection',
  async ({
    agents,
  }) => {

    await agents.goto('api');
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.tabs.openConnectors();

    await agent.connectors.clickAddKB();
    await agent.connectors.knowledgeBaseDropdown.selectKB(K_BASE);

    await agent.connectors.expectKBVisible(K_BASE);
    await agent.connectors.removeKB();
  }
);