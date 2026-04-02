import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = 'Tool Choice';


test('TC-TOOL-CHOICE-01: Select specific tool function and verify playground response', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.tabs.openModel();

  await agent.playground.selectToolChoiceFunction('secure_math_function');
  await agent.playground.expectToolChoiceSelected(/secure_math_function/i);

  await agent.playground.typeMessage('secureMath(5)');

  await expect(agent.playground.chatMessagesContainer).toContainText('-0.744221', { timeout: 60000 });
});

test('TC-TOOL-CHOICE-02: Select Tool choice B - computeSecure returns result and signature', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);

  await agent.tabs.openModel();

  await agent.playground.selectToolChoiceAgent('Tool choice B');
  await agent.playground.expectToolChoiceSelected(/Tool choice B/i);

  await agent.playground.typeMessage('computeSecure(5)');

  await expect(agent.playground.chatMessagesContainer).toContainText('efbf8d713875e44946b003dca314d0639ffb92bc1c0b1e1446d3832668423633', { timeout: 60000 });
});
