import type { Page, Locator } from '@playwright/test';

export class AddNewModelModal {
  private readonly modal: Locator;
  private readonly container: Locator;
  private readonly resetButton: Locator;
  private readonly serviceSelect: Locator;
  private readonly modelNameInput: Locator;
  private readonly displayNameInput: Locator;
  private readonly visionCheckbox: Locator;
  private readonly toolsCheckbox: Locator;
  private readonly systemPromptCheckbox: Locator;
  private readonly typeSelect: Locator;
  private readonly inputCostInput: Locator;
  private readonly outputCostInput: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('ADD_NEW_MODEL_MODAL');
    this.container = page.locator('#add-new-model-modal-container');
    this.resetButton = page.getByTestId('add-model-reset-button');
    this.serviceSelect = page.getByTestId('add-model-service-select');
    this.modelNameInput = page.getByTestId('add-model-name-input');
    this.displayNameInput = page.getByTestId('add-model-display-name-input');
    this.visionCheckbox = page.getByTestId('add-model-vision-checkbox');
    this.toolsCheckbox = page.getByTestId('add-model-tools-checkbox');
    this.systemPromptCheckbox = page.getByTestId('add-model-system-prompt-checkbox');
    this.typeSelect = page.getByTestId('add-model-type-select');
    this.inputCostInput = page.getByTestId('add-model-input-cost-input');
    this.outputCostInput = page.getByTestId('add-model-output-cost-input');
  }

  async selectService(service: string) {
    await this.serviceSelect.selectOption(service);
  }

  async fillModelName(name: string) {
    await this.modelNameInput.fill(name);
  }

  async fillDisplayName(name: string) {
    await this.displayNameInput.fill(name);
  }

  async toggleVision() {
    await this.visionCheckbox.click();
  }

  async toggleTools() {
    await this.toolsCheckbox.click();
  }

  async toggleSystemPrompt() {
    await this.systemPromptCheckbox.click();
  }

  async selectType(type: string) {
    await this.typeSelect.selectOption(type);
  }

  async fillInputCost(cost: string) {
    await this.inputCostInput.fill(cost);
  }

  async fillOutputCost(cost: string) {
    await this.outputCostInput.fill(cost);
  }

  async clickReset() {
    await this.resetButton.click();
  }

  getModal(): Locator {
    return this.modal;
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async getModelNameValue(): Promise<string> {
    return this.modelNameInput.inputValue();
  }

  async getDisplayNameValue(): Promise<string> {
    return this.displayNameInput.inputValue();
  }

  async getInputCostValue(): Promise<string> {
    return this.inputCostInput.inputValue();
  }

  async getOutputCostValue(): Promise<string> {
    return this.outputCostInput.inputValue();
  }

  async isVisionChecked(): Promise<boolean> {
    return this.visionCheckbox.isChecked();
  }

  async isToolsChecked(): Promise<boolean> {
    return this.toolsCheckbox.isChecked();
  }

  async isSystemPromptChecked(): Promise<boolean> {
    return this.systemPromptCheckbox.isChecked();
  }

  async clearModelName() {
    await this.modelNameInput.clear();
  }

  async clearDisplayName() {
    await this.displayNameInput.clear();
  }

  getContainer(): Locator {
    return this.container;
  }

  async addModel(options: {
    service: string;
    modelName: string;
    displayName?: string;
    type?: string;
    inputCost?: string;
    outputCost?: string;
    vision?: boolean;
    tools?: boolean;
    systemPrompt?: boolean;
  }) {
    await this.selectService(options.service);
    await this.fillModelName(options.modelName);
    if (options.displayName) await this.fillDisplayName(options.displayName);
    if (options.type) await this.selectType(options.type);
    if (options.inputCost) await this.fillInputCost(options.inputCost);
    if (options.outputCost) await this.fillOutputCost(options.outputCost);
    if (options.vision) await this.toggleVision();
    if (options.tools) await this.toggleTools();
    if (options.systemPrompt) await this.toggleSystemPrompt();
  }
}
