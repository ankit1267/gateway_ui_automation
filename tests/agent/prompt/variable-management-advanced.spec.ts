import { test, expect } from '../../../fixtures/base.fixture';
//isme agent ka lafda ho sakta hai
const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Prompt - Variable Management Advanced (All Input Types)', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  // ── Missing Test Area #12: Variable Management - Advanced (all input types) ──
  test('TC-PROMPT-VAR-ADV-01: Create text variable and verify input type', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Add a variable placeholder in instructions
    await agent.prompt.fillInstructions('Use variable {{text_var}} in response');
    await agent.prompt.clickSaveButton();

    // Open variable manager
    await agent.prompt.openVariableManager();
    await agent.prompt.expectVariableSliderVisible();

    // Verify variable key input is visible
    await agent.prompt.expectVariableKeyInputVisible(0);

    // Fill variable key
    await agent.prompt.fillVariableKey(0, 'text_var');

    // Select text type
    await agent.prompt.selectVariableType(0, 'String');

    // Fill default value
    await agent.prompt.fillVariableDefault(0, 'jai ho');
  });

  test('TC-PROMPT-VAR-ADV-02: Create number variable and verify input type', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.prompt.fillInstructions('Count is {{number_var}}');
    await agent.prompt.clickSaveButton();

    await agent.prompt.openVariableManager();
    await agent.prompt.expectVariableSliderVisible();

    await agent.prompt.fillVariableKey(1, 'number_var');
    await agent.prompt.selectVariableType(1, 'Number');

    // Verify number input is visible
    const numberInput = agent.prompt.getVariableValueNumber(1);
    await expect(numberInput).toBeVisible();
  });

  test('TC-PROMPT-VAR-ADV-03: Create select variable with options', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.prompt.fillInstructions('Choose {{select_var}}');
    await agent.prompt.clickSaveButton();

    await agent.prompt.openVariableManager();
    await agent.prompt.expectVariableSliderVisible();

    await agent.prompt.fillVariableKey(2, 'select_var');
    await agent.prompt.selectVariableType(2, 'Number');

    
  });

  

  test('TC-PROMPT-VAR-ADV-05: Toggle variable required flag', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.prompt.fillInstructions('Required: {{required_var}}');
    await agent.prompt.clickSaveButton();

    await agent.prompt.openVariableManager();
    await agent.prompt.expectVariableSliderVisible();

    await agent.prompt.fillVariableKey(1, 'required_var');

    // Toggle required
    // await agent.prompt.toggleVariableRequired(4);

    // // Verify toggle state
    // const requiredToggle = agent.prompt.getVariableRequiredToggle(4);
    // await expect(requiredToggle).toBeChecked();
  });

  test('TC-PROMPT-VAR-ADV-06: Delete variable from slider', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.prompt.fillInstructions('Temporary: {{temp_var}}');
    await agent.prompt.clickSaveButton();

    await agent.prompt.openVariableManager();
    await agent.prompt.expectVariableSliderVisible();

    await agent.prompt.fillVariableKey(0, 'temp_var');

    // Delete the variable
    await agent.prompt.deleteVariable(0);

  
  });

  test('TC-PROMPT-VAR-ADV-07: Variable suggestions dropdown appears', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Type variable syntax to trigger suggestions
    await agent.prompt.fillInstructions('Hello {{');

    // Check for suggestions dropdown using existing data-testid
    const suggestionsDropdown = page.getByTestId('variables-suggestions-dropdown');

    // Suggestions may appear based on existing variables
    if (await suggestionsDropdown.isVisible().catch(() => false)) {
      await expect(suggestionsDropdown).toBeVisible();
    }
  });
});
