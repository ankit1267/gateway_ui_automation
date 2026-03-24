import { test, expect } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.CHATBOT_AGENT!;

test.describe('Model - API Key validation', () => {
   
    test.beforeEach(async ({ agents }) => {
        agents.goto('chatbot');
        
    });

    test('TC-APIKEY-01: API key required error is shown', async ({ agents }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Anthropic');
        await agent.model.expectNoApiKeysMessage();

        await agent.model.clickGetStarted();

        await agent.model.expectApiKeyRequiredError();
    });

    test('TC-APIKEY-02: API key is added', async ({ agents }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Mistral');

        await agent.model.selectApiKey('Mistral api key');
        await agent.model.expectChatBotVisible();

    });
});
