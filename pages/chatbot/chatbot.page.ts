import { type Page, type Locator, type FrameLocator, expect } from '@playwright/test';

export class ChatbotPage {

  private readonly frame: FrameLocator;
  private readonly scrollable: Locator;
  private readonly newThreadButton: Locator;
  private readonly input: Locator;

  constructor(public readonly page: Page) {
    this.frame = this.page.locator('#iframe-component-interfaceEmbed').contentFrame();
    this.scrollable = this.frame.locator('#scrollableDiv');
    this.newThreadButton = this.frame.getByRole('button').nth(1);
    this.input = this.frame.getByRole('textbox', {
      name: 'Message AI Assistant...'
    });
  }

  async isHomeVisible(){
    return await this.frame
      .getByText('What can I help with?')
      .isVisible();
  }

  async buttonVisible() {
    await expect(this.newThreadButton).toBeVisible({ timeout: 40000 });
  }

  async openNewThread() {
    await this.buttonVisible();
    await this.newThreadButton.click();
  }

  async inputVisible() {
    await expect(this.input).toBeVisible();
  }

  async sendMessage(message: string) {
    await this.inputVisible();
    await this.input.fill(message);
    await this.input.press('Enter');
  }

  async expectResponse(message: string | RegExp) {
    await expect(this.scrollable.getByText(message)).toBeVisible({ timeout: 40000 });
  }
  async  expectText(message:string){
    await expect(this.scrollable)
    .toContainText(message, { timeout: 30000 });
  }

  async isCopyButtonVisible() {
    return await this.frame
      .getByRole('button', { name: 'Copy' })
      .isVisible();
  }


}
