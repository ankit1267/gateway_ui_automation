import { test } from '../../fixtures/base.fixture';

const RECURSIVE_AGENT_NAME = 'Knowledge Base Recursive';
const AGENTIC_AGENT_NAME = 'Knowledge Base Agentic';
const SEMANTIC_AGENT_NAME = 'Knowledge Base Semantic';

test('TC-rec-01: Query recursive knowledge base chatbot and verify tool call in response', async ({ agents, page }) => {
  await agents.goto('chatbot');

  const agent = await agents.openAgent(RECURSIVE_AGENT_NAME);
  await page.waitForTimeout(4000);
  await agent.chatbot.openNewThread();
  await agent.chatbot.isHomeVisible();

  await page.waitForTimeout(3000);

  await agent.chatbot.sendMessage('new healthcare technologies');
  await agent.chatbot.waitForResponseComplete(120000);

  await agent.chatbot.expectResponse(/get_knowledge_base_data/i);
});


test('TC-age-01: Query agentic knowledge base chatbot and verify tool call in response', async ({ agents, page }) => {
  await agents.goto('chatbot');

  const agent = await agents.openAgent(AGENTIC_AGENT_NAME);
  await page.waitForTimeout(4000);
  await agent.chatbot.openNewThread();
  await agent.chatbot.isHomeVisible();

  await page.waitForTimeout(3000);

  await agent.chatbot.sendMessage('tell me about new ai technologies');
  await agent.chatbot.waitForResponseComplete(120000);

  await agent.chatbot.expectResponse(/get_knowledge_base_data/i);
});

test('TC-sem-01: Query semantic knowledge base chatbot and verify tool call in response', async ({ agents, page }) => {
  await agents.goto('chatbot');

  const agent = await agents.openAgent(SEMANTIC_AGENT_NAME);

  await page.waitForTimeout(4000);
  await agent.chatbot.openNewThread();
  await agent.chatbot.isHomeVisible();

  await page.waitForTimeout(3000);

  await agent.chatbot.sendMessage('tell me about new computing technologies');
  await agent.chatbot.waitForResponseComplete(120000);

  await agent.chatbot.expectResponse(/get_knowledge_base_data/i);
});
