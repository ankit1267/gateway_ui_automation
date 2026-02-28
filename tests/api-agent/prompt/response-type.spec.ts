import { test } from '../../../fixtures/base.fixture';

test('change response type options', async ({ agents }) => {

  await agents.goto('api');

  const agent = await agents.openAgent(process.env.AGENT_NAME!);

  await agent.prompt.selectResponseType('default');
  await agent.prompt.selectResponseType('text');
  await agent.prompt.selectResponseType('json_object');
  await agent.prompt.selectResponseType('json_schema');
  await agent.prompt.selectResponseType('widget');

});