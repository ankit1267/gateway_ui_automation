import { test, expect } from '../../../fixtures/base.fixture';

const CHATBOT_AGENT = process.env.CHATBOT_AGENT!;

test.describe.serial('Model - Auto Select Model Toggle', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
  });

  test('TC-MODEL-AUTOSEL-01: Auto-select toggle is visible on model tab', async ({ agents }) => {
    const agent = await agents.openAgent(CHATBOT_AGENT);
    await agent.tabs.openModel();

    await expect(agent.getPage.getByTestId('auto-select-model-toggle')).toBeVisible();
  });

  test('TC-MODEL-AUTOSEL-02: Enabling auto-select toggle auto-selects default model when service provider is chosen', async ({ agents }) => {
    const agent = await agents.openAgent(CHATBOT_AGENT);
    await agent.tabs.openModel();

    await agent.model.checkAutoSelectModelToggle();
    await agent.model.selectServiceProvider('Openai');

    await agent.model.expectModelAutoSelected();
  });


  test('TC-MODEL-AUTOSEL-03: Switching service providers with auto-select enabled updates the model each time', async ({ agents }) => {
    const agent = await agents.openAgent(CHATBOT_AGENT);
    await agent.tabs.openModel();

    await agent.model.checkAutoSelectModelToggle();

    await agent.model.selectServiceProvider('Openai');
    const openaiModel = await agent.model.getSelectedModelText();

    await agent.model.selectServiceProvider('Anthropic');
    const anthropicModel = await agent.model.getSelectedModelText();

    expect(openaiModel).not.toBe(anthropicModel);
    await agent.model.expectModelAutoSelected();
  });

});
