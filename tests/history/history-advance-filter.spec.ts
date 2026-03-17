import { test } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test('history advance filter controls are visible', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.header.openHistory();
  await agent.history.expectAdvanceFilterControlsVisible();
});
