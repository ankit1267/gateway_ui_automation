import { test } from '../../fixtures/base.fixture';

test('history advance filter controls are visible', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(process.env.AGENT_NAME!);

  await agent.header.openHistory();
  await agent.history.expectAdvanceFilterControlsVisible();
});
