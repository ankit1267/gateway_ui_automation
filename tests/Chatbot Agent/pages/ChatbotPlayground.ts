import { Page, expect, FrameLocator } from '@playwright/test';

export class ChatbotPlayground {
  private frame: FrameLocator;

  constructor(private page: Page) {
    this.frame = page.frameLocator('#iframe-component-interfaceEmbed');
  }

  async ask(question: string) {
    const input = this.frame.getByRole('textbox', {
      name: 'Message AI Assistant...',
    });

    await input.waitFor({ state: 'visible' });
    await input.fill(question);
    await input.press('Enter');
  }

  async expectAnswerContains(text: string) {
    await expect(
      this.frame.locator(`text=${text}`)
    ).toBeVisible({ timeout: 20000 });
  }
}
