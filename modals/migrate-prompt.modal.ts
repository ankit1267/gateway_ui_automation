import type { Page, Locator } from '@playwright/test';

export class MigratePromptModal {
  private readonly modal: Locator;
  private readonly roleField: Locator;
  private readonly goalField: Locator;
  private readonly instructionField: Locator;
  private readonly migrateAndSaveButton: Locator;
  private readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('MIGRATE_PROMPT_WARNING_MODAL');
    this.roleField = this.modal.getByRole('textbox', { name: 'e.g. You are a helpful customer support assistant' });
    this.goalField = this.modal.getByRole('textbox', { name: 'e.g. Help users resolve their issues quickly and accurately' });
    this.instructionField = this.modal.getByRole('textbox', { name: 'e.g. Always be polite. Ask clarifying questions if needed...' });
    this.migrateAndSaveButton = this.modal.getByRole('button', { name: 'Migrate & Save' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  getModal(): Locator {
    return this.modal;
  }

  async fillRole(role: string) {
    await this.roleField.fill(role);
  }

  async fillGoal(goal: string) {
    await this.goalField.fill(goal);
  }

  async fillInstruction(instruction: string) {
    await this.instructionField.fill(instruction);
  }

  async clickMigrateAndSave() {
    await this.migrateAndSaveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async migratePrompt(role: string, goal: string, instruction: string) {
    await this.fillRole(role);
    await this.fillGoal(goal);
    await this.fillInstruction(instruction);
    await this.clickMigrateAndSave();
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async getRoleValue(): Promise<string> {
    return this.roleField.inputValue();
  }

  async getGoalValue(): Promise<string> {
    return this.goalField.inputValue();
  }

  async getInstructionValue(): Promise<string> {
    return this.instructionField.inputValue();
  }

  async clearAllFields() {
    await this.roleField.clear();
    await this.goalField.clear();
    await this.instructionField.clear();
  }
}
