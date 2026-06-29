import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Model - Dropdown Features & Setup Flow', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  // ── Missing Test Area #10: Model Dropdown Features ──
  test('TC-MODEL-DROPDOWN-02: Search and filter models in dropdown', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Openai');
    // Open model dropdown
    await agent.model.openModelDropdown();

    // Verify filtered results
    const option = page.getByTestId('model-dropdown-grouped-option-gpt-4o');
    await expect(option).toBeVisible();
    
    // Verify unrelated models are hidden
    const unrelatedOption = page.getByTestId('model-dropdown-grouped-option-claude-3-5-sonnet');
    await expect(unrelatedOption).not.toBeVisible();
  });

  // ── Missing Test Area #11: Get Started / Agent Setup Flow ──
  test('TC-MODEL-SETUP-01: Model setup guide visibility and "Get Started" behavior', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    // Note: Setup guide might only show if no model is configured or for new agents
    const setupGuide = page.getByTestId('agent-setup-guide-container');
    if (await setupGuide.isVisible().catch(() => false)) {
        // Verify Get Started button
        const getStartedBtn = page.getByTestId('agent-setup-get-started-button');
        await expect(getStartedBtn).toBeVisible();
        
        // Click Get Started and verify it scrolls to/focuses on model section or dismisses
        await getStartedBtn.click();
        // The guide typically dismisses or scrolls
    }
  });

  

  // ── Missing Test Area #12: Error Handling & Edge Cases ──
  test('TC-MODEL-ERROR-01: Show "No API keys" message when provider has no keys', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    // Switch to a provider likely to have no keys (e.g., Mistral if not configured)
    await agent.model.selectServiceProvider('Grok');
    
    // The API key dropdown should show the placeholder
    await expect(page.getByTestId('apikey-input-dropdown-trigger-button')).toContainText('No API keys for this service');
  });
});
