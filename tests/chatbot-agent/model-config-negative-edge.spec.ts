import { test, expect } from '@playwright/test';
import { ModelPage, ServiceProvider } from '../../pages/modelPage';

test.use({ storageState: 'auth.json' });

test.describe('Model Configuration – Service Provider & Model List', () => {
    let modelPage: ModelPage;

    test.beforeEach(async ({ page }) => {
        modelPage = new ModelPage(page);

        // open agent + model tab
        await modelPage.openChatbotAgent('untitled_agent_1');
    });

    test('TC-MODEL-01: Select Mistral as Service Provider', async () => {
        await modelPage.selectServiceProvider('Mistral');
    });

    test('TC-MODEL-02: Verify Model List Loads for Mistral', async () => {
        await modelPage.selectServiceProvider('Mistral');

        const mistralModels = [
            'mistral-medium-latest',
            'magistral-medium-latest',
            'codestral-latest',
            'mistral-small-latest',
            'magistral-small-latest',
        ];

        await modelPage.expectModelsVisible(mistralModels);
    });

    test('TC-MODEL-03: Verify Model List Loads for Openai', async () => {
        await modelPage.selectServiceProvider('Openai');

        const openAiModels = [
            'gpt-5',
            'gpt-5-nano',
            'gpt-4o-mini',
            'chatgpt-4o-latest',
            'gpt-4.1',
            'gpt-4.1-mini',
            'gpt-4.1-nano',
        ];

        await modelPage.expectModelsVisible(openAiModels);
    });

    test('TC-MODEL-04: Verify Model List Loads for Anthropic', async () => {
        await modelPage.selectServiceProvider('Anthropic');

        const anthropicModels = [
            'claude-3-7-sonnet-latest',
            'claude-3-7-sonnet-latest',
        ];

        await modelPage.expectModelsVisible(anthropicModels);
    });

    test('TC-MODEL-05: Verify Model List Loads for Groq', async () => {
        await modelPage.selectServiceProvider('Groq');

        const groqModels = [
            'llama-3.3-70b-versatile',
            'llama-3.1-8b-instant',
        ];

        await modelPage.expectModelsVisible(groqModels);
    });

    test('TC-MODEL-06: Verify Model List Loads for Gemini', async () => {
        await modelPage.selectServiceProvider('Gemini');

        const geminiModels = [
            'gemini-2.5-pro',
            'gemini-2.5-flash-lite',
        ];

        await modelPage.expectModelsVisible(geminiModels);
    });

    test('TC-MODEL-07: Verify Model List Loads for Ai-ml', async () => {
        await modelPage.selectServiceProvider('Ai ml');

        const aimlModels = [
            'gpt-oss-120b',
            'gpt-oss-20b',
        ];

        await modelPage.expectModelsVisible(aimlModels);
    });

    test('TC-MODEL-08: Verify Model List Loads for Grok', async () => {
        await modelPage.selectServiceProvider('Grok');

        const grokModels = [
            'grok-4-fast',
            'grok-4-0709',
        ];

        await modelPage.expectModelsVisible(grokModels);
    });
});
