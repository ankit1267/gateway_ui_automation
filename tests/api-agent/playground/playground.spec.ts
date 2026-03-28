import { test, expect } from "../../../fixtures/base.fixture";

const AGENT_NAME = process.env.AGENT_NAME!;

test('Playground strategy selection', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Openai");
  // await agent.model.clickConfigureApiKey();
  // await agent.model.selectApiKey("Mistral api key");
  

  await agent.playground.typeMessageAndWaitForApi('hi');
  await agent.playground.expectChatControlsVisible();

  // Select cosine and verify it is sent in the next chat API request
  await agent.playground.selectStrategy('cosine');
  const { requestBody: cosineReq } = await agent.playground.typeMessageAndWaitForApi('test cosine');
  agent.playground.verifyChatStrategy(cosineReq, 'cosine');

  // Select ai and verify
  await agent.playground.selectStrategy('ai');
  const { requestBody: aiReq } = await agent.playground.typeMessageAndWaitForApi('test ai');
  agent.playground.verifyChatStrategy(aiReq, 'ai');

  // Select exact and verify
  await agent.playground.selectStrategy('exact');
  const { requestBody: exactReq } = await agent.playground.typeMessageAndWaitForApi('test exact');
  agent.playground.verifyChatStrategy(exactReq, 'exact');
});

test('Playground add new test case click open new playground', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Openai");
  // await agent.model.clickConfigureApiKey();
  // await agent.model.selectApiKey("Mistral api key");
  

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
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Openai");
  // await agent.model.clickConfigureApiKey();
  // await agent.model.selectApiKey("Mistral api key");

  const { requestBody, responseBody } = await agent.playground.typeMessageAndWaitForApi('hi');
  agent.playground.verifyChatRequestBody(requestBody, 'hi');
  agent.playground.verifyChatResponseBody(responseBody);

  await agent.playground.expectChatMessageVisible(1);
});