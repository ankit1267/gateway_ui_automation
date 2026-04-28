import type { Page, Locator, FrameLocator } from '@playwright/test';
import { expect } from '@playwright/test';
import { PromptHelperPanel } from '../../components/prompt/prompt-helper.panel';
import { PreToolDropdown } from '../../components/prompt/pre-tool.panel';
import { PrebuiltPreToolConfigModal } from '../../modals/prebuilt-pre-tool-config.modal';
import { lockDaisyDropdown } from '../../utils/daisy-ui';

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
  private readonly variableSlider: Locator;
  readonly promptHelper: PromptHelperPanel;
  private readonly responseTypeSelect: Locator;
  private readonly responseTypeSetDefaultButton: Locator;
  private readonly promptTextarea: Locator;
  private readonly migrateButton: Locator;
  private readonly simpleModeButton: Locator;
  private readonly advancedModeButton: Locator;
  private readonly addPreTool: Locator;
  readonly preToolDropdown: PreToolDropdown;
  readonly deleteButton: Locator;
  readonly deleteModal: Locator;
  readonly queryRefinerConfigModal: PrebuiltPreToolConfigModal;
  private readonly preEmbedFunctionsContainer: Locator;
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
  private readonly advancedParamsWrapper: Locator;
  private readonly buildWithAiButton: Locator;
  private readonly jsonSchemaTextarea: Locator;
  private readonly buildVisuallyButton: Locator;
  private readonly jsonSchemaBuilder: Locator;
  private readonly jsonSchemaNameInput: Locator;
  private readonly jsonSchemaAddPropertyButton: Locator;
  private readonly jsonSchemaSaveButton: Locator;
  private readonly jsonSchemaCloseButton: Locator;
  private readonly buildWithAiCloseButton: Locator;
  private readonly schemaPropTypeSelectNew0: Locator;
  private readonly schemaPropDeleteButtonNew0: Locator;
  private readonly schemaPropDescriptionTextareaNew0: Locator;
  private readonly jsonSchemaFullscreenButton: Locator;
  private readonly jsonSchemaSaveAndCloseButton: Locator;
  private readonly jsonSchemaFullscreenTextarea: Locator;

  constructor(page: Page) {
    this.page = page;
    this.role = page.getByRole('textbox', { name: 'e.g. You are a helpful customer support agent' });
    this.goal = page.getByRole('textbox', { name: 'e.g. Help users resolve billing issues' });
    this.instructions = page.getByRole('textbox', { name: 'e.g. Always be polite. Never' });
    this.migrateRole = page.getByTestId('migrate-prompt-role-input');
    this.migrateGoal = page.getByTestId('migrate-prompt-goal-input');
    this.migrateInstructions = page.getByTestId('migrate-prompt-instruction-textarea');
    this.agentSetupCard = page.getByTestId('agent-setup-guide-container');
    this.diffButton = page.getByTestId('prompt-header-diff-button');
    this.diffModal = page.getByTestId('DIFF_PROMPT');
    this.instructionsSection = page
      .getByTestId('default-variables-section')
      .locator(':scope > div')
      .first();
    this.manageVariablesButton = page.getByTestId('default-variables-manage-button');
    this.variableSlider = page.getByTestId('variable-collection-slider');
    this.promptHelper = new PromptHelperPanel(page);
    this.responseTypeSelect = page.getByTestId('advanced-param-select-response_type');
    this.responseTypeSetDefaultButton = page.getByTestId('advanced-param-reset-response_type');
    this.promptTextarea = page.getByTestId('prompt-textarea');
    this.migrateButton = page.getByTestId('prompt-header-migrate-button');
    this.simpleModeButton = page.getByRole('button', { name: 'simple' });
    this.advancedModeButton = page.getByRole('button', { name: 'advanced' });
    this.addPreTool = page.getByTestId('pre-embed-add-button');
    this.preToolDropdown = new PreToolDropdown(page);
    this.queryRefinerConfigModal = new PrebuiltPreToolConfigModal(page);
    this.preEmbedFunctionsContainer = page.getByTestId('pre-embed-functions-container');
    this.deleteButton = page.getByTestId(/^render-embed-delete-button-/);
    this.deleteModal = page.getByTestId('DELETE_PRE_TOOL_MODAL').getByTestId('delete-modal-confirm-button');
    this.migrateModal = page.getByTestId('migrate-prompt-modal');

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
    this.jsonSchemaTextarea = page.locator('#advanced-param-json-schema-textarea-response_type .cm-content');
    this.buildVisuallyButton = page.getByText('Build Visually');
    this.jsonSchemaBuilder = page.getByTestId('JSON_SCHEMA_BUILDER');
    this.jsonSchemaNameInput = page.getByTestId('json-schema-name-input');
    this.jsonSchemaAddPropertyButton = page.getByTestId('json-schema-builder-add-property-button');
    this.jsonSchemaSaveButton = page.getByTestId('json-schema-builder-save-button');
    this.jsonSchemaCloseButton = page.getByTestId('json-schema-builder-close-button');
    this.buildWithAiCloseButton = page.getByTestId('json-schema-close-button');
    this.schemaPropTypeSelectNew0 = page.getByTestId('schema-prop-type-select-new0');
    this.schemaPropDeleteButtonNew0 = page.getByTestId('schema-prop-delete-button-new0');
    this.schemaPropDescriptionTextareaNew0 = page.getByTestId('schema-prop-description-textarea-new0');
    this.jsonSchemaFullscreenButton = page.getByTitle('Open JSON schema in fullscreen', { exact: true });
    this.jsonSchemaSaveAndCloseButton = page.getByRole('button', { name: 'Save & Close' });
    this.jsonSchemaFullscreenTextarea = page.getByTestId('FULLSCREEN_JSON_SCHEMA').getByRole('textbox');
  }

  async openMigrateModal() {
    await this.migrateButton.click();
    await expect(this.migrateModal).toBeVisible();
  }

  async expectMigrateModalFieldsVisible() {
    await expect(this.migrateModal.getByTestId('migrate-prompt-role-input')).toBeVisible();
    await expect(this.migrateModal.getByTestId('migrate-prompt-goal-input')).toBeVisible();
    await expect(this.migrateModal.getByTestId('migrate-prompt-instruction-textarea')).toBeVisible();

    await expect(
      this.migrateModal.getByTestId('migrate-prompt-cancel-button')
    ).toBeVisible();

    await expect(
      this.migrateModal.getByTestId('migrate-prompt-save-button')
    ).toBeVisible();
  }

  async clickMigrateAndSaveButton() {
    await this.migrateModal.getByTestId('migrate-prompt-save-button').click();
  }

  async expectMigrateButtonVisible() {
    await expect(this.migrateButton).toBeVisible();
  }



  async selectResponseType(value: string) {
    await this.responseTypeSelect.selectOption(value);
    await expect(this.responseTypeSelect).toHaveValue(value);
  }

  async clickResponseTypeSetDefault() {
    await this.responseTypeSetDefaultButton.click();
  }

  async expectResponseTypeSetDefaultVisible() {
    await expect(this.responseTypeSetDefaultButton).toBeVisible({ timeout: 10000 });
  }

  async expectResponseTypeIsDefault() {
    await expect(this.responseTypeSelect).toHaveValue('default', { timeout: 10000 });
  }

  async fillJsonSchema(text: string) {
    await this.jsonSchemaTextarea.click();
    await this.jsonSchemaTextarea.press('Control+a');
    await this.jsonSchemaTextarea.fill(text);
  }

  async typeJsonSchema(text: string) {
    await this.jsonSchemaTextarea.click();
    await this.jsonSchemaTextarea.fill('');
    await this.jsonSchemaTextarea.pressSequentially(text);
  }

  async pasteJsonSchema(text: string) {
    await this.jsonSchemaTextarea.click();
    await this.jsonSchemaTextarea.press('Control+a');
    await this.page.evaluate((value) => {
      document.execCommand('insertText', false, value);
    }, text);
  }

  async expectJsonSchemaTextareaValue(text: string) {
    await expect(this.jsonSchemaTextarea).toHaveText(text, { timeout: 10000 });
  }

  async pressKeyInJsonSchema(key: string) {
    await this.jsonSchemaTextarea.focus();
    await this.jsonSchemaTextarea.press(key);
  }

  async expectInvalidJsonSchemaVisible() {
    await expect(
      this.page.getByRole('alert').filter({ hasText: 'Invalid JSON Schema' })
    ).toBeVisible();
  }

  async expectInvalidJsonSchemaTextVisible() {
    await expect(
      this.page.getByText('Invalid JSON schema', { exact: true })
    ).toBeVisible();
  }

  async expectJsonSchemaTextareaScrollable() {
    const isScrollable = await this.jsonSchemaTextarea.evaluate(
      (el: HTMLElement) => el.scrollHeight > el.clientHeight
    );
    expect(isScrollable).toBe(true);
  }

  async scrollJsonSchemaToBottom() {
    await this.jsonSchemaTextarea.evaluate(
      (el: HTMLElement) => el.scrollTo(0, el.scrollHeight)
    );
  }

  async expectJsonSchemaScrolled() {
    const scrollTop = await this.jsonSchemaTextarea.evaluate(
      (el: HTMLElement) => el.scrollTop
    );
    expect(scrollTop).toBeGreaterThan(0);
  }

  async getJsonSchemaTextareaHeight(): Promise<number> {
    const box = await this.jsonSchemaTextarea.boundingBox();
    return box!.height;
  }

  async resizeJsonSchemaTextarea(deltaY: number) {
    await this.jsonSchemaTextarea.evaluate((el: HTMLElement, dy: number) => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.resize === 'none') {
        throw new Error('Textarea resize is disabled');
      }
      el.style.height = `${el.offsetHeight + dy}px`;
    }, deltaY);
  }

  async openBuildVisually() {
    await this.buildVisuallyButton.click();
  }

  async expectJsonSchemaBuilderVisible() {
    await expect(this.jsonSchemaNameInput).toBeVisible();
    await expect(this.jsonSchemaAddPropertyButton).toBeVisible();
    await expect(this.jsonSchemaBuilder).toBeVisible();
    await expect(this.jsonSchemaSaveButton).toBeVisible();
    await expect(this.jsonSchemaCloseButton).toBeVisible();
  }

  async addJsonSchemaProperty() {
    await this.jsonSchemaAddPropertyButton.click({ force: true });
  }

  async expectNewJsonSchemaPropertyVisible() {
    await expect(this.jsonSchemaBuilder.getByText('Required')).toBeVisible();
    await expect(this.schemaPropTypeSelectNew0).toBeVisible();
    await expect(this.schemaPropDeleteButtonNew0).toBeVisible();
    await expect(this.schemaPropDescriptionTextareaNew0).toBeVisible();
  }

  async fillNewJsonSchemaPropertyDescription(text: string) {
    await this.schemaPropDescriptionTextareaNew0.click();
    await this.schemaPropDescriptionTextareaNew0.fill(text);
  }

  async saveJsonSchemaBuilder() {
    await this.jsonSchemaSaveButton.click();
  }

  async expectJsonSchemaSavedSuccessfully() {
    await expect(
      this.page.getByRole('alert').filter({ hasText: 'JSON Schema saved successfully' })
    ).toBeVisible();
  }

  async clickJsonSchemaFullscreen() {
    await this.jsonSchemaFullscreenButton.click();
  }

  async clickJsonSchemaSaveAndClose() {
    await this.jsonSchemaSaveAndCloseButton.click();
  }

  async clickJsonSchemaFullscreenTextarea() {
    await this.jsonSchemaFullscreenTextarea.click();
  }

  async fillJsonSchemaFullscreenTextarea(text: string) {
    await this.jsonSchemaFullscreenTextarea.fill(text);
  }

  // --- Dynamic JSON Schema Property methods ---

  async fillSchemaName(name: string) {
    await this.jsonSchemaNameInput.clear();
    await this.jsonSchemaNameInput.fill(name);
  }

  async getSchemaNameValue(): Promise<string> {
    return this.jsonSchemaNameInput.inputValue();
  }

  async expectNoPropertiesMessage() {
    await expect(
      this.jsonSchemaBuilder.getByText('No properties available. Click the "+ Add Property" button above to add your first property.')
    ).toBeVisible();
  }

  getPropertyNameInput(path: string): Locator {
    return this.page.getByTestId(`schema-prop-name-input-${path}`);
  }

  getPropertyRequiredCheckbox(path: string): Locator {
    return this.page.getByTestId(`schema-prop-required-checkbox-${path}`);
  }

  getPropertyTypeSelect(path: string): Locator {
    return this.page.getByTestId(`schema-prop-type-select-${path}`);
  }

  getPropertyDeleteButton(path: string): Locator {
    return this.page.getByTestId(`schema-prop-delete-button-${path}`);
  }

  getPropertyDescriptionTextarea(path: string): Locator {
    return this.page.getByTestId(`schema-prop-description-textarea-${path}`);
  }

  getPropertyExpandButton(path: string): Locator {
    return this.page.locator(`#schema-prop-expand-button-${path}`);
  }

  getPropertyAddChildButton(path: string): Locator {
    return this.page.locator(`#schema-prop-add-property-button-${path}`);
  }

  async fillPropertyName(path: string, name: string) {
    const input = this.getPropertyNameInput(path);
    await input.clear();
    await input.fill(name);
    await this.page.keyboard.press('Tab');
    await expect(this.getPropertyNameInput(name)).toBeVisible();
  }

  async togglePropertyRequired(path: string) {
    await expect(async () => {
      const checkbox = this.getPropertyRequiredCheckbox(path);
      await checkbox.waitFor({ state: 'visible' });
      await checkbox.check();
    }).toPass({ timeout: 15000 });
  }

  async selectPropertyType(path: string, type: string) {
    await this.getPropertyTypeSelect(path).selectOption(type);
  }

  async fillPropertyDescription(path: string, text: string) {
    const textarea = this.getPropertyDescriptionTextarea(path);
    await textarea.click();
    await textarea.fill(text);
  }

  async deleteProperty(path: string) {
    await this.getPropertyDeleteButton(path).click();
  }

  async expectPropertyVisible(path: string) {
    await expect(this.getPropertyNameInput(path)).toBeVisible();
  }

  async expectPropertyNotVisible(path: string) {
    await expect(this.getPropertyNameInput(path)).not.toBeVisible();
  }

  async clickObjectAddChildProperty(path: string) {
    const childPath = `${path}.new0`;
    await expect(async () => {
      if (!(await this.getPropertyNameInput(childPath).isVisible())) {
        await this.getPropertyAddChildButton(path).click({ force: true });
      }
      await expect(this.getPropertyNameInput(childPath)).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 30000 });
  }

  async expectObjectAddChildPropertyVisible(path: string) {
    await expect(this.getPropertyAddChildButton(path)).toBeVisible();
  }

  async togglePropertyExpand(path: string) {
    await this.getPropertyExpandButton(path).click();
  }

  async expectPropertyExpandButtonVisible(path: string) {
    await expect(this.getPropertyExpandButton(path)).toBeVisible();
  }

  //deleteVariable
  async deleteVariable(index: number) {
    const btn = this.variableSlider.locator(`#variable-delete-button-${index}`);
    await btn.dispatchEvent('click');
  }

  async openInstructionsSection() {
    await this.instructionsSection.click();
  }

  async openVariableManager() {
    await this.manageVariablesButton.click();
  }

  async closeVariableManager() {
    await this.variableSlider.locator('#variable-slider-bulk-edit-button').first().click();
  }

  async expectVariableSliderVisible() {
    await expect(this.variableSlider).toBeVisible();
  }

  async expectVariableKeyInputVisible(index: number) {
    await expect(
      this.page.locator(`#variable-key-input-${index}`)
    ).toBeVisible();
  }

  async expectVariableKeyWithValueVisible(value: string) {
    await expect(
      this.page.locator(`[id^="variable-key-input-"][value="${value}"]`).first()
    ).toBeVisible();
  }

  async expectVariableKeyWithValueNotVisible(value: string) {
    await expect(
      this.page.locator(`[id^="variable-key-input-"][value="${value}"]`)
    ).toHaveCount(0);
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
    try {
      await expect(this.promptTextarea).toBeVisible({ timeout: 5000 });
      return await this.promptTextarea.inputValue();
    } catch {
      await expect(this.instructions).toBeVisible({ timeout: 15000 });
      return await this.instructions.inputValue();
    }
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
    const preToolItem = this.preEmbedFunctionsContainer
      .locator('[data-testid^="render-embed-item-"]')
      .first();

    if (!(await preToolItem.isVisible())) return;

    await preToolItem.hover();

    const removeButton = preToolItem
      .locator('[data-testid^="render-embed-delete-button-"]')
      .first();

    await expect(removeButton).toBeVisible();
    await removeButton.click();

    await expect(this.deleteModal).toBeVisible();
    await this.deleteModal.click();
  }

  async closeViaSocketEmbedIfOpen() {
    const viaSocketContainer = this.page.locator('#iframe-viasocket-embed-parent-container');
    const closeButton = this.page.locator('#viasocket-embed-close-button');

    if (await viaSocketContainer.isVisible()) {
      await expect(closeButton).toBeVisible({ timeout: 10000 });
      await closeButton.click();
    }
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async addPreToolClick() {
    const input = this.page.getByTestId('embed-suggestion-search-input');

    await this.addPreTool.click();

    await expect(input).toBeVisible();
    await input.focus();
    await lockDaisyDropdown(this.page, 'embed-suggestion-dropdown-menu');

    // Confirm dropdown menu is stable before proceeding
    await expect(this.page.getByTestId('embed-suggestion-dropdown-menu')).toBeVisible();

    // retry-safe focus — use focus() to avoid blur side-effects from click()
    await expect(async () => {
      await input.focus();
      await expect(input).toBeFocused();
    }).toPass();
  }

  private getViaSocketFrame(): FrameLocator {
    return this.page.frameLocator('#iframe-viasocket-embed-parent-container iframe');
  }

  async waitForViaSocketContainerVisible() {
    const viaSocketContainer = this.page.locator('#iframe-viasocket-embed-parent-container');
    await expect(viaSocketContainer).toBeVisible({ timeout: 60000 });
  }

  async clickCustomLogicToolCard() {
    const viaSocketFrame = this.getViaSocketFrame();
    const customLogicButton = viaSocketFrame
      .locator('div.MuiCard-root:has(p.MuiTypography-root:has-text("Custom Logic (JS)")) button.MuiCardActionArea-root')
      .first();

    await expect(customLogicButton).toBeVisible({ timeout: 60000 });
    await customLogicButton.click();
  }

  async clickCustomLogicCodeButton() {
    const viaSocketFrame = this.getViaSocketFrame();
    await viaSocketFrame.getByRole('button', { name: 'Code', exact: true }).click();
  }

  async fillCustomLogicCode(code: string) {
    const viaSocketFrame = this.getViaSocketFrame();
    const codeAccordion = viaSocketFrame.getByTestId('code-accordion');
    await expect(codeAccordion).toBeVisible({ timeout: 30000 });

    const codeEditor = codeAccordion
      .locator('textarea, [contenteditable="true"], .cm-content')
      .first();
    await codeEditor.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.type(code);
  }

  async saveCustomLogicPreTool() {
    const viaSocketFrame = this.getViaSocketFrame();
    await viaSocketFrame.getByRole('button', { name: 'Save', exact: true }).click();
  }

  async getCustomLogicFlowTitle(): Promise<string> {
    const viaSocketFrame = this.getViaSocketFrame();
    const flowTitle = await viaSocketFrame.locator('#flow-title-textfield').inputValue();
    return flowTitle.trim();
  }

  async createCustomLogicPreToolAndGetFlowTitle(code: string): Promise<string> {
    await this.waitForViaSocketContainerVisible();
    await this.clickCustomLogicToolCard();
    await this.clickCustomLogicCodeButton();
    await this.fillCustomLogicCode(code);
    await this.saveCustomLogicPreTool();

    return this.getCustomLogicFlowTitle();
  }

  async expectPreToolContainerVisible() {
    await expect(this.preEmbedFunctionsContainer).toBeVisible();
  }

  async expectPreToolAddedByName(name: string) {
    await expect(this.preEmbedFunctionsContainer).toContainText(name);
    console.log("container", await this.preEmbedFunctionsContainer.textContent());
  }

  async isPreToolDeleteButtonVisible(): Promise<boolean> {
    return this.deleteButton.isVisible();
  }

  async hasPreTool(): Promise<boolean> {
    const items = this.preEmbedFunctionsContainer
      .locator('[data-testid^="render-embed-item-"]');
    return (await items.count()) > 0;
  }

  async closeQueryRefinerConfigModalIfVisible() {
    if (await this.queryRefinerConfigModal.isVisible()) {
      await this.queryRefinerConfigModal.close();
    }
  }

  async fillQueryRefinerPrompt(text: string) {
    await this.queryRefinerConfigModal.fillRefinementPrompt(text);
  }

  async expectQueryRefinerSaveButtonEnabled() {
    await this.queryRefinerConfigModal.isSaveButtonEnabled();
  }

  async isQueryRefinerConfigModalVisible() {
    await this.queryRefinerConfigModal.isQueryRefinerConfigModalVisible();
  }

  async expectPreToolContainerNotVisible() {
    await expect(this.preEmbedFunctionsContainer).not.toBeVisible();
  }

  async openPreToolConfig() {
    const preToolItem = this.preEmbedFunctionsContainer
      .locator('[data-testid^="render-embed-item-"]')
      .first();
    await preToolItem.hover();
    await preToolItem.getByTitle('Config').click();
  }

  async searchAndSelectKnowledgeBase(name: string) {
    await this.queryRefinerConfigModal.searchAndSelectKnowledgeBase(name);
  }

  async expectKnowledgeBaseSelected(name: string) {
    await this.queryRefinerConfigModal.expectKnowledgeBaseSelected(name);
  }

  async expectRagSaveButtonEnabled() {
    await this.queryRefinerConfigModal.isSaveButtonEnabled();
  }

  async closeRagConfigModalIfVisible() {
    if (await this.queryRefinerConfigModal.isVisible()) {
      await this.queryRefinerConfigModal.close();
    }
  }

  async fillWebSearchUrl(url: string) {
    await this.queryRefinerConfigModal.fillUrl(url);
  }

  async checkWebSearchOutputFormat(format: string) {
    await this.queryRefinerConfigModal.checkOutputFormat(format);
  }

  async expectWebSearchSaveButtonEnabled() {
    await this.queryRefinerConfigModal.isSaveButtonEnabled();
  }

  async closeWebSearchConfigModalIfVisible() {
    if (await this.queryRefinerConfigModal.isVisible()) {
      await this.queryRefinerConfigModal.close();
    }
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
    await this.page.keyboard.press('Tab');
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

  async expectPromptFieldsDisabled() {
    await expect(this.role).toBeDisabled();
    await expect(this.goal).toBeDisabled();
    await expect(this.instructions).toBeDisabled();
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
    await expect(this.agentSetupCard).toBeVisible({ timeout: 5000 });
  }

  async expectAgentSetupGuideNotVisible() {
    await expect(this.agentSetupCard).not.toBeVisible({ timeout: 5000 });
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

  async closeJsonSchemaBuilder() {
    await expect(this.jsonSchemaCloseButton).toBeVisible();
    await this.jsonSchemaCloseButton.click();
  }

  async closeBuildWithAI() {
    await expect(this.buildWithAiCloseButton).toBeVisible();
    await this.buildWithAiCloseButton.click();
  }

  async expectBuildWithAIScrollable() {
    const messagesPanel = this.page.locator('#json-schema-modal-container #messages');
    const isScrollable = await messagesPanel.evaluate(
      (el: HTMLElement) => el.scrollHeight > el.clientHeight
    );
    expect(isScrollable).toBe(true);
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