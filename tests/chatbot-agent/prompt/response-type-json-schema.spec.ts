import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.CHATBOT_AGENT!;

test.describe('Prompt - Response Type (Chatbot)', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
  });

  test('TC-PROMPT-RESP-08: JSON schema response type enforces schema fields in playground response', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.tabs.openPrompt();
    await agent.prompt.selectResponseType('json_schema');

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
    await agent.prompt.fillJsonSchema(schema);
    await agent.prompt.blurInput();

    await agent.chatbot.sendMessage('hii');
    await agent.chatbot.waitForResponseComplete();

    // Go to history
    await agent.header.openHistory();
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
