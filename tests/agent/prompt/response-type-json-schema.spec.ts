import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.CHATBOT_AGENT!;

test.describe('Prompt - Response Type (Chatbot)', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
  });

  test('TC-PROMPT-RESP-08: JSON schema response type enforces schema fields in playground response and verify in history', async ({ agents,page }) => {
    // Opens the agent, chats, then checks history: needs more than the default 2 min.
    test.slow();

    const agent = await agents.openAgent(AGENT_NAME);

    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Openai');

    await agent.tabs.openPrompt();

    const schema = JSON.stringify({
      name: 'name',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'name of person',
          },
        },
        required: ['name'],
        additionalProperties: false,
      },
      strict: true,
    });
    await agent.prompt.setJsonSchemaResponseType(schema);


    await agent.chatbot.sendMessage('hii');
    await agent.chatbot.waitForResponseComplete();
    await agent.chatbot.waitForToolCallsComplete();

    // Go to history
    await agent.header.openHistory();
    await page.waitForTimeout(2000);
    await agent.history.openFirstSidebarThread();
    await agent.history.expectThreadResponseVisible();

    // Go to AI config of recent
    await agent.history.clickLastAiConfig();

    // Check if the AI config detail modal contains the JSON schema fields
    await agent.history.expectAiConfigDetailModalContainsText('"type": "json_schema"');
    await agent.history.expectAiConfigDetailModalContainsText('"name": "name"');
    await agent.history.expectAiConfigDetailModalContainsText('"strict": true');
    await agent.history.expectAiConfigDetailModalContainsText('"additionalProperties": false');
    await agent.history.expectAiConfigDetailModalContainsText('"description": "name of person"');
  });

});
