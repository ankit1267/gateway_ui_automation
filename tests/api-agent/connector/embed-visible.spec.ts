import { test } from '../../../fixtures/base.fixture';

const AGENT_ID = process.env.AGENT_ID!;

test('ViaSocket embed is visible when adding a tool',
  async ({
    agents,
  }) => {

    await agents.goto('api');
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.tabs.openConnectors();

    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.clickAddNewTools();
    await agent.connectors.toolDropdown.expectViaSocketVisible();
  }
);