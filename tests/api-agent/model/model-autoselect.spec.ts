import { test, expect } from '../../../fixtures/base.fixture';
import type { AgentPage } from '../../../pages/agent/agent.page';

const CHATBOT_AGENT = process.env.CHATBOT_AGENT!;

test.describe('Model - Auto Select Model Toggle', () => {
  let agent: AgentPage;

  test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
    agent = await agents.openAgent(CHATBOT_AGENT);
    await agent.header.expectSavedVisible();
    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Openai');
  });

  test('TC-MODEL-AUTOSEL-01: Auto-select toggle is visible on model tab', async () => {
    await expect(agent.getPage.getByTestId('auto-select-model-toggle')).toBeVisible();
  });

  test('TC-MODEL-AUTOSEL-02: Enabling auto-select toggle auto-selects default model when service provider is chosen', async ({ page }) => {
    // API Verification: Wait for toggle state update request
    const toggleResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/versions/') &&
        resp.request().method() === 'PUT' &&
        resp.status() === 200,
      { timeout: 15000 }
    );

    await agent.model.checkAutoSelectModelToggle();

    // API Verification: Verify auto-select flag in request
    const toggleResponse = await toggleResponsePromise;
    const requestBody = JSON.parse(toggleResponse.request().postData() || '{}');
    expect(requestBody?.configuration?.auto_select_model).toBeDefined();

    await agent.model.expectModelAutoSelected();
  });

  test('TC-MODEL-AUTOSEL-03: Switching service providers with auto-select enabled updates the model each time', async ({ page }) => {
    await agent.model.checkAutoSelectModelToggle();

    const openaiModel = await agent.model.getSelectedModelText();

    // API Verification: Wait for service provider change request
    const providerResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/versions/') &&
        resp.request().method() === 'PUT' &&
        resp.status() === 200,
      { timeout: 15000 }
    );

    await agent.model.selectServiceProvider('Anthropic');

    // API Verification: Verify provider and model in request
    const providerResponse = await providerResponsePromise;
    const requestBody = JSON.parse(providerResponse.request().postData() || '{}');
    expect(requestBody?.configuration?.service_provider).toBe('anthropic');
    expect(requestBody?.configuration?.model).toBeDefined();

    const anthropicModel = await agent.model.getSelectedModelText();

    expect(openaiModel).not.toBe(anthropicModel);
    await agent.model.expectModelAutoSelected();
  });

});
