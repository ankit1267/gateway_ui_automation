import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Prompt - Default Variables & Agent Setup Guide', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-PROMPT-VARS-01: Default Variables section visible and expandable', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Verify default variables section is visible
    const defaultVarsSection = page.getByTestId('default-variables-section');
    await expect(defaultVarsSection).toBeVisible();

    // Verify manage variables button is visible inside the header
    const manageButton = page.getByTestId('default-variables-manage-button');
    await expect(manageButton).toBeVisible();
  });

  test('TC-PROMPT-VARS-02: Expand/collapse Default Variables by clicking header', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Click the header to expand the section
    await agent.prompt.openInstructionsSection();

    // Verify expanded content is visible ("Default Variables:" label)
    await expect(page.getByText('Default Variables:', { exact: true })).toBeVisible();

    // Click the header again to collapse
    await agent.prompt.openInstructionsSection();

    // Verify expanded content is hidden
    await expect(page.getByText('Default Variables:', { exact: true })).not.toBeVisible();
  });

  test('TC-PROMPT-VARS-03: Open Variable Manager from Default Variables section', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Open variable manager via manage button
    await agent.prompt.openVariableManager();

    // Verify variable collection slider is visible
    await agent.prompt.expectVariableSliderVisible();
  });

  test('TC-PROMPT-VARS-04: Variable Manager slider opens and closes', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Open variable manager
    await agent.prompt.openVariableManager();
    await agent.prompt.expectVariableSliderVisible();

    // Close slider via the page object close button
    await agent.prompt.closeVariableManager();

    // Verify slider is closed (has translate-x-full class, moved off-screen)
    const slider = page.getByTestId('variable-collection-slider');
    await expect(slider).toHaveClass(/translate-x-full/);
  });

  // ── Setup Guide tests only apply when the guide is visible (typically for new/unconfigured agents) ──
  test('TC-PROMPT-SETUP-01: Agent Setup Guide elements present when visible', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Skip if setup guide is not shown (already dismissed or agent is configured)
    const isGuideVisible = await page.getByTestId('agent-setup-guide-container').isVisible();
    test.skip(!isGuideVisible, 'Setup guide is not visible for this agent');

    // Verify get started button exists
    const getStartedButton = page.getByTestId('agent-setup-get-started-button');
    await expect(getStartedButton).toBeVisible();

    // Verify all setup steps are visible
    await expect(page.getByTestId('agent-setup-step-1')).toBeVisible();
    await expect(page.getByTestId('agent-setup-step-2')).toBeVisible();
    await expect(page.getByTestId('agent-setup-step-3')).toBeVisible();
  
  });
});
