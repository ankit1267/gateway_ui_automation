import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { AgentPage } from '../agent/agent.page';
import { Sidebar } from '../../components/sidebar/sidebar.component';
import { KnowledgeBasePage } from './knowledge-base.page';

export class AgentsPage {
  private readonly agentTable: Locator;
  private readonly createAgentButton: Locator;
  private readonly usageFilterButton: Locator;
  private readonly createAgentModal: Locator;
  private readonly createAgentSubmitButton: Locator;
  readonly sidebar: Sidebar;
  readonly knowledgeBasePage: KnowledgeBasePage;

  constructor(private page: Page) {
    this.agentTable = this.page.getByTestId('custom-table-view');
    this.createAgentButton = this.page.getByTestId('create-new-agent-button');
    this.usageFilterButton = this.page.getByRole('button', { name: 'Usage Filter' });
    this.createAgentModal = this.page.locator('#default-agent-sidebar');
    this.createAgentSubmitButton = this.createAgentModal.getByTestId('create-new-bridge-submit-button');
    this.sidebar = new Sidebar(page);
    this.knowledgeBasePage = new KnowledgeBasePage(page);
  }

  async goto(type?: 'chatbot' | 'api') {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');

    let url = `/org/${orgId}/agents`;
    if (type) {
      url += `?type=${type}`;
    }
    await this.page.goto(url);
  }

  async search() {

  }



  async openAgent(agentName: string): Promise<AgentPage> {
    await this.agentTable
      .getByText(agentName, { exact: true })
      .click();

    return new AgentPage(this.page);
  }

  async clickCreateNewAgent() {
    await this.createAgentButton.click();
  }

  async clickCreateNewAgentSubmit(): Promise<AgentPage> {
    await this.createAgentSubmitButton.click();
    return new AgentPage(this.page);
  }

  async blurInput() {
    await this.page.locator('body').click();
  }

  async deleteAgentByName(agentName: string) {
    const agentRow = this.agentTable
      .filter({ hasText: agentName })
      .first();

    await expect(agentRow).toBeVisible();

    const rowMenuBtn = agentRow.getByRole('button').last();
    await rowMenuBtn.click();

    const deleteAgentBtn = this.page.getByRole('button', {
      name: 'Delete Agent'
    });

    await expect(deleteAgentBtn).toBeVisible(); // auto-waits
    await deleteAgentBtn.click();

    const confirmDeleteBtn = this.page.getByRole('button', {
      name: 'Delete'
    });

    await expect(confirmDeleteBtn).toBeVisible();
    await confirmDeleteBtn.click();

  }

  async openKnowledgeBasePanel() {
    await this.page.getByRole('button', { name: 'Knowledge base' }).click();
  }

}