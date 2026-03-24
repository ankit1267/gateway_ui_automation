import { test } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test('TC-MODEL-01: Verify model list loads for Mistral', async ({ agents }) => {

  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openModel();

  await agent.model.selectServiceProvider('Mistral');

  await agent.model.expectModelsVisible([
    'mistral-medium-latest',
    'magistral-medium-latest',
    'codestral-latest',
    'mistral-small-latest',
    'magistral-small-latest',
  ]);
});

test('TC-MODEL-02: Verify model list loads for OpenAI', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openModel();

  await agent.model.selectServiceProvider('Openai');

  await agent.model.expectModelsVisible([
    'gpt-5',
    'gpt-5-nano',
    'gpt-4o-mini',
    'chatgpt-4o-latest',
    'gpt-4.1',
    'gpt-4.1-mini',
    'gpt-4.1-nano',
  ]);
});

test('TC-MODEL-03: Verify model list loads for Anthropic', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openModel();

  await agent.model.selectServiceProvider('Anthropic');

  await agent.model.expectModelsVisible([
    'claude-3-7-sonnet-latest',
  ]);
});

test('TC-MODEL-04: Verify model list loads for Groq', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openModel();

  await agent.model.selectServiceProvider('Groq');

  await agent.model.expectModelsVisible([
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
  ]);
});

test('TC-MODEL-05: Verify model list loads for Gemini', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openModel();

  await agent.model.selectServiceProvider('Gemini');

  await agent.model.expectModelsVisible([
    'gemini-2.5-pro',
    'gemini-2.5-flash-lite',
  ]);
});

test('TC-MODEL-06: Verify model list loads for Ai-ml', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openModel();

  await agent.model.selectServiceProvider('Ai_ml');

  await agent.model.expectModelsVisible([
    'gpt-oss-120b',
    'gpt-oss-20b',
  ]);
});

test('TC-MODEL-07: Verify model list loads for Grok', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openModel();

  await agent.model.selectServiceProvider('Grok');

  await agent.model.expectModelsVisible([
    'grok-4-fast',
    'grok-4-0709',
  ]);
});
