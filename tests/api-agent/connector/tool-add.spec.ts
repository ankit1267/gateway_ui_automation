import { test } from '../../../fixtures/base.fixture';


const AGENT_ID = process.env.AGENT_ID!;
const TOOL_NAME = 'SendEmailonGmail2';

test('Tool renders inside embed container after selection',
  async ({
    agents,
  }) => {

    await agents.goto('api');
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.tabs.openConnectors();

    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.selectTool(TOOL_NAME);

    await agent.connectors.expectEmbedVisible(TOOL_NAME);
    await agent.connectors.removeTool();
  }
);