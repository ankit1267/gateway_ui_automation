import { test } from '../../../fixtures/base.fixture';
import { openAgentAndAssertApi } from '../../../utils/agent-api';

const AGENT_NAME = process.env.AGENT_NAME!;

test('ViaSocket embed is visible when adding a tool',
  async ({
    agents, page,
  }) => {

    await agents.goto('api');

    const agent = await openAgentAndAssertApi(agents, page, AGENT_NAME);

    await agent.tabs.openConnectors();

    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.clickAddNewTools();
    await agent.connectors.toolDropdown.expectViaSocketVisible();
  }
);