import { test, expect } from '../../../fixtures/base.fixture';
import { queryChatbot } from '../../../utils/chatbot';

const AGENT_NAME = 'Advanced parametere testing';

test('TC-ADVANCED-PARAMS-01: Set random advanced parameters for Gemini 2.5 Pro and query chatbot', async ({ agents, page }) => {
  await agents.goto('chatbot');
  const agent = await agents.openAgent(AGENT_NAME);
  const chatbot = agent.chatbot;

  await agent.tabs.openModel();

  // Select Gemini as service provider
  await agent.model.selectServiceProvider('Gemini');

  // Select Gemini 2.5 Pro model
  await agent.model.selectModel('gemini-2.5-pro');

  // Wait for parameters to load
  await page.waitForTimeout(2000);

  // Set random values for available advanced parameters
  // Temperature (creativity_level) - random value between 0 and 1
  const randomTemperature = (Math.random() * 1).toFixed(2);
  await agent.model.setSliderValue('creativity_level', parseFloat(randomTemperature));

  // Max tokens - random value between 100 and 8000
  const randomMaxTokens = Math.floor(Math.random() * 7900) + 100;
  await agent.model.setSliderValue('max_tokens', randomMaxTokens);

  // Top P (probability_cutoff) - random value between 0 and 1
  const randomTopP = (Math.random() * 1).toFixed(2);
  await agent.model.setSliderValue('probability_cutoff', parseFloat(randomTopP));

  await agent.model.clickOutsideToSave();

  await queryChatbot(chatbot, page, {
    message: 'what is 1+1',
    expectedResponse: /2|two/i,
  });
});

test('TC-OPENAI-ADVANCED-PARAMS-01: Set random advanced parameters for OpenAI with tool choice, parallel tool calls, reasoning, and stream', async ({ agents, page }) => {
  await agents.goto('chatbot');
  const agent = await agents.openAgent(AGENT_NAME);
  const chatbot = agent.chatbot;

  await agent.tabs.openModel();

  // Select OpenAI as service provider
  await agent.model.selectServiceProvider('Openai');


  // Wait for parameters to load
  await page.waitForTimeout(2000);


  // Max tokens - random value between 100 and 8000
  const randomMaxTokens = Math.floor(Math.random() * 7900) + 100;
  await agent.model.setSliderValue('max_tokens', randomMaxTokens);

  // Set tool choice to auto
  await agent.model.clickAdvancedParameterDropdown('tool_choice');
  await page.waitForTimeout(500);
  await expect(page.getByTestId('advanced-param-dropdown-menu-tool_choice')).toBeVisible();
  await agent.model.selectToolChoiceOption('auto');
  await page.waitForTimeout(1000);

  // Enable parallel tool calls
  await agent.model.toggleParallelToolChoice(true);
  await page.waitForTimeout(1000);

  // Enable reasoning for Reasoning Model 
  // await agent.model.selectReasoningOption('high');
  // await page.waitForTimeout(1000);

  // Enable stream
  await agent.model.toggleStream(true);
  await page.waitForTimeout(1000);

  await agent.model.clickOutsideToSave();

  await queryChatbot(chatbot, page, {
    message: 'what is 1+1',
    expectedResponse: /2|two/i,
  });
});
