import { test } from '../../../fixtures/base.fixture';

test('manage variables from instructions', async ({ agents }) => {

  await agents.goto('api');

  const agent = await agents.openAgent(process.env.AGENT_NAME!);

  await agent.prompt.openInstructionsSection();

  await agent.prompt.openVariableManager();

  await agent.prompt.expectVariableSliderVisible();

  await agent.prompt.fillInstructions(
    'Always respond clearly and professionally {{variable_key_0}}'
  );
  
  await agent.prompt.openVariableManager();

  await agent.prompt.expectVariableKeyInputVisible(0);

  await agent.prompt.openInstructionsSection();

  await agent.prompt.fillInstructions(
    'Always respond clearly and professionally'
  );

  await agent.prompt.openVariableManager();

  await agent.prompt.deleteVariable(0);

});