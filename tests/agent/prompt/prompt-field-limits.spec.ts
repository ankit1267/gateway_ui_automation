import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Prompt - Field Character Limits & Validation', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  // ── Missing Test Area #18: Prompt Field Character Limits / Validation ──
  test('TC-PROMPT-LIMIT-01: Role field accepts long text input', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    const longRole = 'A'.repeat(500);
    await agent.prompt.fillRole(longRole);

    const value = await agent.prompt.getRoleValue();
    expect(value.length).toBeGreaterThanOrEqual(500);
  });

  test('TC-PROMPT-LIMIT-02: Goal field accepts long text input', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    const longGoal = 'B'.repeat(500);
    await agent.prompt.fillGoal(longGoal);

    const value = await agent.prompt.getGoalValue();
    expect(value.length).toBeGreaterThanOrEqual(500);
  });

  test('TC-PROMPT-LIMIT-03: Instructions field accepts long text input', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    const longInstructions = 'C'.repeat(1000);
    await agent.prompt.fillInstructions(longInstructions);

    const value = await agent.prompt.getInstructionsValue();
    expect(value.length).toBeGreaterThanOrEqual(1000);
  });

  test('TC-PROMPT-LIMIT-04: Empty role field does not break save', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Clear role and attempt save
    await agent.prompt.fillRole('');

    // Save button should be enabled (empty values are allowed)
    const saveButton = page.getByTestId('prompt-header-save-button');
    await expect(saveButton).toBeEnabled();

    // Try saving
    await agent.prompt.clickSaveButton();

    // Should not show error alert
    await expect(page.getByRole('alert').filter({ hasText: /error|fail/i })).not.toBeVisible();
  });

  test('TC-PROMPT-LIMIT-05: Special characters in prompt fields', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    const specialChars = 'Test !@#$%^&*()_+-=[]{}|;\':",./<>?';
    await agent.prompt.fillRole(specialChars);

    const value = await agent.prompt.getRoleValue();
    expect(value).toContain('!@#$%^&*()');
  });

  test('TC-PROMPT-LIMIT-06: Unicode characters in prompt fields', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    const unicodeText = 'Hello 世界 🌍 ñoño';
    await agent.prompt.fillRole(unicodeText);

    const value = await agent.prompt.getRoleValue();
    expect(value).toContain('世界');
    expect(value).toContain('🌍');
  });

  // these test can be enabled when the response type ui design is fixed

  // test('TC-PROMPT-LIMIT-07: JSON schema textarea handles large schema', async ({ agents, page }) => {
  //   const agent = await agents.openAgent(AGENT_NAME);

  //   await agent.prompt.selectResponseType('json_schema');

  //   const largeSchema = JSON.stringify({
  //     type: 'object',
  //     properties: Object.fromEntries(
  //       Array.from({ length: 20 }, (_, i) => [`field${i}`, { type: 'string' }])
  //     )
  //   });

  //   await agent.prompt.fillJsonSchema(largeSchema);
  //   await page.locator('body').click();

  //   // Verify schema textarea is scrollable with large content
  //   await agent.prompt.expectJsonSchemaTextareaScrollable();
  // });
});
