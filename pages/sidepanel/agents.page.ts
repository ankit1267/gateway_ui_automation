import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { AgentPage } from '../agent/agent.page';
import { Sidebar } from '../../components/sidebar/sidebar.component';
import { KnowledgeBasePage } from './knowledge-base.page';
import { CreateNewBridgeModal } from '../../modals/create-new-bridge.modal';

export class AgentsPage {
  private readonly agentTable: Locator;
  private readonly customTable: Locator;
  private readonly customTableSelectAll: Locator;
  private readonly tableNoData: Locator;
  private readonly createAgentButton: Locator;
  private readonly usageFilterButton: Locator;
  private readonly emptyStateContainer: Locator;
  private readonly emptyStateCreateButton: Locator;
  private readonly emptyStateSpeakButton: Locator;
  readonly sidebar: Sidebar;
  readonly knowledgeBasePage: KnowledgeBasePage;
  readonly createAgentModal: CreateNewBridgeModal;

  constructor(private page: Page) {
    this.agentTable = this.page.getByTestId('custom-table-view');
    this.customTable = this.page.getByTestId('custom-table');
    this.customTableSelectAll = this.page.getByTestId('custom-table-select-all');
    this.tableNoData = this.page.getByTestId('table-no-data');
    this.createAgentButton = this.page.getByTestId('create-new-agent-button');
    this.usageFilterButton = this.page.getByRole('button', { name: 'Usage Filter' });
    this.emptyStateContainer = this.page.getByTestId('agent-empty-state-container');
    this.emptyStateCreateButton = this.page.getByTestId('agent-empty-create-agent-button');
    this.emptyStateSpeakButton = this.page.getByTestId('agent-empty-speak-to-us-button');
    this.sidebar = new Sidebar(page);
    this.knowledgeBasePage = new KnowledgeBasePage(page);
    this.createAgentModal = new CreateNewBridgeModal(page);
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
    await this.createAgentModal.submit();
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

    await expect(deleteAgentBtn).toBeVisible();
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

  // --- Table ---

  async isTableVisible(): Promise<boolean> {
    return this.agentTable.isVisible();
  }

  async isTableEmpty(): Promise<boolean> {
    return this.tableNoData.isVisible();
  }

  async selectAllAgents() {
    await this.customTableSelectAll.click();
  }

  // --- Empty state ---

  async isEmptyStateVisible(): Promise<boolean> {
    return this.emptyStateContainer.isVisible();
  }

  async clickEmptyStateCreate() {
    await this.emptyStateCreateButton.click();
  }

  async clickEmptyStateSpeakToUs() {
    await this.emptyStateSpeakButton.click();
  }

  // --- Agent row actions by name ---

  getAgentRow(agentName: string): Locator {
    return this.agentTable.filter({ hasText: agentName }).first();
  }

  async isAgentVisible(agentName: string): Promise<boolean> {
    return this.getAgentRow(agentName).isVisible();
  }

  async openAgentMenuByName(agentName: string) {
    const row = this.getAgentRow(agentName);
    await row.getByRole('button').last().click();
  }
}