import { test } from '../../../fixtures/base.fixture';
import { getServiceChatModels } from '../../../utils/model-api';

const AGENT_NAME = process.env.CHATBOT_AGENT!;

test.describe('Model Configuration - Service Provider & Model List', () => {
    

    test.beforeEach(async ({ agents }) => {
        await agents.goto('chatbot');
    });


    test('TC-MODEL-01: Verify Model List Loads for Mistral', async ({ agents, page }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Mistral');
        await agent.model.uncheckAutoSelectModelToggle();

        // Expected models come from the service API, so new/retired models don't break the test.
        const models = await getServiceChatModels(page, 'Mistral');
        await agent.model.expectModelDropdownMatches(models);
    });

    test('TC-MODEL-03: Verify Model List Loads for Openai', async ({ agents, page }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Openai');
        await agent.model.uncheckAutoSelectModelToggle();

        // Expected models come from the service API, so new/retired models don't break the test.
        const models = await getServiceChatModels(page, 'Openai');
        await agent.model.expectModelDropdownMatches(models);
    });

    test('TC-MODEL-04: Verify Model List Loads for Anthropic', async ({ agents, page }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Anthropic');
        await agent.model.expectAutoSelectModelToggleUnchecked();

        // Expected models come from the service API, so new/retired models don't break the test.
        const models = await getServiceChatModels(page, 'Anthropic');
        await agent.model.expectModelDropdownMatches(models);
    });

    test('TC-MODEL-05: Verify Model List Loads for Groq', async ({ agents, page }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Groq');
        // await agent.model.uncheckAutoSelectModelToggle();

        // Expected models come from the service API, so new/retired models don't break the test.
        const models = await getServiceChatModels(page, 'Groq');
        await agent.model.expectModelDropdownMatches(models);
    });

    test('TC-MODEL-06: Verify Model List Loads for Gemini', async ({ agents, page }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Gemini');
        await agent.model.uncheckAutoSelectModelToggle();

        // Expected models come from the service API, so new/retired models don't break the test.
        const models = await getServiceChatModels(page, 'Gemini');
        await agent.model.expectModelDropdownMatches(models);
    });

    test('TC-MODEL-07: Verify Model List Loads for Grok', async ({ agents, page }) => {
        const agent = await agents.openAgent(AGENT_NAME);
        await agent.tabs.openModel();
        await agent.model.selectServiceProvider('Grok');
        // await agent.model.uncheckAutoSelectModelToggle();

        // Expected models come from the service API, so new/retired models don't break the test.
        const models = await getServiceChatModels(page, 'Grok');
        await agent.model.expectModelDropdownMatches(models);
    });
});
