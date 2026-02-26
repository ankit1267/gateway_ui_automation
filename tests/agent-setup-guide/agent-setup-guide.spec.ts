import { test, expect } from "../../fixtures/base.fixture";

//dependent on css class if css class change it will break
test('Agent setup card updates dynamically when prompt entered', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(process.env.AGENT_NAME!);

  await agent.prompt.fillPrompt(
    '',
    '',
    ''
  );

  await agent.prompt.expectStepState(1, 'incomplete');

  await agent.prompt.fillPrompt(
    'Support agent',
    'Help users',
    'Be polite'
  );

  await agent.prompt.expectStepState(1, 'completed');
});


test('Prompt Empty and switch tab should results in setup card remain same', async ({ agents }) => {
  

  await agents.goto('api');
  const agent = await agents.openAgent(process.env.AGENT_NAME!);

  await agent.prompt.fillPrompt(
    '',
    '',
    ''
  );

  await agent.prompt.expectStepState(1, 'incomplete');

  await agent.tabs.openConnectors();
  await agent.prompt.expectStepState(1, 'incomplete');

  await agent.tabs.openPrompt();
  await agent.prompt.expectStepState(1, 'incomplete');

});

test('Fill Prompt and api configured should not show agent guide', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(process.env.AGENT_NAME!);

  await agent.prompt.fillPrompt(
    'Support agent',
    'Help users',
    'Be polite'
  );

  await agent.prompt.expectStepState(1, 'completed');

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Mistral");
  await agent.model.clickConfigureApiKey();
  await agent.model.selectApiKey("Mistral api key");
  await agent.prompt.expectAgentSetupGuideNotVisible();
  await agent.model.selectServiceProvider("Openai");
  await agent.prompt.expectAgentSetupGuideVisible();
});

test('Fill Prompt and api not configured should show agent guide', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(process.env.AGENT_NAME!);

  await agent.prompt.fillPrompt(
    'Support agent',
    'Help users',
    'Be polite'
  );

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Openai");
  await agent.prompt.expectAgentSetupGuideVisible();
  await agent.prompt.expectStepState(1, 'completed');
  await agent.prompt.expectStepState(2, 'incomplete'); 

});


test('Only fill role and goal should results in setup card remain same', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(process.env.AGENT_NAME!);

  await agent.prompt.fillPrompt(
    'Support agent',
    'Help users',
    ''
  );
  await agent.prompt.expectStepState(1, 'incomplete');
  await agent.tabs.openConnectors();
  await agent.prompt.expectStepState(1, 'incomplete');
});