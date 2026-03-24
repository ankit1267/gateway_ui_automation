import { test, expect } from '../../../fixtures/base.fixture';
import type { AgentPage } from '../../../pages/agent/agent.page';

const CHATBOT_AGENT = process.env.CHATBOT_AGENT!;

test.describe('Model - Auto Select Model Toggle', () => {
  let agent: AgentPage;

  test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
    agent = await agents.openAgent(CHATBOT_AGENT);
    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Openai');
  });

  test('TC-MODEL-AUTOSEL-01: Auto-select toggle is visible on model tab', async () => {
    await expect(agent.getPage.getByTestId('auto-select-model-toggle')).toBeVisible();
  });

  test('TC-MODEL-AUTOSEL-02: Enabling auto-select toggle auto-selects default model when service provider is chosen', async () => {
    await agent.model.checkAutoSelectModelToggle();

    await agent.model.expectModelAutoSelected();
  });

  test('TC-MODEL-AUTOSEL-03: Switching service providers with auto-select enabled updates the model each time', async () => {
    await agent.model.checkAutoSelectModelToggle();

    const openaiModel = await agent.model.getSelectedModelText();

    await agent.model.selectServiceProvider('Anthropic');
    const anthropicModel = await agent.model.getSelectedModelText();

    expect(openaiModel).not.toBe(anthropicModel);
    await agent.model.expectModelAutoSelected();
  });

});
