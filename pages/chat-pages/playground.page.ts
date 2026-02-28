import { type Page, type Locator, expect } from '@playwright/test';

export class PlaygroundPage {
  readonly page: Page;

  // Locators
  readonly messageTextarea: Locator;
  readonly strategySelect: Locator;
  readonly addTestCaseButton: Locator;
 

  constructor(page: Page) {
    this.page = page;
    this.messageTextarea = page.getByTestId('chat-message-textarea');
    this.strategySelect = page.getByTestId('chat-strategy-select');
    this.addTestCaseButton = page.getByTestId('chat-add-testcase-button');

  }

  async typeMessage(message: string) {
    await this.messageTextarea.fill(message);
    await this.page.keyboard.press('Enter');
  }

  async expectChatControlsVisible() {
    await expect(this.addTestCaseButton).toBeVisible();
    await expect(this.strategySelect).toBeVisible();
  }

  async expectChatControlsNotVisible() {
    await expect(this.addTestCaseButton).not.toBeVisible();
    await expect(this.strategySelect).not.toBeVisible();
  }

  async selectStrategy(strategy: 'cosine' | 'ai' | 'exact') {
    await this.page
      .getByTestId('chat-strategy-select')
      .selectOption(strategy);
  }

  async clickAddNewTestCase(){
    await this.addTestCaseButton.click();
  }

  async expectChatMessageVisible(i:number) {
    await expect(this.page.getByTestId(`chat-message-${i}`)).toBeVisible();
  }
}