import { test, expect } from "../../../fixtures/base.fixture";

const AGENT_NAME = "IntelligentAssistant_1";

test('Playground strategy selection', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Openai");
  // await agent.model.clickConfigureApiKey();
  // await agent.model.selectApiKey("Mistral api key");
  
  await agent.playground.typeMessageAndWaitForApi('hi');
  await agent.playground.expectChatControlsVisible();
  await agent.playground.expectChatMessageVisible(1);

  // Select cosine and verify it is sent in the next chat API request
  await agent.playground.selectStrategy('cosine');
  const { requestBody: cosineReq } = await agent.playground.typeMessageAndWaitForApi('test cosine');
  agent.playground.verifyChatStrategy(cosineReq, 'cosine');
  await agent.playground.expectChatMessageVisible(3);

  // Select ai and verify
  await agent.playground.selectStrategy('ai');
  const { requestBody: aiReq } = await agent.playground.typeMessageAndWaitForApi('test ai');
  agent.playground.verifyChatStrategy(aiReq, 'ai');
  await agent.playground.expectChatMessageVisible(5);

  // Select exact and verify
  await agent.playground.selectStrategy('exact');
  const { requestBody: exactReq } = await agent.playground.typeMessageAndWaitForApi('test exact');
  agent.playground.verifyChatStrategy(exactReq, 'exact');
  await agent.playground.expectChatMessageVisible(7);
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