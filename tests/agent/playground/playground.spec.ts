import { test, expect } from "../../../fixtures/base.fixture";

const AGENT_NAME = "IntelligentAssistant_1";

test('Testcases playground slider', async ({ agents }) => {
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

test('add new testcase from playground', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.tabs.openModel();
  await agent.model.selectServiceProvider("Openai");
  // await agent.model.clickConfigureApiKey();
  // await agent.model.selectApiKey("Mistral api key");
  
  await agent.playground.typeMessage('hi');
  await agent.playground.expectChatControlsVisible();

  await agent.playground.clickAddNewPlayground();
});

test('Playground send message verifies prompt fields in request body', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent('agent-test-configurator');

  const promptData = {
    role: 'Test Role Content',
    goal: 'Test Goal Content',
    instruction: 'Test Instruction Content'
  };
  const promptData1 = {
    role: 'Test Role Content1',
    goal: 'Test Goal Content1',
    instruction: 'Test Instruction Content1'
  };
  
  // Fill and save prompt fields
  await agent.tabs.openPrompt();
  await agent.prompt.fillPrompt(promptData.role, promptData.goal, promptData.instruction);
  await agent.prompt.clickSaveButton();
  await agent.waitForTimeout(5000);
  await agent.prompt.fillPrompt(promptData1.role, promptData1.goal, promptData1.instruction);
   const { requestBody } = await agent.prompt.clickSaveButtonAndReturnRequestBody();

  // Verify the request body contains the same prompt values as filled
  expect(requestBody).toHaveProperty('configuration');
  expect(requestBody.configuration).toHaveProperty('prompt');
  expect(requestBody.configuration.prompt.role).toBe(promptData1.role);
  expect(requestBody.configuration.prompt.goal).toBe(promptData1.goal);
  expect(requestBody.configuration.prompt.instruction).toBe(promptData1.instruction);
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