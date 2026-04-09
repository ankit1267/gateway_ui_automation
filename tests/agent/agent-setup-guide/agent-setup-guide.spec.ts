import { test } from "../../../fixtures/base.fixture";
import { fillPromptAndVerifyApi, fillAllPromptFieldsAndVerifyApi } from '../../../utils/fill-prompt-api';

const AGENT_NAME = process.env.TESTING_AGENT!
//dependent on css class if css class change it will break

test('Fill Prompt and api configured should not show agent guide', async ({ agents, page }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openModel();
  const changed = await agent.model.selectServiceProviderIfNeeded("Grok");
  if (changed) {
    await agent.header.expectSavedVisible();
  }
  await agent.prompt.expectAgentSetupGuideVisible();
  await agent.tabs.openPrompt();
  const role = `Support agent${Date.now()}`;
  const goal = `Help users${Date.now()}`;
  const instruction = `Be polite${Date.now()}`;
  await fillAllPromptFieldsAndVerifyApi(
    page,
    async () => {
      await agent.prompt.fillRole(role);
      await agent.prompt.fillGoal(goal);
      await agent.prompt.fillInstructions(instruction);
    },
    { role, goal, instruction }
  );

  await agent.prompt.expectStepState(1, 'completed');

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Mistral");
  await agent.model.clickConfigureApiKey();
  await agent.model.selectApiKey("Mistral api key");
  await agent.prompt.expectAgentSetupGuideNotVisible();
  
  
});

test('Agent setup card updates dynamically when prompt entered', async ({ agents, page }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.tabs.openModel();
  const changed = await agent.model.selectServiceProviderIfNeeded("Grok");
  if (changed) {
    await agent.header.expectSavedVisible();
  }

  await agent.prompt.expectAgentSetupGuideVisible();
  await agent.tabs.openPrompt();

  await fillPromptAndVerifyApi(
    page,
    async () => {
      await agent.prompt.fillPrompt('', '', '');
    },
    {
      role: '',
      goal: '',
      instruction: '',
    }
  );

  await agent.prompt.expectStepState(1, 'incomplete');

  const role = `Support agent${Date.now()}`;
  const goal = `Help users${Date.now()}`;
  const instruction = `Be polite${Date.now()}`;
  await fillPromptAndVerifyApi(
    page,
    async () => {
      await agent.prompt.fillPrompt(role, goal, instruction);
    },
    {
      role,
      goal,
      instruction,
    }
  );

  await agent.prompt.expectStepState(1, 'completed');
});

test('Prompt Empty and switch tab should results in setup card remain same', async ({ agents, page }) => {
  

  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await fillPromptAndVerifyApi(
    page,
    async () => {
      await agent.prompt.fillPrompt('', '', '');
    },
    {
      role: '',
      goal: '',
      instruction: '',
    }
  );

  await agent.prompt.expectStepState(1, 'incomplete');

  await agent.tabs.openConnectors();
  await agent.prompt.expectStepState(1, 'incomplete');

  await agent.tabs.openPrompt();
  await agent.prompt.expectStepState(1, 'incomplete');

});

test('Fill Prompt and api not configured should show agent guide', async ({ agents, page }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  const role = `Support agent${Date.now()}`;
  const goal = `Help users${Date.now()}`;
  const instruction = `Be polite${Date.now()}`;
  await fillPromptAndVerifyApi(
    page,
    async () => {
      await agent.prompt.fillPrompt(role, goal, instruction);
    },
    {
      role,
      goal,
      instruction,
    }
  );

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Grok");
  await agent.prompt.expectAgentSetupGuideVisible();
  await agent.prompt.expectStepState(1, 'completed');
  await agent.prompt.expectStepState(2, 'incomplete'); 

});

/*test('Only fill role and goal should results in setup card remain same', async ({ agents, page }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  const role = `Support agent${Date.now()}`;
  const goal = `Help users${Date.now()}`;
  await fillPromptAndVerifyApi(
    page,
    async () => {
      await agent.prompt.fillPrompt(role, goal, '');
    },
    {
      role,
      goal,
      instruction: '',
    }
  );

  await agent.prompt.expectStepState(1, 'incomplete');
  await agent.tabs.openConnectors();
  await agent.prompt.expectStepState(1, 'incomplete');
});*/