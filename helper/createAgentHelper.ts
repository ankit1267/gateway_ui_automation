import { Page, expect } from '@playwright/test';
// import { WORKSPACE_NAME } from '../utils/env';

/**
 * Helper for Chatbot Agent
 * - create chatbot agent
 * - validate editor loaded
 * - delete chatbot agent
 */
export class ChatbotAgentHelper {
  constructor(private page: Page) {}

  // -------------------------
  // CREATE CHATBOT AGENT
  // -------------------------
  async createAgent() {
    // // Open workspace
    // await this.page.getByText(WORKSPACE_NAME, { exact: true }).click();

    // Open chatbot agent list
    await this.page.goto('/agents?type=chatbot');

    // Open create agent sidebar
    await this.page
      .getByRole('button', { name: '+ Create New Chatbot Agent' })
      .click();

    await this.page
      .locator('#default-agent-sidebar')
      .getByRole('button', { name: 'Create Agent' })
      .click();

    // Ensure chatbot editor is loaded
    await expect(
      this.page.getByText('System Prompt')
    ).toBeVisible();
  }

  // -------------------------
  // BASIC ASSERTION (OPTIONAL)
  // -------------------------
  async expectEditorLoaded() {
    await expect(
      this.page.getByText('System Prompt')
    ).toBeVisible();
  }

  // -------------------------
  // DELETE CHATBOT AGENT
  // -------------------------
  async deleteAgent() {
    // Open kebab / more options
    await this.page
      .locator('div[role="button"] svg.rotate-90')
      .first()
      .locator('..')
      .click();

    // Click Delete Agent
    await this.page
      .getByRole('button', { name: 'Delete Agent' })
      .click();

    // Confirm delete
    await this.page
      .getByRole('button', { name: 'Delete' })
      .click();

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
