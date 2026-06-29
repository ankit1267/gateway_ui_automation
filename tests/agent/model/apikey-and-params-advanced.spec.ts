import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Model - API Key Management & Advanced Parameters', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  // ── Missing Test Area #3: API Key Management ──
  test('TC-MODEL-APIKEY-01: API key dropdown shows available keys and "Add new" option', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    // Open API key dropdown
    await agent.model.clickApikeyDropdown();

    // Verify "Add new API Key" option is visible
    await expect(page.getByText('+  Add new API Key')).toBeVisible();

    // If no keys are present, the placeholder should show "No API keys for this service"
    // (This depends on the test environment state)
  });

  // ── Missing Test Area #4: Advanced Parameters - Individual ──
  test('TC-MODEL-PARAMS-01: Temperature parameter - set, verify and reset', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Gemini');
    const param = 'creativity_level';
    
    // Set value using slider
    await agent.model.setSliderValue(param, 0.8);
    let val = await agent.model.getSliderValue(param);
    expect(Number(val)).toBe(0.8);

    // Reset to default
    await agent.model.clickAdvancedParameterResetBtn(param);
    await expect(page.getByTestId(`advanced-param-reset-${param}`)).not.toBeVisible();
  });

  test('TC-MODEL-PARAMS-02: Max Tokens parameter - set and min/max buttons', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    const param = 'max_tokens';
    
    // Click Max button
    await agent.model.clickMaxTokensMaxButton();
    let val = await agent.model.getMaxTokensValue();
    // Verify it's a large number (max value varies by model)
    expect(Number(val)).toBeGreaterThan(0);

    // Click Min button
    await agent.model.clickMaxTokensMinButton();
    val = await agent.model.getMaxTokensValue();
    expect(Number(val)).toBe(256); // Usually 1 is min
  });

  // ── Missing Test Area #5: Reasoning Dropdown ──
  test('TC-MODEL-REASONING-01: Reasoning dropdown selection (if supported)', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    // Select a model that supports reasoning (e.g., o1-mini)
    await agent.model.selectModel('gemini-2.5-flash');
    // Check if reasoning dropdown is visible
    const reasoningDropdown = page.getByTestId('advanced-param-select-reasoning');
    if (await reasoningDropdown.isVisible().catch(() => false)) {
      await agent.model.clickReasoningDropdown();
      // Select medium reasoning
      await page.getByRole('option', { name: 'medium' }).click();
      await expect(reasoningDropdown).toContainText('medium');
    }
  });

  // ── Missing Test Area #6: Stream Toggle ──
  test('TC-MODEL-STREAM-01: Toggle stream on/off', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    const streamCheckbox = page.getByTestId('advanced-param-checkbox-stream');
    
    // Toggle on
    await agent.model.toggleStream(true);
    await expect(streamCheckbox).toBeChecked();

    // Toggle off
    await agent.model.toggleStream(false);
    await expect(streamCheckbox).not.toBeChecked();
  });
});
