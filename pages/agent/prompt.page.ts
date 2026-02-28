import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class PromptPage {
  private readonly page: Page;
  private readonly role: Locator;
  private readonly goal: Locator;
  private readonly instructions: Locator;
  private readonly agentSetupCard: Locator;
  private readonly diffButton: Locator;
  private readonly diffModal: Locator;


  constructor(page: Page) {
    this.page = page;
    this.role = page.getByRole('textbox', { name: 'e.g. You are a helpful customer support agent' });
    this.goal = page.getByRole('textbox', { name: 'e.g. Help users resolve billing issues' });
    this.instructions = page.getByRole('textbox', { name: 'e.g. Always be polite. Never' });
    this.agentSetupCard = page.getByTestId('agent-setup-guide-container');
    this.diffButton = page.getByTestId('prompt-header-diff-button');
    this.diffModal = page.getByTestId('DIFF_PROMPT');

  }

  async diffModalVisible() {
    await expect(this.diffModal).toBeVisible();
  }

  async diffButtonClick() {
    await this.diffButton.click();
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