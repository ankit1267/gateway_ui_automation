import type { Page, Locator } from '@playwright/test';

import { expect } from '@playwright/test';

import { AgentPage } from '../agent/agent.page';

import { Sidebar } from '../../components/sidebar/sidebar.component';

import { KnowledgeBasePage } from './knowledge-base.page';

import { CreateNewBridgeModal } from '../../modals/create-new-bridge.modal';

import { DeleteModal } from '../../modals/delete.modal';

import { CommandPalette } from '../../components/command/command-palette.component';

import { AccessManagementModal } from '../../modals/access-management.modal';

import { UsageSummaryPopover } from '../../components/agents/usage-summary-popover';



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

  private readonly pageHeaderContainer: Locator;

  private readonly searchInput: Locator;

  private readonly customTableView: Locator;

  readonly sidebar: Sidebar;

  readonly knowledgeBasePage: KnowledgeBasePage;

  readonly createAgentModal: CreateNewBridgeModal;

  readonly deleteModal: DeleteModal;

  readonly commandPalette: CommandPalette;

  readonly accessManagementModal: AccessManagementModal;

  readonly usageSummaryPopover: UsageSummaryPopover;



  constructor(private page: Page) {

    this.agentTable = this.page.getByTestId(/custom-table-row-/);

    this.customTable = this.page.getByTestId('custom-table').first();

    this.customTableSelectAll = this.page.getByTestId('custom-table-select-all');

    this.tableNoData = this.page.getByTestId('table-no-data');

    this.createAgentButton = this.page.getByTestId('create-new-agent-button');

    this.usageFilterButton = this.page.getByRole('button', { name: 'Usage Filter' });

    this.emptyStateContainer = this.page.getByTestId('agent-empty-state-container');

    this.emptyStateCreateButton = this.page.getByTestId('agent-empty-create-agent-button');

    this.emptyStateSpeakButton = this.page.getByTestId('agent-empty-speak-to-us-button');

    this.pageHeaderContainer = this.page.getByTestId('page-header-container');

    this.searchInput = this.page.getByTestId('search-items-input').last();

    this.customTableView = this.page.getByTestId('custom-table-view').first();

    this.sidebar = new Sidebar(page);

    this.knowledgeBasePage = new KnowledgeBasePage(page);

    this.createAgentModal = new CreateNewBridgeModal(page);

    this.deleteModal = new DeleteModal(page);

    this.commandPalette = new CommandPalette(page);

    this.accessManagementModal = new AccessManagementModal(page);

    this.usageSummaryPopover = new UsageSummaryPopover(page);

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



  async fillSearch(value: string) {

    await this.searchInput.fill(value);

  }



  async clearSearch() {

    await this.searchInput.clear();

  }



  async getSearchValue(): Promise<string> {

    return this.searchInput.inputValue();

  }



  async openAgent(agentName: string): Promise<AgentPage> {

    await this.agentTable.getByText(agentName, { exact: true }).click();



    return new AgentPage(this.page);

  }



  async openAgentById(id: string): Promise<AgentPage> {

    const row = this.page.getByTestId(`custom-table-row-${id}`);



    // wait for table + row

    await expect(this.customTable).toBeVisible();

    await expect(row).toBeVisible();



    // ensure it's actually clickable

    await row.scrollIntoViewIfNeeded();



    await Promise.all([

      this.page.waitForURL(/\/agents\/.+/), // expect navigation to detail page

      row.click(),

    ]);



    return new AgentPage(this.page);

  }



  async clickCreateNewAgent() {

    await this.createAgentButton.click();

  }



  async clickCreateNewAgentSubmit(): Promise<AgentPage> {

    await Promise.all([

      this.page.waitForURL(/\/agents\/.+/, { timeout: 30000 }),

      this.createAgentModal.submit(),

    ]);

    await this.page.getByTestId('tab-button-prompt').waitFor({ state: 'visible', timeout: 30000 });

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



    const rowMenuBtn = agentRow.locator('[role="button"]').last();

    const deleteAgentBtn = this.page.getByRole('button', { name: 'Delete Agent' });

    await expect(async () => {

      await rowMenuBtn.click();

      await expect(deleteAgentBtn).toBeVisible();

    }).toPass();

    await deleteAgentBtn.click();



    await this.deleteModal.waitForVisible();

    await this.deleteModal.confirm();

  }



  async openKnowledgeBasePanel() {

    await this.page.getByRole('button', { name: 'Knowledge base' }).click();

  }



  async cancelDeleteAgentByName(agentName: string) {

    const agentRow = this.agentTable

      .filter({ hasText: agentName })

      .first();



    await expect(agentRow).toBeVisible();



    const rowMenuBtn = agentRow.locator('[role="button"]').last();

    const deleteAgentBtn = this.page.getByRole('button', { name: 'Delete Agent' });

    await expect(async () => {

      await rowMenuBtn.click();

      await expect(deleteAgentBtn).toBeVisible();

    }).toPass();

    await deleteAgentBtn.click();



    await this.deleteModal.waitForVisible();

    await this.deleteModal.cancel();

  }



  async undoDeleteAgentByName(agentName: string) {

    const row = this.getAgentRow(agentName);

    await row.hover();

    await row.getByRole('button', { name: 'Undo' }).click();

  }



  async verifyDeleteCountdown(agentName: string, days: number = 30) {

    const row = this.getAgentRow(agentName);

    await row.hover();

    await expect(row.getByText(`${days} days left`)).toBeVisible();

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



  async assertAgentVisible(agentName: string) {

    await expect(this.getAgentRow(agentName)).toBeVisible();

  }



  async openAgentMenuByName(agentName: string) {

    const row = this.getAgentRow(agentName);

    await row.getByRole('button').last().click();

  }



  async openManageAccessForAgent(agentName: string) {

    await this.openAgentMenuByName(agentName);

    await this.page.getByRole('button', { name: 'Manage Access' }).click();

  }



  async openUsageLimitsForAgent(agentName: string) {

    await this.openAgentMenuByName(agentName);

    await this.page.getByRole('button', { name: 'Usage & Limits' }).click();

  }



  async pauseAgent(agentName: string) {

    await this.openAgentMenuByName(agentName);

    await this.page.getByRole('button', { name: 'Pause Agent' }).click();

  }



  async resumeAgent(agentName: string) {

    await this.openAgentMenuByName(agentName);

    await this.page.getByRole('button', { name: 'Resume Agent' }).click();

  }



  async expectPausedToastVisible() {

    await expect(

      this.page.getByRole('alert').filter({ hasText: 'Agent paused successfully' })

    ).toBeVisible();

  }



  async expectResumedToastVisible() {

    await expect(

      this.page.getByRole('alert').filter({ hasText: 'Agent resumed successfully' })

    ).toBeVisible();

  }



  async clickHistoryButton(agentName: string) {

    const row = this.getAgentRow(agentName);

    await row.hover();

    await row.getByRole('button', { name: 'History' }).click();

  }



  async expectHistoryPageUrl() {

    await expect(this.page).toHaveURL(/\/agents\/history\//, { timeout: 10000 });

  }



  // --- Page Header ---



  async expectPageHeaderVisible() {

    await expect(this.pageHeaderContainer).toBeVisible();

  }



  async expectCreateAgentButtonVisible() {

    await expect(this.createAgentButton).toBeVisible();

  }



  async expectSearchInputVisible() {

    await expect(this.searchInput).toBeVisible();

  }



  // --- Table Assertions ---



  async expectTableVisible() {

    await expect(this.customTable).toBeVisible();

  }



  async expectTableViewVisible() {

    await expect(this.customTableView).toBeVisible();

  }



  async expectColumnHeaderVisible(column: string) {

    await expect(

      this.page.getByTestId(`custom-table-header-${column}`).first()

    ).toBeVisible();

  }



  async clickSortByColumn(column: string) {

    await this.page.getByTestId(`custom-table-sort-icon-${column}`).first().click();

  }



  async getFirstAgentName(): Promise<string> {

    const firstRow = this.page.getByTestId(/custom-table-row-/).first();

    await expect(firstRow).toBeVisible();

    const nameCell = firstRow.locator('td').first();

    return (await nameCell.textContent()) ?? '';

  }



  async expectAgentNotVisible(agentName: string) {

    await expect(this.getAgentRow(agentName)).not.toBeVisible();

  }



  async expectUsageFilterButtonVisible() {

    await expect(this.usageFilterButton).toBeVisible();

  }



  async expectAgentTableUrl() {

    await expect(this.page).toHaveURL(/\/agents\//, { timeout: 10000 });

  }



  // --- Usage Filter ---



  async openUsageFilter() {

    await this.usageFilterButton.click();

  }



  async selectUsagePreset(days: 1 | 5 | 10 | 15 | 30) {

    const label = days === 1 ? 'Last 1 day' : `Last ${days} days`;

    await this.page.getByRole('button', { name: label }).click();

  }



  async openCustomDateRange() {

    await this.page.getByRole('button', { name: 'Custom date range…' }).click();

  }



  async fillCustomDateRange(startDate: string, endDate: string) {

    await this.page.locator('input[type="date"]').first().fill(startDate);

    await this.page.locator('input[type="date"]').last().fill(endDate);

  }



  async applyCustomDateRange() {

    await this.page.getByRole('button', { name: 'Apply' }).click();

  }



  async resetUsageFilter() {

    await this.page.getByRole('button', { name: 'Reset filter' }).click();

  }



  async closeUsageFilterDropdown() {

    await this.page.mouse.click(10, 10);

  }



  async expectUsageFilterInactive() {

    await expect(this.usageFilterButton).not.toContainText('→');

  }

}