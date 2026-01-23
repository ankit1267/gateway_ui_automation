import { test } from '@playwright/test';
import { ModelPage } from '../../pages/modelPage';

test.use({ storageState: 'auth.json' });

test.describe('Model – API Key validation', () => {
    let modelPage: ModelPage;

    test.beforeEach(async ({ page }) => {
        modelPage = new ModelPage(page);

        // open chatbot agent + model tab
        await modelPage.openChatbotAgent('untitled_agent_1');
    });

    test('TC-APIKEY-01: API key required error is shown', async () => {
        await modelPage.selectServiceProvider('Mistral');

        await modelPage.expectNoApiKeysMessage();

        await modelPage.clickGetStarted();

        await modelPage.expectApiKeyRequiredError();
    });

    test('TC-APIKEY-02: API key is added', async () => {
        await modelPage.selectServiceProvider('Mistral');

        await modelPage.selectApiKey('Mistral');

        await modelPage.expectApiKeySelected();
    });
});
