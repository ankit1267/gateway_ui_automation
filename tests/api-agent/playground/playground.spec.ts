import { test, expect } from "../../../fixtures/base.fixture";

const AGENT_ID = process.env.AGENT_ID!;

test('Playground strategy selection', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgentById(AGENT_ID);

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Mistral");
  await agent.model.clickConfigureApiKey();
  await agent.model.selectApiKey("Mistral api key");
  

  await agent.playground.typeMessage('hi');
  await agent.playground.expectChatControlsVisible();

  await agent.playground.selectStrategy('cosine');
  await agent.playground.selectStrategy('ai');
  await agent.playground.selectStrategy('exact');
});


test('Playground add new test case click open new playground', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgentById(AGENT_ID);

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Mistral");
  await agent.model.clickConfigureApiKey();
  await agent.model.selectApiKey("Mistral api key");
  

  await agent.playground.typeMessage('hi');
  await agent.playground.expectChatControlsVisible();

  await agent.playground.selectStrategy('cosine');
  await agent.playground.selectStrategy('ai');
  await agent.playground.selectStrategy('exact');

  await agent.playground.clickAddNewTestCase();
  await agent.playground.expectChatControlsNotVisible();
});

test('Playground send message and verify response', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgentById(AGENT_ID);

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Mistral");
  await agent.model.clickConfigureApiKey();
  await agent.model.selectApiKey("Mistral api key");
  

  await agent.playground.typeMessage('hi');
  await agent.playground.expectChatMessageVisible(1);
  
});