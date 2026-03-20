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
    // await this.page.waitForURL(url);
    const onboardingOverlay = this.page.getByTestId('org-page-guard-modal-overlay');
    for (let i = 0; i < 4; i++) {
      try {
        await onboardingOverlay.waitFor({ state: 'visible', timeout: 500 });
      } catch {
        break;
      }
      await this.page.getByRole('button', { name: 'Close onboarding' }).click();
      await onboardingOverlay.waitFor({ state: 'hidden' });
    }
  }

  async search() {

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
    const tutorialsDialog = this.page.getByRole('dialog').filter({ hasText: 'GTWY AI Tutorials' });
    for (let i = 0; i < 4; i++) {
      try {
        await tutorialsDialog.waitFor({ state: 'visible', timeout: 5000 });
      } catch {
        break;
      }
      await this.page.getByTestId('tutorial-close-button').dispatchEvent('click');
      //await tutorialsDialog.waitFor({ state: 'hidden' });
    }
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

    const rowMenuBtn = agentRow.locator('[role="button"]').last();
    const deleteAgentBtn = this.page.getByRole('button', { name: 'Delete Agent' });
    for (let i = 0; i < 4; i++) {
      await rowMenuBtn.click();
      try {
        await deleteAgentBtn.waitFor({ state: 'visible', timeout: 3000 });
        break;
      } catch {
        // retry
      }
    }
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
    for (let i = 0; i < 4; i++) {
      await rowMenuBtn.click();
      try {
        await deleteAgentBtn.waitFor({ state: 'visible', timeout: 3000 });
        break;
      } catch {
        // retry
      }
    }
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