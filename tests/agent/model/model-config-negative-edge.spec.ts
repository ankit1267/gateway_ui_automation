import { test } from '../../../fixtures/base.fixture';
import { getServiceModels } from '../../../utils/model-api';
import { loadServicesSync } from '../../../utils/service-list';

const AGENT_NAME = process.env.CHATBOT_AGENT!;

// Services come from the service API, so a new provider gets its own test automatically.
const SERVICES = loadServicesSync();

test.describe('Model Configuration - Service Provider & Model List', () => {

    test.beforeEach(async ({ agents }) => {
        await agents.goto('chatbot');
    });

    // One test per service, so each runs in its own worker slot and a failure only affects that service.
    for (const service of SERVICES) {
        test(`TC-MODEL-SVC-${service.key}: Verify Model List Loads for ${service.name}`, async ({ agents, page }) => {
            const agent = await agents.openAgent(AGENT_NAME);
            await agent.tabs.openModel();
            await agent.model.selectServiceProvider(service.key);
            // Turns auto-select off (and confirms it) when the service supports it, before opening the model dropdown
            await agent.model.uncheckAutoSelectModelToggleIfSupported();

            // Expected models come from the service API, so new/retired models don't break the test.
            const models = await getServiceModels(page, service.key);
            await agent.model.expectAllModelsInDropdown(models);
        });
    }
});
