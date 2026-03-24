import { test } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;
const K_BASE = 'Resume';

test.afterEach(async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openConnectors();
  await agent.connectors.removeKBIfExists();
});

test('Knowledgebase renders inside embed container after selection',
  async ({
    agents,
  }) => {

    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openConnectors();

    await agent.connectors.clickAddKB();
    await agent.connectors.knowledgeBaseDropdown.selectKB(K_BASE);

    await agent.connectors.expectKBVisible(K_BASE);
  }
);