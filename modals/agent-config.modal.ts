import type { Page, Locator } from '@playwright/test';

export class AgentConfigModal {

  private readonly modal: Locator;
  private readonly saveButton: Locator;
  private readonly closeButton: Locator;
  private readonly parameterButton: Locator;
  private readonly parameterNameInput: Locator;

  constructor(private readonly page: Page) {
    this.modal = this.page.getByTestId('AGENT_VARIABLE_MODAL');
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
    this.closeButton = this.modal.getByRole('button', { name: 'Close' });
    this.parameterButton = this.modal.getByRole('button', { name: 'Parameter', exact: true })
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
}