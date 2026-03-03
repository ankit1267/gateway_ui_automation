import type { Page, Locator } from '@playwright/test';

export class JsonSchemaBuilderModal {
  readonly page: Page;
  readonly schemaNameInput: Locator;
  readonly addPropertyButton: Locator;
  readonly closeButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.schemaNameInput = page.getByTestId('json-schema-name-input');
    this.addPropertyButton = page.getByTestId('json-schema-builder-add-property-button');
    this.closeButton = page.getByTestId('json-schema-builder-close-button');
    this.saveButton = page.getByTestId('json-schema-builder-save-button');
  }

  async isVisible(): Promise<boolean> {
    return this.schemaNameInput.isVisible();
  }

  async fillSchemaName(name: string) {
    await this.schemaNameInput.fill(name);
  }

  async getSchemaNameValue(): Promise<string> {
    return this.schemaNameInput.inputValue();
  }

  async clearSchemaName() {
    await this.schemaNameInput.clear();
  }

  async clickAddProperty() {
    await this.addPropertyButton.click();
  }

  async close() {
    await this.closeButton.click();
  }

  async save() {
    await this.saveButton.click();
  }

  // --- Property fields by path ---

  getPropertyNameInput(path: string): Locator {
    return this.page.getByTestId(`schema-prop-name-input-${path}`);
  }

  getPropertyTypeSelect(path: string): Locator {
    return this.page.getByTestId(`schema-prop-type-select-${path}`);
  }

  getPropertyRequiredCheckbox(path: string): Locator {
    return this.page.getByTestId(`schema-prop-required-checkbox-${path}`);
  }

  getPropertyDescriptionTextarea(path: string): Locator {
    return this.page.getByTestId(`schema-prop-description-textarea-${path}`);
  }

  getPropertyDeleteButton(path: string): Locator {
    return this.page.getByTestId(`schema-prop-delete-button-${path}`);
  }

  async fillPropertyName(path: string, name: string) {
    await this.getPropertyNameInput(path).fill(name);
  }

  async selectPropertyType(path: string, type: string) {
    await this.getPropertyTypeSelect(path).selectOption(type);
  }

  async checkPropertyRequired(path: string) {
    await this.getPropertyRequiredCheckbox(path).check();
  }

  async uncheckPropertyRequired(path: string) {
    await this.getPropertyRequiredCheckbox(path).uncheck();
  }

  async fillPropertyDescription(path: string, description: string) {
    await this.getPropertyDescriptionTextarea(path).fill(description);
  }

  async deleteProperty(path: string) {
    await this.getPropertyDeleteButton(path).click();
  }
}
