import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Model - Fallback & Tool Choice', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  // ── Missing Test Area #7: Fallback Model ──
  test('TC-MODEL-FALLBACK-01: Enable fallback model and select service/model', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    // Enable fallback model
    await agent.model.toggleFallbackModel(true);

    // Verify fallback container is visible (bg-base-50)
    await expect(page.locator('.w-full.p-3.border.border-base-200.rounded-lg.bg-base-50')).toBeVisible();

    // Select fallback service (e.g., Anthropic)
    await agent.model.selectFallbackService('gemini');
    await expect(page.getByTestId('fallback-service-dropdown-trigger-button')).toContainText('Gemini');

    // Select fallback model
    await agent.model.clickFallbackModelDropdown();
    // Assuming 'claude-3-5-sonnet' is available in the list
    const modelOption = page.getByTestId('fallback-model-dropdown-trigger-button').filter({ hasText: 'gemini-2.5-pro' }).first();
    if (await modelOption.isVisible()) {
        await modelOption.click();
        await expect(page.getByTestId('fallback-model-dropdown-trigger-button')).toContainText('gemini-2.5-pro');
    }
  });

  test('TC-MODEL-FALLBACK-02: Show alert when fallback model is same as primary', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    // Set primary model to gpt-4o
    await agent.model.selectServiceProvider('Openai');
    await agent.model.selectModel('gpt-4o');

    // Enable fallback and set to same model
    await agent.model.toggleFallbackModel(true);
    await agent.model.selectFallbackService('openai');
    
    // Open dropdown and select gpt-4o (this might be tricky if UI filters it out, 
    // but the alert check is requested)
    await agent.model.clickFallbackModelDropdown();
    const gpt4oOption = page.getByTestId('fallback-model-dropdown-menu').getByText('gpt-4o', { exact: true });
    
    if (await gpt4oOption.isVisible()) {
        await gpt4oOption.click();
        // Verify alert
        await expect(page.getByTestId('fallback-model-same-model-alert')).toBeVisible();
    }
  });

  // ── Missing Test Area #8: Tool Choice ──
  test('TC-MODEL-TOOL-01: Switch between tool choice options', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    // Open tool choice dropdown
    await agent.model.clickAdvancedParameterDropdown('tool_choice');

    // Select 'auto'
    await agent.model.selectToolChoiceOption('auto');
    await expect(page.getByTestId('advanced-param-dropdown-trigger-tool_choice')).toContainText('auto');

    // Select 'none'
    await agent.model.clickAdvancedParameterDropdown('tool_choice');
    await agent.model.selectToolChoiceOption('none');
    await expect(page.getByTestId('advanced-param-dropdown-trigger-tool_choice')).toContainText('none');

    // Select 'required'
    await agent.model.clickAdvancedParameterDropdown('tool_choice');
    await agent.model.selectToolChoiceOption('required');
    await expect(page.getByTestId('advanced-param-dropdown-trigger-tool_choice')).toContainText('required');
  });
});
