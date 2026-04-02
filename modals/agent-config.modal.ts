import type { Page, Locator } from '@playwright/test';

export class AgentConfigModal {

  private readonly modal: Locator;
  private readonly saveButton: Locator;
  private readonly closeButton: Locator;
  private readonly parameterButton: Locator;
  private readonly parameterNameInput: Locator;
  private readonly threadIdToggle: Locator;
  private readonly versionSelect: Locator;
  private readonly modeSelect: Locator;
  private readonly nameDescToggle: Locator;
  private readonly nameInput: Locator;
  private readonly descTextarea: Locator;
  private readonly jsonTextarea: Locator;

  constructor(private readonly page: Page) {
    this.modal = this.page.getByTestId('AGENT_VARIABLE_MODAL');
    this.saveButton = this.modal.locator('#function-param-save-button');
    this.closeButton = this.modal.locator('#function-param-close-button');
    this.parameterButton = this.modal.locator('#function-param-add-param-button')
    this.parameterNameInput = this.modal.getByTestId('param-name-input-new0');
    this.threadIdToggle = this.modal.locator('#function-param-thread-id-toggle');
    this.versionSelect = this.modal.locator('#function-param-version-select');
    this.modeSelect = this.modal.locator('#function-param-mode-select');
    this.nameDescToggle = this.modal.locator('#function-param-name-desc-toggle');
    this.nameInput = this.modal.locator('#function-param-name-input');
    this.descTextarea = this.modal.locator('#function-param-desc-textarea');
    this.jsonTextarea = this.modal.locator('#function-param-json-textarea');
  }

  async addVariable(name: string) {
    await this.parameterButton.click();
    await this.parameterNameInput.fill(name);
  }

  async save() {
    await this.saveButton.click();
  }
  async close() {
    await this.closeButton.click({ force: true });
  }
  async addParameter() {
    await this.parameterButton.click();
  }
  async fillParameterName(name: string) {
    await this.parameterNameInput.fill(name);
  }

  async setRequired(paramName: string) {
    await this.modal
      .getByTestId(`param-required-checkbox-${paramName}`)
      .check();
  }
  async selectType(paramName: string, type: string) {
    await this.modal.getByTestId(`param-type-select-${paramName}`).selectOption(type);
  }
  async fillValuePath(paramName: string, path: string) {
    const input = this.modal.getByTestId(`param-value-path-input-${paramName}`);
    await input.click();
    await input.pressSequentially(path);
    await input.blur();
  }
  async deleteParameter(paramName: string) {
    await this.modal.getByTestId(`param-delete-button-${paramName}`).click();
  }

  getParameterNameInput(paramName: string) {
    return this.modal.getByTestId(`param-name-input-${paramName}`);
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  getRequiredCheckbox(paramName: string): Locator {
    return this.modal.getByTestId(`param-required-checkbox-${paramName}`);
  }

  getTypeSelect(paramName: string): Locator {
    return this.modal.getByTestId(`param-type-select-${paramName}`);
  }

  getValuePathInput(paramName: string): Locator {
    return this.modal.getByTestId(`param-value-path-input-${paramName}`);
  }

  getDeleteButton(paramName: string): Locator {
    return this.modal.getByTestId(`param-delete-button-${paramName}`);
  }

  getModal(): Locator {
    return this.modal;
  }

  async addParameterWithDetails(name: string, type?: string, valuePath?: string, required?: boolean) {
    await this.addParameter();
    await this.fillParameterName(name);
    if (type) await this.selectType(name, type);
    if (valuePath) await this.fillValuePath(name, valuePath);
    if (required) await this.setRequired(name);
  }

  // --- Thread ID ---

  async toggleThreadId() {
    await this.threadIdToggle.click();
  }

  getThreadIdToggle(): Locator {
    return this.threadIdToggle;
  }

  // --- Version Select ---

  async selectVersion(value: string) {
    await this.versionSelect.selectOption(value);
  }

  getVersionSelect(): Locator {
    return this.versionSelect;
  }

  // --- Mode (Simple / Advanced) ---

  async switchToAdvancedMode() {
    await this.modeSelect.selectOption('advanced');
  }

  async switchToSimpleMode() {
    await this.modeSelect.selectOption('simple');
  }

  getModeSelect(): Locator {
    return this.modeSelect;
  }

  getJsonTextarea(): Locator {
    return this.jsonTextarea;
  }

  // --- Name & Description section ---

  async toggleNameDescription() {
    await this.nameDescToggle.click();
  }

  getNameDescToggle(): Locator {
    return this.nameDescToggle;
  }

  getNameInput(): Locator {
    return this.nameInput;
  }

  getDescTextarea(): Locator {
    return this.descTextarea;
  }

  async fillDescription(desc: string) {
    await this.descTextarea.fill(desc);
  }

  // --- Parameter Description ---

  async fillParameterDescription(paramName: string, description: string) {
    await this.modal.getByTestId(`param-description-textarea-${paramName}`).fill(description);
  }

  getParameterDescriptionTextarea(paramName: string): Locator {
    return this.modal.getByTestId(`param-description-textarea-${paramName}`);
  }

  // --- Fill with AI checkbox ---

  async toggleFillWithAI(paramName: string) {
    await this.modal.getByTestId(`param-fill-ai-checkbox-${paramName}`).click();
  }

  getFillWithAICheckbox(paramName: string): Locator {
    return this.modal.getByTestId(`param-fill-ai-checkbox-${paramName}`);
  }

  // --- Enum (Allowed Values) ---

  getEnumInput(paramName: string): Locator {
    return this.modal.getByTestId(`param-enum-input-${paramName}`);
  }

  getEnumCheckbox(paramName: string): Locator {
    return this.modal.locator(`#param-enum-checkbox-${paramName}`);
  }

  async toggleEnum(paramName: string) {
    await this.modal.locator(`#param-enum-checkbox-${paramName}`).click();
  }

  async fillEnum(paramName: string, value: string) {
    const input = this.modal.getByTestId(`param-enum-input-${paramName}`);
    await input.fill(value);
    await input.press('Enter');
  }

  // --- Object type: child properties ---

  async addChildProperty(paramName: string) {
    await this.modal.getByTestId(`param-add-property-button-${paramName}`).click();
  }

  async toggleExpandParameter(paramName: string) {
    await this.modal.getByTestId(`param-expand-button-${paramName}`).click();
  }

  getAddPropertyButton(paramName: string): Locator {
    return this.modal.getByTestId(`param-add-property-button-${paramName}`);
  }

  // --- Save button state ---

  getSaveButton(): Locator {
    return this.saveButton;
  }

  getCloseButton(): Locator {
    return this.closeButton;
  }

  getAddParameterButton(): Locator {
    return this.parameterButton;
  }

  // --- Unset required ---

  async unsetRequired(paramName: string) {
    await this.modal
      .getByTestId(`param-required-checkbox-${paramName}`)
      .uncheck();
  }
}