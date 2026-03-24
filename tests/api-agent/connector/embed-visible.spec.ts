import { test } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test('ViaSocket embed is visible when adding a tool',
  async ({
    agents,
  }) => {

    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openConnectors();

    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.clickAddNewTools();
    await agent.connectors.toolDropdown.expectViaSocketVisible();
  }
);