import { test } from '../../fixtures/base.fixture';

const AGENT_ID = process.env.CHATBOT_AGENT_ID!;

test.describe('Model Configuration - Service Provider & Model List', () => {
    

    test.beforeEach(async ({ agents }) => {
        await agents.goto('chatbot');
    });


    test('TC-MODEL-01: Verify Model List Loads for Mistral', async ({ agents }) => {
        const agent = await agents.openAgentById(AGENT_ID);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Mistral');

        const mistralModels = [
            'mistral-medium-latest',
            'magistral-medium-latest',
            'codestral-latest',
            'mistral-small-latest',
            'magistral-small-latest',
        ];

        await agent.model.expectModelsVisible(mistralModels);
    });

    test('TC-MODEL-03: Verify Model List Loads for Openai', async ({ agents }) => {
        const agent = await agents.openAgentById(AGENT_ID);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Openai');

        const openAiModels = [
            'gpt-5',
            'gpt-4o-mini',
            'chatgpt-4o-latest',
            'gpt-4.1',
            'gpt-4.1-mini',
            'gpt-4.1-nano',
        ];

        await agent.model.expectModelsVisible(openAiModels);
    });

    test('TC-MODEL-04: Verify Model List Loads for Anthropic', async ({ agents }) => {
        const agent = await agents.openAgentById(AGENT_ID);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Anthropic');

        const anthropicModels = [
            'claude-3-7-sonnet-latest',
            'claude-3-7-sonnet-latest',
        ];

        await agent.model.expectModelsVisible(anthropicModels);
    });

    test('TC-MODEL-05: Verify Model List Loads for Groq', async ({ agents }) => {
        const agent = await agents.openAgentById(AGENT_ID);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Groq');

        const groqModels = [
            'llama-3.3-70b-versatile',
            'llama-3.1-8b-instant',
        ];

        await agent.model.expectModelsVisible(groqModels);
    });

    test('TC-MODEL-06: Verify Model List Loads for Gemini', async ({ agents }) => {
        const agent = await agents.openAgentById(AGENT_ID);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Gemini');

        const geminiModels = [
            'gemini-2.5-pro',
            'gemini-2.5-flash-lite',
        ];

        await agent.model.expectModelsVisible(geminiModels);
    });

    test('TC-MODEL-07: Verify Model List Loads for Ai-ml', async ({ agents }) => {
        const agent = await agents.openAgentById(AGENT_ID);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Ai_ml');

        const aimlModels = [
            'gpt-oss-120b',
            'gpt-oss-20b',
        ];

        await agent.model.expectModelsVisible(aimlModels);
    });

    test('TC-MODEL-08: Verify Model List Loads for Grok', async ({ agents }) => {
        const agent = await agents.openAgentById(AGENT_ID);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Grok');

        const grokModels = [
            'grok-4-fast',
            'grok-4-0709',
        ];

        await agent.model.expectModelsVisible(grokModels);
    });
});
