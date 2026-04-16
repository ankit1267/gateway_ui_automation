import { test, expect } from '../../fixtures/base.fixture';

const AGENT_NAME = 'Pretool variable';
const PRE_TOOL_NAME = 'compute_secure_function';
const VARIABLE_KEY = 'test';

test('Add compute_secure_function pre-tool variable path and verify variable row add/remove', async ({ agents }) => {
  // open api page
  await agents.goto('api');

  const agentPage = await agents.openAgent(AGENT_NAME);
  await agentPage.tabs.openPrompt();

  // Always start clean: remove existing pretool if present.
  if (await agentPage.prompt.hasPreTool()) {
    await agentPage.prompt.deletePreTool();
  }

  const configModal = agentPage.getPage.getByTestId('function-parameter-modal').first();
  const valuePathInput = configModal.locator('[data-testid^="param-value-path-input-"]').first();
  const saveButton = configModal.getByTestId('function-parameter-save-button');

  await agentPage.prompt.addPreToolClick();
  await agentPage.prompt.preToolDropdown.searchAndSelectPreToolFunction(PRE_TOOL_NAME);
  await agentPage.prompt.expectPreToolContainerVisible();

  await agentPage.prompt.openPreToolConfig();
  await expect(configModal).toBeVisible();
  await expect(valuePathInput).toBeVisible();

  await valuePathInput.fill(VARIABLE_KEY);
  await valuePathInput.blur();
  await expect(saveButton).toBeEnabled();
  await saveButton.click();
  await agentPage.getPage.waitForTimeout(5000);

  await agentPage.prompt.openVariableManager();
  await agentPage.prompt.expectVariableSliderVisible();
  await agentPage.prompt.expectVariableKeyWithValueVisible(VARIABLE_KEY);
  await agentPage.prompt.closeVariableManager();

  await agentPage.prompt.openPreToolConfig();
  await expect(configModal).toBeVisible();
  await valuePathInput.fill('');
  await saveButton.click();
  await agentPage.getPage.waitForTimeout(5000);

  await agentPage.prompt.openVariableManager();
  await agentPage.prompt.expectVariableSliderVisible();
  await agentPage.prompt.deleteVariable(0);
  await agentPage.prompt.closeVariableManager();

  if (await agentPage.prompt.hasPreTool()) {
    await agentPage.prompt.deletePreTool();
  }
});
