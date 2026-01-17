import { Page, expect } from '@playwright/test';

export class AgentsPage {
  constructor(private page: Page) {}

  async open(orgId: string) {
    await this.page.goto(
      `https://app.gtwy.ai/org/${orgId}/agents`,
      { waitUntil: 'networkidle' }
    );
  }

  async createNewChatbot() {
    await this.page.getByRole('button', { name: 'Chatbot', exact: true }).click();
    await this.page.getByRole('button', { name: '+ Create New Chatbot Agent' }).click();
  }
}
