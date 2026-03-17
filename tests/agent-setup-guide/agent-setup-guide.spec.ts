import { test, expect } from "../../fixtures/base.fixture";

const AGENT_NAME = process.env.TESTING_AGENT!
//dependent on css class if css class change it will break

test('Fill Prompt and api configured should not show agent guide', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.prompt.fillPrompt(
    `Support agent${Date.now()}`,
    `Help users${Date.now()}`,
    `Be polite${Date.now()}`
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

test('Agent setup card updates dynamically when prompt entered', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.prompt.fillPrompt(
    '',
    '',
    ''
  );

  await agent.prompt.expectStepState(1, 'incomplete');

  await agent.prompt.fillPrompt(
    `Support agent${Date.now()}`,
    `Help users${Date.now()}`,
    `Be polite${Date.now()}`
  );

  await agent.prompt.expectStepState(1, 'completed');
});


test('Prompt Empty and switch tab should results in setup card remain same', async ({ agents }) => {
  

  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

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



test('Fill Prompt and api not configured should show agent guide', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.prompt.fillPrompt(
    `Support agent${Date.now()}`,
    `Help users${Date.now()}`,
    `Be polite${Date.now()}`
  );

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Openai");
  await agent.prompt.expectAgentSetupGuideVisible();
  await agent.prompt.expectStepState(1, 'completed');
  await agent.prompt.expectStepState(2, 'incomplete'); 

});


test('Only fill role and goal should results in setup card remain same', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.prompt.fillPrompt(
    `Support agent${Date.now()}`,
    `Help users${Date.now()}`,
    ''
  );
  await agent.prompt.expectStepState(1, 'incomplete');
  await agent.tabs.openConnectors();
  await agent.prompt.expectStepState(1, 'incomplete');
});