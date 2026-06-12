import { test } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.CHATBOT_AGENT!;

test.describe('Model Configuration - Service Provider & Model List', () => {
    

    test.beforeEach(async ({ agents }) => {
        await agents.goto('chatbot');
    });


    test('TC-MODEL-01: Verify Model List Loads for Mistral', async ({ agents }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Mistral');
        await agent.model.uncheckAutoSelectModelToggle();

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
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Openai');
        await agent.model.uncheckAutoSelectModelToggle();

        const openAiModels = [
            'gpt-5',
            'gpt-4o-mini',
            'gpt-4o',
            'gpt-4.1',
            'gpt-4.1-mini',
            'gpt-4.1-nano',
        ];

        await agent.model.expectModelsVisible(openAiModels);
    });

    test('TC-MODEL-04: Verify Model List Loads for Anthropic', async ({ agents }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Anthropic');
        await agent.model.expectAutoSelectModelToggleUnchecked();
        
        const anthropicModels = [
            'claude-opus-4-6',
            'claude-sonnet-4-6'
        ];

        await agent.model.expectModelsVisible(anthropicModels);
    });

    test('TC-MODEL-05: Verify Model List Loads for Groq', async ({ agents }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Groq');
        // await agent.model.uncheckAutoSelectModelToggle();

        const groqModels = [
            'llama-3.3-70b-versatile',
            'llama-3.1-8b-instant',
        ];

        await agent.model.expectModelsVisible(groqModels);
    });

    test('TC-MODEL-06: Verify Model List Loads for Gemini', async ({ agents }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Gemini');
        await agent.model.uncheckAutoSelectModelToggle();

        const geminiModels = [
            'gemini-2.5-pro',
            'gemini-2.5-flash-lite',
        ];

        await agent.model.expectModelsVisible(geminiModels);
    });

    test('TC-MODEL-07: Verify Model List Loads for Grok', async ({ agents }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Grok');
        // await agent.model.uncheckAutoSelectModelToggle();

        const grokModels = [
            'grok-4-fast',
            'grok-4-0709',
        ];

        await agent.model.expectModelsVisible(grokModels);
    });
});
