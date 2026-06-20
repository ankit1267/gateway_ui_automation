import { test, expect } from "../../../fixtures/base.fixture";

const AGENT_NAME = "IntelligentAssistant_1";

test('Playground strategy selection', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Openai");
  // await agent.model.clickConfigureApiKey();
  // await agent.model.selectApiKey("Mistral api key");

  // Increase max tokens to 8192
  await agent.model.increaseMaxTokens(8192);
  await agent.playground.typeMessageAndWaitForApi('hi');
  await agent.playground.expectChatControlsVisible();
  await agent.playground.expectChatMessageVisible(1);

  // Select cosine and verify it is sent in the next chat API request
  await agent.playground.typeMessageAndWaitForApi('test cosine');
  const { requestBody: cosineReq } = await agent.playground.selectStrategy(2, 'cosine');
  agent.playground.verifyChatStrategy(cosineReq, 'cosine');
  await agent.playground.expectChatMessageVisible(3);

  // Select ai and verify
  await agent.playground.typeMessageAndWaitForApi('test ai');
  const { requestBody: aiReq } = await agent.playground.selectStrategy(4, 'ai');
  agent.playground.verifyChatStrategy(aiReq, 'ai');
  await agent.playground.expectChatMessageVisible(5);

  // Select exact and verify
  await agent.playground.typeMessageAndWaitForApi('test exact');
  const { requestBody: exactReq } = await agent.playground.selectStrategy(6, 'exact');
  agent.playground.verifyChatStrategy(exactReq, 'exact');
  await agent.playground.expectChatMessageVisible(7);
});

test('add new playground', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Openai");
  // await agent.model.clickConfigureApiKey();
  // await agent.model.selectApiKey("Mistral api key");
  
  await agent.playground.typeMessage('hi');
  await agent.playground.expectChatControlsVisible();

  await agent.playground.selectStrategy(0, 'cosine');
  await agent.playground.selectStrategy(0, 'ai');
  await agent.playground.selectStrategy(0, 'exact');

  await agent.playground.clickAddNewPlayground();
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

  await agent.playground.expectChatMessageVisible(0); 
});