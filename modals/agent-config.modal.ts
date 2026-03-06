import type { Page, Locator } from '@playwright/test';

export class AgentConfigModal {

  private readonly modal: Locator;
  private readonly saveButton: Locator;
  private readonly closeButton: Locator;
  private readonly parameterButton: Locator;
  private readonly parameterNameInput: Locator;

  constructor(private readonly page: Page) {
    this.modal = this.page.getByTestId('AGENT_VARIABLE_MODAL');
    this.saveButton = this.modal.locator('#function-param-save-button');
    this.closeButton = this.modal.locator('#function-param-close-button');
    this.parameterButton = this.modal.locator('#function-param-add-param-button')
    this.parameterNameInput = this.modal.getByTestId('param-name-input-new0');
  }

  async addVariable(name: string) {
    await this.parameterButton.click();
    await this.parameterNameInput.fill(name);
  }

  async save() {
    await this.saveButton.click();
  }
  async close() {
    await this.closeButton.click();
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
    await this.modal.getByTestId(`param-value-path-input-${paramName}`).fill(path);
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
}