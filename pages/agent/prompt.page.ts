import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { PromptHelperPanel } from '../../components/prompt/prompt-helper.panel';
import { PreToolDropdown } from '../../components/prompt/pre-tool.panel';

export class PromptPage {
  private readonly page: Page;
  private readonly role: Locator;
  private readonly goal: Locator;
  private readonly instructions: Locator;
  private readonly agentSetupCard: Locator;
  private readonly diffButton: Locator;
  private readonly diffModal: Locator;
  private readonly instructionsSection: Locator;
  private readonly manageVariablesButton: Locator;
  private readonly responseTypeSelect: Locator;
  private readonly variableSlider: Locator;
  private readonly migrateButton: Locator;
  private readonly simpleModeButton: Locator;
  private readonly advancedModeButton: Locator;
  private readonly addPreTool: Locator;
  readonly promptHelper: PromptHelperPanel;
  readonly preToolDropdown: PreToolDropdown;
  readonly deleteButton: Locator;
  readonly deleteModal: Locator;
  constructor(page: Page) {
    this.page = page;
    this.role = page.getByRole('textbox', { name: 'e.g. You are a helpful customer support agent' });
    this.goal = page.getByRole('textbox', { name: 'e.g. Help users resolve billing issues' });
    this.instructions = page.getByRole('textbox', { name: 'e.g. Always be polite. Never' });
    this.agentSetupCard = page.getByTestId('agent-setup-guide-container');
    this.diffButton = page.getByTestId('prompt-header-diff-button');
    this.diffModal = page.getByTestId('DIFF_PROMPT');
    this.instructionsSection = page.getByText('InstructionsAdd dynamic');
    this.manageVariablesButton = page.getByTestId('default-variables-manage-button');
    this.variableSlider = page.getByRole('complementary', {
      name: 'Variable collection slider'
    });
    this.promptHelper = new PromptHelperPanel(page);
    this.responseTypeSelect = page.getByTestId('advanced-param-select-response_type');

    this.migrateButton = page.getByTestId('prompt-header-migrate-button');
    this.simpleModeButton = page.getByRole('button', { name: 'simple' });
    this.advancedModeButton = page.getByRole('button', { name: 'advanced' });
    this.addPreTool = page.getByTestId('pre-embed-add-button');
    this.promptHelper = new PromptHelperPanel(page);
    this.preToolDropdown = new PreToolDropdown(page);
    this.deleteButton = page.getByTestId(/^render-embed-delete-button-/);
    this.deleteModal = page.getByTestId('DELETE_PRE_TOOL_MODAL').getByTestId('delete-modal-confirm-button');

  }

  async expectMigrateButtonVisible() {
    await expect(this.migrateButton).toBeVisible();
  }

  async expectParamModesVisible() {
    await expect(this.simpleModeButton).toBeVisible();
    await expect(this.advancedModeButton).toBeVisible();
  }

  async selectResponseType(value: string) {
    await this.responseTypeSelect.selectOption(value);
    await expect(this.responseTypeSelect).toHaveValue(value);
  }

  //deleteVariable
  async deleteVariable(index: number) {
    await this.page.locator(`#variable-delete-button-${index}`).click();
  }

  async openInstructionsSection() {
    await this.instructionsSection.click();
  }

  async openVariableManager() {
    await this.manageVariablesButton.click();
  }

  async expectVariableSliderVisible() {
    await expect(this.variableSlider).toBeVisible();
  }

  async expectVariableKeyInputVisible(index: number) {
    await expect(
      this.page.locator(`#variable-key-input-${index}`)
    ).toBeVisible();
    
  }

  async deletePreTool() {
    await this.deleteButton.click();
    await this.deleteModal.click();
  }


  async addPreToolClick() {
    await this.addPreTool.click();
  }

  async diffModalVisible() {
    await expect(this.diffModal).toBeVisible();
  }

  async diffButtonClick() {
    await this.diffButton.click();
    await this.diffModalVisible();
  }

  async fillRole(prompt: string) {
    await this.role.fill(prompt);
    await this.blurInput();
  }

  async fillGoal(prompt: string) {
    await this.goal.fill(prompt);
    await this.blurInput();
  }

  async fillInstructions(prompt: string) {
    await this.instructions.fill(prompt);
    await this.blurInput();
  }

  async fillPrompt(role: string, goal: string, instructions: string) {
    await this.fillRole(role);
    await this.fillGoal(goal);
    await this.fillInstructions(instructions);
  }

  async blurInput() {
    await this.page.locator('body').click();
  }

  //click on instructions input
  async clickInstructions() {
    await this.instructions.click();
  }

  private async getDiffTexts(sectionName: string) {
    const card = this.diffModal
      .locator('h4', { hasText: sectionName })
      .locator('xpath=ancestor::div[contains(@class,"card")]');

    const texts = await card
      .locator('.font-mono span:nth-child(2)')
      .allTextContents();

    return {
      published: texts[0]?.trim(),
      current: texts[1]?.trim()
    };
  }

  async comparePublishedAndCurrentShouldNotMatch() {
    await this.diffModalVisible();

    const role = await this.getDiffTexts('role');
    const goal = await this.getDiffTexts('goal');
    const instruction = await this.getDiffTexts('instruction');

    expect(role.published).not.toBe(role.current);
    expect(goal.published).not.toBe(goal.current);
    expect(instruction.published).not.toBe(instruction.current);
  }


  getSetupStepCard(step: number) {
    return this.page.getByTestId(`agent-setup-step-${step}`);
  }

  async expectStepState(
    step: number,
    state: 'completed' | 'incomplete'
  ) {
    const card = this.getSetupStepCard(step);

    const expectedClass =
      state === 'completed'
        ? /bg-success\/10/
        : /bg-base-200/;

    await expect(card).toHaveClass(expectedClass, {
      timeout: 5000, // give UI time to update
    });
  }



  async expectAgentSetupGuideVisible() {
    await expect(this.agentSetupCard).toBeVisible();
  }

  async expectAgentSetupGuideNotVisible() {
    await expect(this.agentSetupCard).not.toBeVisible();
  }


}