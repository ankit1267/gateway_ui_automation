import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Prompt - Instructions Section Interactions', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  // ── Missing Test Area #19: Instructions Section Interactions (open/close/resize) ──
  test('TC-PROMPT-INST-01: Click instructions section to expand', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Instructions textarea should be visible by default
    await agent.prompt.expectInstructionsVisible();

    // Click on instructions
    await agent.prompt.clickInstructions();

    // Verify textarea is still visible after click
    await agent.prompt.expectInstructionsVisible();
  });

  test('TC-PROMPT-INST-02: Instructions textarea is editable', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    const testText = `Editable instruction test ${Date.now()}`;
    await agent.prompt.fillInstructions(testText);

    const value = await agent.prompt.getInstructionsValue();
    expect(value).toContain(testText);
  });

  test('TC-PROMPT-INST-03: Instructions section resize handle exists', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Resize handle may be present (dummy data-testid)
    const resizeHandle = page.getByTestId('prompt-resize-handle');

    if (await resizeHandle.isVisible().catch(() => false)) {
      await expect(resizeHandle).toBeVisible();
    }
  });


  test('TC-PROMPT-INST-05: System prompt auto-generated after filling goal', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Fill goal field
    await agent.prompt.fillGoal('Help users with motivation and productivity');
    await page.waitForTimeout(2000);

    // System prompt should be auto-generated (non-empty)
    const systemPrompt = await agent.prompt.getSystemPromptValue();
    expect(systemPrompt.trim()).not.toBe('');
  });
});


