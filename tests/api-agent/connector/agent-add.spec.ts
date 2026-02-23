import { test } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;
const A2A_AGENT = process.env.AGENT_NAME!;

test('Agent renders inside embed container after selection', async ({
  agents,
}) => {
  await agents.goto('api');
  const agent = await agents.openAgent(TESTING_AGENT);
  await agent.tabs.openConnectors();

  await agent.connectors.clickAddAgent();
  await agent.connectors.a2aDropdown.selectAgent(A2A_AGENT);

  await agent.connectors.expectAgentVisible(A2A_AGENT);
  await agent.connectors.removeAgent();
});