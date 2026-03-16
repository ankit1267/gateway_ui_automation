import { test } from '../../fixtures/base.fixture';

const AGENT_ID = process.env.AGENT_ID!;

test('history advance filter controls are visible', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgentById(AGENT_ID);

  await agent.header.openHistory();
  await agent.history.expectAdvanceFilterControlsVisible();
});
