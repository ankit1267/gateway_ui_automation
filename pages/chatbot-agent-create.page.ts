import { Page, expect, Locator } from '@playwright/test';
import { ChatbotAgentCreateSelectors as S } from '../selectors/chatbotAgent.selectors';

export class ChatbotAgentPage {
  constructor(private page: Page) { }

  // -------------------------
  // OPEN CREATE CHATBOT AGENT
  // -------------------------
  async openCreateChatbotAgent() {
    await this.page.goto('/org/57720/agents');

    // Select workspace (My space)
    // await this.page.locator(S.mySpace).click();

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
    await input.click();
    await input.fill(name);
    await input.press('Enter');
  }

  // -------------------------
  // ASSERTIONS
  // -------------------------
  async expectEmptyNameError() {
    await expect(
      this.page.getByText('Agent name cannot be empty')
    ).toBeVisible({ timeout: 100000 });
  }

  async expectInvalidCharactersError() {
    await expect(
      this.page.getByText(
        'Agent name can only contain letters, numbers, spaces, hyphens, and underscores'
      )
    ).toBeVisible();
  }

// -------------------------
// DELETE CHATBOT AGENT BY NAME
// -------------------------
async deleteAgentByName(agentName: string) {

  // Open main slider
  const sliderToggle = this.page.locator('#main-slider-toggle-button');
  await expect(sliderToggle).toBeVisible();
  await sliderToggle.click();

  // Switch to Chatbot section
  const chatbotBtn = this.page.getByRole('button', {
    name: 'Chatbot',
    exact: true
  });
  await expect(chatbotBtn).toBeVisible();
  await chatbotBtn.click();

  // Find agent row
  const agentRow = this.page.getByRole('row', {
    name: new RegExp(agentName)
  });
  await expect(agentRow).toBeVisible({ timeout: 15000 });

  // Open row actions (three dots)
  const rowMenuBtn = agentRow.getByRole('button').last();
  await expect(rowMenuBtn).toBeVisible();

  await rowMenuBtn.click();

  // Click Delete Agent
  const deleteAgentBtn = this.page.getByRole('button', {
    name: 'Delete Agent'
  });
  while(!(await deleteAgentBtn.isVisible())){
    await rowMenuBtn.click();
  }
  await expect(deleteAgentBtn).toBeVisible();
  await deleteAgentBtn.click();

  // Confirm delete
  const confirmDeleteBtn = this.page.getByRole('button', {
    name: 'Delete'
  });
  await expect(confirmDeleteBtn).toBeVisible();
  await confirmDeleteBtn.click();
}
 
}
