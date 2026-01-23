import { Page, expect, Locator } from '@playwright/test';
import { ChatbotAgentCreateSelectors as S } from '../selectors/chatbotAgent.selectors';

export class ChatbotAgentPage {
  constructor(private page: Page) {}

  // -------------------------
  // OPEN CREATE CHATBOT AGENT
  // -------------------------
  async openCreateChatbotAgent() {
    await this.page.goto('/org/57294/agents');

    // Select workspace (My space)
    await this.page.locator(S.mySpace).click();

    // Switch to chatbot mode
    await this.page.locator(S.chatbotModeButton).click();

    // Click create chatbot agent
    await this.page.locator(S.createAgentButton).click();

    // Click Create Agent in sidebar
    await this.page
      .locator(S.sidebar)
      .locator(S.createButton)
      .click();

    // Open agent name edit mode
    await this.page.locator('.lucide.lucide-pen').first().click();
  }

  // -------------------------
  // AGENT NAME INPUT
  // -------------------------
  agentNameInput(): Locator {
    // fragile locator intentionally encapsulated
    return this.page.locator('input[type="text"]').nth(3);
  }

  // -------------------------
  // SET AGENT NAME
  // -------------------------
  async setAgentName(name: string) {
    const input = this.agentNameInput();
    await input.fill(name);
    await input.press('Enter');
  }

  // -------------------------
  // ASSERTIONS
  // -------------------------
  async expectEmptyNameError() {
    await expect(
      this.page.getByText('Agent name cannot be empty')
    ).toBeVisible({ timeout: 10_000 });
  }

  async expectInvalidCharactersError() {
    await expect(
      this.page.getByText(
        'Agent name can only contain letters, numbers, spaces, hyphens, and underscores'
      )
    ).toBeVisible();
  }

  // -------------------------
  // DELETE CHATBOT AGENT
  // -------------------------
  async deleteAgent() {
    // Open agent menu (kebab)
    await this.page.locator(S.agentMenuButton).first().click();

    // Click delete
    await this.page.locator(S.deleteAgentButton).click();

    // Confirm delete
    await this.page.locator(S.deleteConfirmButton).click();

    // Ensure redirect back to chatbot list
    await this.page.waitForURL(/agents\?type=chatbot/);
  }

  // -------------------------
  // SAFE CLEANUP
  // -------------------------
  async safeDelete() {
    try {
      await this.deleteAgent();
    } catch (err) {
      console.warn('⚠️ Chatbot agent cleanup failed or already deleted');
    }
  }
}
