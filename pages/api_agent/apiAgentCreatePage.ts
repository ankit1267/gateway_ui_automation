import { Page, expect } from '@playwright/test';
import { ApiAgentCreateSelectors } from '../../selectors/api_agent/apiAgent.selectors';
import { WORKSPACE_NAME } from '../../utils/env';

export class ApiAgentCreatePage {
  constructor(private page: Page) {}

  async openCreateAgent() {
    await this.page.getByText(WORKSPACE_NAME, { exact: true }).click();
    await this.page.getByRole('button', { name: '+ Create New API Agent' }).click();
  }

  async createAgentWithPurpose(purpose?: string) {
    const sidebar = this.page.locator(
      ApiAgentCreateSelectors.sidebar
    );

    if (purpose) {
      await sidebar
        .getByRole('textbox', {
          name: 'Agent purpose description',
        })
        .fill(purpose);
    }

    await sidebar
      .getByRole('button', { name: 'Create Agent' })
      .click();
  }

  async getSystemPromptValue() {
    // fallback until test-id exists
    const textarea = this.page.locator('textarea').nth(4);
    await textarea.click();
    return textarea.inputValue();
  }

  async expectSystemPromptNotEmpty() {
    const value = await this.getSystemPromptValue();
    expect(value.trim().length).toBeGreaterThan(0);
  }

  // -------------------------
  // DELETE AGENT  ✅ NEW
  // -------------------------
  async deleteAgent() {
    // switch to API mode (required before delete)
    await this.page
      .locator(ApiAgentCreateSelectors.apiToggleButton)
      .click();

    await this.page
      .getByRole('button', { name: 'API', exact: true })
      .click();

    await this.page
    .locator('div[role="button"] svg.rotate-90')
    .first()
    .locator('..')
    .click();
    // open delete flow
    await this.page
      .getByRole('button', { name: 'Delete Agent' })
      .click();

    await this.page
      .getByRole('button', { name: 'Delete' })
      .click();
  }
  async deleteAgentByName(agentName: string) {
  // Switch to API mode
  await this.page
    .locator(ApiAgentCreateSelectors.apiToggleButton)
    .waitFor({ state: 'visible' });
  await this.page
    .locator(ApiAgentCreateSelectors.apiToggleButton)
    .click();

  await this.page
    .getByRole('button', { name: 'API', exact: true })
    .click();

  // Locate agent row by name
  const agentRow = this.page
    .getByRole('row')
    .filter({ hasText: agentName });

  await agentRow.waitFor({ state: 'visible' });

  // Open action menu inside that row
  await agentRow.getByRole('button').last().click();

   await this.page
    .locator('div[role="button"] svg.rotate-90')
    .first()
    .locator('..')
    .click();

  // Delete flow
  await this.page
    .getByRole('button', { name: 'Delete Agent' })
    .click();

  await this.page
    .getByRole('button', { name: 'Delete' })
    .click();

}

}
