import { test, expect } from '../../../fixtures/base.fixture';
import type { AgentPage } from '../../../pages/agent/agent.page';

const AGENT_NAME = process.env.TESTING_AGENT!;

test.describe('Agent Settings', () => {
  let agent: AgentPage;

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
    agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openSettings();
  });

  test('TC-SET-01: Switching to Triggers shows ViaSocket embed in Settings', async () => {
    await agent.settings.checkTriggerRadio();
    await expect(agent.settings.bridgeTypeTrigger).toBeChecked({ timeout: 10_000 });

    await expect(agent.settings.embedHeader).toBeVisible();
    await agent.settings.closeEmbedIfVisible();
    await agent.settings.selectApiRadio();
    await expect(agent.settings.bridgeTypeApi).toBeChecked({ timeout: 10_000 });
  });

  test('TC-SET-02: Verify that the user can select different tone options in Settings.', async () => {
    await agent.settings.ensureApiMode();

    await agent.settings.selectTone('neutral');
    await agent.settings.selectTone('humorous');
    await agent.settings.selectTone('formal');
  });

  test('TC-SET-03: Verify response style dropdown accepts valid values.', async () => {
    await agent.settings.ensureApiMode();

    await agent.settings.selectResponseStyle('analytical');
    await agent.settings.selectResponseStyle('crisp');
    await agent.settings.selectResponseStyle('storytelling');
  });

  //we remove the guardrail toggle for now
  // test('TC-SET-04: Verify enabling and disable Guardrails configuration.', async () => {
  //   await agent.settings.ensureApiMode();

  //   await agent.settings.checkGuardrailToggle();
  //   await expect(agent.settings.addGuardrailBtn).toBeVisible({ timeout: 10_000 });

  //   await agent.settings.uncheckGuardrailToggle();
  //   await expect(agent.settings.addGuardrailBtn).toBeHidden({ timeout: 10_000 });
  // });

  test('TC-SET-05: Verify webhook validation when Custom mode is selected.', async () => {
    await agent.settings.ensureApiMode();

    await agent.settings.selectCustomMode();
    await agent.settings.fillWebhookUrl('');
    await agent.settings.clickHiddenElement();

    await expect(agent.settings.getByText('Please enter a valid webhook')).toBeVisible();

    await agent.settings.selectDefaultMode();
  });

  test('TC-SET-06: Invalid headers JSON is rejected.', async () => {
    await agent.settings.ensureApiMode();

    await agent.settings.selectCustomMode();
    await agent.settings.fillHeaders('{invalid}');
    await agent.settings.clickHiddenElement();

    await expect(agent.settings.getByText('Invalid JSON')).toBeVisible();

    await agent.settings.selectDefaultMode();
  });
  
  // we remove the guardrail toggle for now
  // test('TC-SET-07: Agent Settings – Guardrail Configuration.', async () => {
  //   await agent.settings.ensureApiMode();

  //   await agent.settings.checkGuardrailToggle();

  //   await expect(agent.settings.addGuardrailBtn).toBeEnabled();
  //   await agent.settings.clickAddGuardrailTypes();

  //   await expect(agent.settings.promptInjection).toBeVisible();
  //   await expect(agent.settings.bias).toBeVisible();

  //   await agent.settings.checkPromptInjection();
  //   await agent.settings.checkBias();

  //   await expect(agent.settings.promptInjection).toBeChecked();
  //   await expect(agent.settings.bias).toBeChecked();

  //   await agent.settings.uncheckPromptInjection();
  //   await agent.settings.uncheckBias();

  //   await agent.settings.uncheckGuardrailToggle();
  //   await expect(agent.settings.guardrailsToggle).not.toBeChecked();
  // });

  test('TC-SET-08: Custom tone option opens modal and saves custom prompt.', async () => {
    await agent.settings.ensureApiMode();

    // Select custom tone option
    await agent.settings.selectCustomTone();

    // Verify custom tone modal is visible
    await agent.settings.expectCustomToneModalVisible();

    // Fill custom prompt
    await agent.settings.fillCustomTonePrompt(`Respond in a warm yet professional tone - ${Math.random().toString(36).substring(7)}`);

    // Save custom prompt
    await agent.settings.clickCustomToneSave();

    // Verify modal is closed
    await agent.settings.expectCustomToneModalHidden();
  });

  test('TC-SET-09: Custom response style option opens modal and saves custom prompt.', async () => {
    await agent.settings.ensureApiMode();

    // Select custom response style option
    await agent.settings.selectCustomResponseStyle();

    // Verify custom response style modal is visible
    await agent.settings.expectCustomResponseStyleModalVisible();

    // Fill custom prompt
    await agent.settings.fillCustomResponseStylePrompt(`Always respond with a short summary first, then bullet points - ${Math.random().toString(36).substring(7)}`);

    // Save custom prompt
    await agent.settings.clickCustomResponseStyleSave();

    // Verify modal is closed
    await agent.settings.expectCustomResponseStyleModalHidden();
  });

  test('TC-SET-10: Verify prompt persistence after cancel.', async () => {
    await agent.settings.ensureApiMode();

    // Select custom tone option
    await agent.settings.selectCustomTone();

    // Verify custom tone modal is visible
    await agent.settings.expectCustomToneModalVisible();

    const promptBeforeCancel = await agent.settings.getCustomTonePromptValue();
    // Fill custom prompt
    await agent.settings.fillCustomTonePrompt('Test prompt');

    // Cancel without saving
    await agent.settings.clickCustomToneCancel();

    // Verify modal is closed
    await agent.settings.expectCustomToneModalHidden();

    // Re-open the modal by selecting custom tone again
    await agent.settings.selectCustomTone();

    // Verify modal is visible again
    await agent.settings.expectCustomToneModalVisible();

    // Verify the prompt is the same as before cancel
    const promptAfterCancel = await agent.settings.getCustomTonePromptValue();
    expect(promptAfterCancel).toBe(promptBeforeCancel);

    // Cancel the modal to clean up
    await agent.settings.clickCustomToneCancel();
    await agent.settings.expectCustomToneModalHidden();
  });
});
