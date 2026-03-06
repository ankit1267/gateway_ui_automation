import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { PromptHelperPanel } from '../../components/prompt/prompt-helper.panel';
import { PreToolDropdown } from '../../components/prompt/pre-tool.panel';

export class PromptPage {
  private readonly page: Page;
  private readonly role: Locator;
  private readonly goal: Locator;
  private readonly instructions: Locator;
  private readonly migrateRole: Locator;
  private readonly migrateGoal: Locator;
  private readonly migrateInstructions: Locator;
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
  private readonly migrateModal: Locator;
  private readonly promptHeaderDefault: Locator;
  private readonly promptHeaderHelperOpen: Locator;
  private readonly closeHelperButton: Locator;
  private readonly openHelperButton: Locator;
  private readonly diffButtonOpen: Locator;
  private readonly promptViewModeToggle: Locator;
  private readonly promptConfigContainer: Locator;
  private readonly promptSummaryButton: Locator;
  private readonly optimizePromptButton: Locator;
  private readonly promptEditorContainer: Locator;
  private readonly promptFullscreenToggle: Locator;
  private readonly promptResizeHandle: Locator;
  private readonly defaultVariablesCollapse: Locator;
  private readonly defaultVariablesToggle: Locator;
  private readonly promptTextarea: Locator;
  private readonly advancedParamsWrapper: Locator;
  private readonly buildWithAiButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.role = page.getByRole('textbox', { name: 'e.g. You are a helpful customer support agent' });
    this.goal = page.getByRole('textbox', { name: 'e.g. Help users resolve billing issues' });
    this.instructions = page.getByRole('textbox', { name: 'e.g. Always be polite. Never' });
    this.migrateRole = page.getByRole('textbox', { name: 'e.g. You are a helpful customer support assistant' });
    this.migrateGoal = page.getByRole('textbox', { name: 'e.g. Help users resolve their issues quickly and accurately' });
    this.migrateInstructions = page.getByRole('textbox', { name: 'e.g. Always be polite. Ask clarifying questions if needed...' });
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
    this.promptTextarea = page.getByTestId('prompt-textarea');
    this.migrateButton = page.getByTestId('prompt-header-migrate-button');
    this.simpleModeButton = page.getByRole('button', { name: 'simple' });
    this.advancedModeButton = page.getByRole('button', { name: 'advanced' });
    this.addPreTool = page.getByTestId('pre-embed-add-button');
    this.promptHelper = new PromptHelperPanel(page);
    this.preToolDropdown = new PreToolDropdown(page);
    this.deleteButton = page.getByTestId(/^render-embed-delete-button-/);
    this.deleteModal = page.getByTestId('DELETE_PRE_TOOL_MODAL').getByTestId('delete-modal-confirm-button');
    this.migrateModal = page.locator('dialog').filter({ hasText: 'Migrate Prompt to Structured Format' });

    // Prompt header
    this.promptHeaderDefault = page.getByTestId('prompt-header-default');
    this.promptHeaderHelperOpen = page.getByTestId('prompt-header-helper-open');
    this.closeHelperButton = page.getByTestId('prompt-header-close-helper-button');
    this.openHelperButton = page.getByTestId('prompt-header-open-helper-button');
    this.diffButtonOpen = page.getByTestId('prompt-header-diff-button-open');
    this.promptViewModeToggle = page.getByTestId('prompt-view-mode-toggle');

    // Prompt config (advanced mode)
    this.promptConfigContainer = page.getByTestId('prompt-config-container');
    this.promptSummaryButton = page.getByTestId('prompt-summary-button');
    this.optimizePromptButton = page.getByTestId('optimize-prompt-button');
    this.promptEditorContainer = page.getByTestId('prompt-editor-container');
    this.promptFullscreenToggle = page.getByTestId('prompt-fullscreen-toggle');
    this.promptResizeHandle = page.getByTestId('prompt-resize-handle');
    this.defaultVariablesCollapse = page.getByTestId('default-variables-collapse');
    this.defaultVariablesToggle = page.getByTestId('default-variables-toggle');
    this.advancedParamsWrapper = page.getByTestId('prompt-tab-advanced-params-wrapper');
    this.buildWithAiButton = page.getByText('Build with AI');
  }

  async openMigrateModal() {
    await this.migrateButton.click();
    await expect(this.migrateModal).toBeVisible();
  }

  async expectMigrateModalFieldsVisible() {
    await expect(this.migrateModal.getByText('role')).toBeVisible();
    await expect(this.migrateModal.getByText('goal')).toBeVisible();
    await expect(this.migrateModal.getByText('instruction')).toBeVisible();

    await expect(
      this.migrateModal.getByRole('button', { name: 'Cancel' })
    ).toBeVisible();

    await expect(
      this.migrateModal.getByRole('button', { name: 'Migrate & Save' })
    ).toBeVisible();
  }

  async clickMigrateAndSaveButton() {
    await this.migrateModal.getByRole('button', { name: 'Migrate & Save' }).click();
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

  async getRoleValue(): Promise<string> {
    return await this.role.inputValue();
  }

  async getGoalValue(): Promise<string> {
    return await this.goal.inputValue();
  }

  async getInstructionsValue(): Promise<string> {
    return await this.instructions.inputValue();
  }

  async getSystemPromptValue(): Promise<string> {
    return await this.promptTextarea.inputValue();
  }

  async getMigrateRoleValue(): Promise<string> {
    return await this.migrateRole.inputValue();
  }

  async getMigrateGoalValue(): Promise<string> {
    return await this.migrateGoal.inputValue();
  }

  async getMigrateInstructionsValue(): Promise<string> {
    return await this.migrateInstructions.inputValue();
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
    await this.expectSavedVisible();
  }

  async fillGoal(prompt: string) {
    await this.goal.fill(prompt);
    await this.blurInput();
    await this.expectSavedVisible();
  }

  async fillInstructions(prompt: string) {
    await this.instructions.fill(prompt);
    await this.blurInput();
    await this.expectSavedVisible();
  }

  async fillPrompt(role: string, goal: string, instructions: string) {
    await this.fillRole(role);
    await this.fillGoal(goal);
    await this.fillInstructions(instructions);
  }

  async fillMigrateRole(prompt: string) {
    await this.migrateRole.fill(prompt);
    await this.blurInput();
  }

  async fillMigrateGoal(prompt: string) {
    await this.migrateGoal.fill(prompt);
    await this.blurInput();
  }

  async fillMigrateInstructions(prompt: string) {
    await this.migrateInstructions.fill(prompt);
    await this.blurInput();
  }

  async fillMigratePrompt(role: string, goal: string, instructions: string) {
    await this.fillMigrateRole(role);
    await this.fillMigrateGoal(goal);
    await this.fillMigrateInstructions(instructions);
  }

  async blurInput() {
    await this.page.locator('body').click();
  }

  async expectSavedVisible() {
    await expect(
      this.page.locator('div.text-base-content', { hasText: 'Saved' })
    ).toBeVisible();
  }

  //click on instructions input
  async clickInstructions() {
    await this.instructions.click();
  }

  async expectRoleVisible() {
    await expect(this.role).toBeVisible();
  }

  async clickGoal() {
    await this.goal.click();
  }

  async expectInstructionsVisible() {
    await expect(this.instructions).toBeVisible();
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

  // --- Prompt header actions ---

  async isPromptHeaderDefaultVisible(): Promise<boolean> {
    return this.promptHeaderDefault.isVisible();
  }

  async isPromptHeaderHelperOpenVisible(): Promise<boolean> {
    return this.promptHeaderHelperOpen.isVisible();
  }

  async openPromptHelper() {
    await this.openHelperButton.click();
  }

  async closePromptHelper() {
    await this.closeHelperButton.click();
  }

  async clickDiffButtonFromHelperView() {
    await this.diffButtonOpen.click();
  }

  async isPromptViewModeToggleVisible(): Promise<boolean> {
    return this.promptViewModeToggle.isVisible();
  }

  // --- Prompt config actions ---

  async isPromptConfigVisible(): Promise<boolean> {
    return this.promptConfigContainer.isVisible();
  }

  async clickPromptSummary() {
    await this.promptSummaryButton.click();
  }

  async clickOptimizePrompt() {
    await this.optimizePromptButton.click();
  }

  async openBuildWithAI() {
    await this.buildWithAiButton.click();
  }

  async toggleFullscreen() {
    await this.promptFullscreenToggle.click();
  }

  async toggleDefaultVariables() {
    await this.defaultVariablesToggle.click();
  }

  async isDefaultVariablesCollapseVisible(): Promise<boolean> {
    return this.defaultVariablesCollapse.isVisible();
  }

  // --- Variable slider fields (id-based locators) ---

  getVariableKeyInput(index: number): Locator {
    return this.page.locator(`#variable-key-input-${index}`);
  }

  getVariableValueText(index: number): Locator {
    return this.page.locator(`#variable-value-text-${index}`);
  }

  getVariableValueNumber(index: number): Locator {
    return this.page.locator(`#variable-value-number-${index}`);
  }

  getVariableValueSelect(index: number): Locator {
    return this.page.locator(`#variable-value-select-${index}`);
  }

  getVariableValueTextarea(index: number): Locator {
    return this.page.locator(`#variable-value-textarea-${index}`);
  }

  getVariableDefaultText(index: number): Locator {
    return this.page.locator(`#variable-default-text-${index}`);
  }

  getVariableDefaultNumber(index: number): Locator {
    return this.page.locator(`#variable-default-number-${index}`);
  }

  getVariableDefaultSelect(index: number): Locator {
    return this.page.locator(`#variable-default-select-${index}`);
  }

  getVariableDefaultTextarea(index: number): Locator {
    return this.page.locator(`#variable-default-textarea-${index}`);
  }

  getVariableTypeSelect(index: number): Locator {
    return this.page.locator(`#variable-type-select-${index}`);
  }

  getVariableRequiredToggle(index: number): Locator {
    return this.page.locator(`#variable-required-toggle-${index}`);
  }

  getVariableDeleteButton(index: number): Locator {
    return this.page.locator(`#variable-delete-button-${index}`);
  }

  async fillVariableKey(index: number, key: string) {
    await this.getVariableKeyInput(index).fill(key);
    await this.getVariableKeyInput(index).blur();
  }

  async fillVariableValue(index: number, value: string) {
    await this.getVariableValueText(index).fill(value);
    await this.getVariableValueText(index).blur();
  }

  async selectVariableType(index: number, type: string) {
    await this.getVariableTypeSelect(index).selectOption(type);
  }

  async toggleVariableRequired(index: number) {
    await this.getVariableRequiredToggle(index).click();
  }

  async fillVariableDefault(index: number, value: string) {
    await this.getVariableDefaultText(index).fill(value);
    await this.getVariableDefaultText(index).blur();
  }

  // --- Widget response type ---

  private getWidgetResponseCard(index: number): Locator {
    return this.advancedParamsWrapper
      .locator('[data-testid^="widget-response-card-"]')
      .nth(index);
  }

  async expectAvailableWidgetsPanelVisible() {
    await expect(this.advancedParamsWrapper.getByText('Available Widgets:')).toBeVisible();
  }

  async selectWidgetByIndex(index: number) {
    const cardsByTestId = this.getWidgetResponseCard(index);

    if (await cardsByTestId.count()) {
      await cardsByTestId.first().click();
      return;
    }

    if (index === 0) {
      await this.advancedParamsWrapper
        .locator('.flex.flex-col.gap-2.p-3')
        .first()
        .click();
      return;
    }

    await this.advancedParamsWrapper
      .locator('.flex.flex-col.gap-2.p-3.rounded-lg.border.cursor-pointer.transition-colors.min-w-\\[280px\\].flex-shrink-0.bg-base-100')
      .first()
      .click();
  }

  async expectSelectedWidgetChipVisible(id: number) {
    await expect(this.page.locator(`[id="${id}"]`)).toBeVisible();
  }

  async expectWidgetsSelectedCount(count: number) {
    await expect(
      this.advancedParamsWrapper.getByText(`Updated widgets (${count} selected)`)
    ).toBeVisible();
  }

  async expectManageButtonVisible() {
    await expect(
      this.advancedParamsWrapper.getByRole('button', { name: 'Manage' })
    ).toBeVisible();
  }
}