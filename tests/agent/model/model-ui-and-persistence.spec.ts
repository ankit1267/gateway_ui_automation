import { test, expect } from '../../../fixtures/base.fixture';
import { getModelParameterNames } from '../../../utils/model-api';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Model - UI Visibility & Selection Persistence', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  // ── Missing Test Area #1: Model Tab UI Visibility ──
  test('TC-MODEL-UI-01: Verify core Model tab configuration sections are visible', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    // Verify main config section
    await expect(page.getByTestId('model-tab-config-section')).toBeVisible();

    // Verify service and model dropdowns
    await expect(page.getByTestId('service-dropdown-container')).toBeVisible();
    await expect(page.getByTestId('model-dropdown-container')).toBeVisible();

    // Verify API key section
    await expect(page.getByTestId('apikey-input-compact-container')).toBeVisible();

    // Verify advanced parameters section
    await expect(page.getByTestId('model-tab-container')).toBeVisible();
  });

  // ── Missing Test Area #15: All Advanced Parameters Visibility Check ──
  test('TC-MODEL-UI-02: Verify all common advanced parameters are visible', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Anthropic');

    // The parameters come from the API for the model selected in the dropdown, not from a hardcoded list.
    // response_type is edited on the Prompt tab, and stop_sequences and tools are excluded from this check.
    const service = 'anthropic';
    const model = await agent.model.getSelectedModelName();
    const excludedParams = ['response_type', 'stop_sequences', 'tools'];
    const apiParams = (await getModelParameterNames(page, service, model)).filter(p => !excludedParams.includes(p));
    const uiParams = await agent.model.getVisibleParameterNames();

    const missingInUI = apiParams.filter(p => !uiParams.includes(p));
    const extraInUI = uiParams.filter(p => !apiParams.includes(p));
    expect(missingInUI, `API parameters for ${model} not shown on the Model tab`).toEqual([]);
    expect(extraInUI, `Model tab parameters not defined in the API for ${model}`).toEqual([]);
  });

  // ── Missing Test Area #2: Model Selection & Persistence ──
  test('TC-MODEL-PERSIST-01: Model selection persists after page refresh', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    // Select a specific provider and model (e.g., OpenAI gpt-4o)
    await agent.model.selectServiceProvider('Openai');
    await agent.model.selectModel('gpt-4o');

    // Get current model text to verify later
    const selectedModelBefore = await agent.model.getSelectedModelText();
    expect(selectedModelBefore).toContain('gpt-4o');

    // Refresh the page
    await page.reload();
    await agent.tabs.openModel();

    // Verify model is still selected
    const selectedModelAfter = await agent.model.getSelectedModelText();
    expect(selectedModelAfter).toBe(selectedModelBefore);
  });

  test('TC-MODEL-PERSIST-02: Switching models updates the dropdown label', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Openai');
    // Switch to gpt-4o-mini
    await agent.model.selectModel('gpt-4o-mini');
    await expect(page.getByTestId('model-dropdown-container')).toContainText('gpt-4o-mini');

    // Switch back to gpt-4o
    await agent.model.selectModel('gpt-4o');
    await expect(page.getByTestId('model-dropdown-container')).toContainText('gpt-4o');
  });

  // ── Missing Test Area #10: Model Dropdown Features (partial) ──
  test('TC-MODEL-DROPDOWN-01: Model dropdown closes on outside click', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    // Open model dropdown
    await agent.model.openModelDropdown();
    // await expect(page.locator('.dropdown-content').first()).toBeVisible();

    // Click outside (on the config section header)
    await page.getByTestId('model-tab-config-section').click({ position: { x: 0, y: 0 } });

    // Verify dropdown is hidden
    await expect(page.locator('.dropdown-content').first()).toBeHidden();
  });
});
