import { test } from '../../../fixtures/base.fixture';

const AGENT_NAME = 'IntelligentAssistant_1';

test.describe('Settings - Response Format', () => {

  test('TC-SET-08: Select custom response format, fill webhook and headers, apply, then reset to default', async ({ agents }) => {
    await agents.goto('api');

    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openSettings();

    await agent.settings.ensureApiMode();

    await agent.settings.selectCustomMode();
    await agent.settings.fillWebhookUrl('https://www.webhook.com');
    await agent.settings.fillHeaders('{"content-type": "application/json"}');
    await agent.settings.clickHiddenElement();
    await agent.settings.clickResponseFormatApply();

    await agent.settings.selectDefaultMode();
  });

});
