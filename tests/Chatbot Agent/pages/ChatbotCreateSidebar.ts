import { Page, expect } from '@playwright/test';

export class ChatbotCreateSidebar {
  constructor(private page: Page) {}

  async fillPurpose(purpose: string) {
    const input = this.page
      .locator('#default-agent-sidebar')
      .getByRole('textbox', { name: 'Agent purpose description' });

    await input.waitFor({ state: 'visible' });
    await input.fill(purpose);
  }

  async submit() {
    await this.page
      .locator('#default-agent-sidebar')
      .getByRole('button', { name: 'Create Agent' })
      .click();

    await this.page.waitForURL(/agents\/configure/, { timeout: 15000 });
  }
}
