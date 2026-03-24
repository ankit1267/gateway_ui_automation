import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { lockDaisyDropdown } from '../../utils/daisy-ui';

export class AgentHeaderNav {
  private readonly history: Locator;
  private readonly testCases: Locator;
  private readonly chatbotConfig: Locator;
  private readonly publish: Locator;
  private readonly publishToggel: Locator;
  private readonly updatesHistory: Locator;
  private readonly menuButton: Locator;
  private readonly version: Locator;
  private readonly agentName: Locator;
  private readonly editName: Locator;
  private readonly agentNameInput: Locator;
  private readonly newButton: Locator;
  private readonly versionDescriptionInput: Locator;
  private readonly trashIcon: Locator;
  private readonly deleteButton: Locator;
  private readonly revert: Locator;
  private readonly discardChangesButton: Locator;
  private readonly configHistorySlider: Locator;
  private readonly publishedButton: Locator;
  private readonly publishedDataBanner: Locator;
  private readonly versionTabs: Locator;
  private readonly publishDialog: Locator;
  private readonly publishVersionCheckbox: Locator;
  private readonly summaryGenerateButton: Locator;
  private readonly summarySaveButton: Locator;
  private readonly confirmPublishButton: Locator;

  constructor(private readonly page: Page) {
    this.history = this.page.getByTestId('navbar-tab-history');
    this.testCases = this.page.getByTestId('navbar-tab-testcase');
    this.chatbotConfig = this.page.getByTestId('navbar-tab-configure');
    this.updatesHistory = this.page.getByTestId('navbar-history-button');
    this.publishToggel = this.page.getByTestId('navbar-publish-dropdown-toggle');
    this.publish = this.page.getByTestId('navbar-publish-button');
    this.revert = this.page.getByTestId('navbar-revert-button');
    this.menuButton = this.page.getByTestId('navbar-ellipsis-menu-toggle');
    this.version = this.page.getByRole('dialog').filter({ hasText: 'Create New Version' }).getByTestId('version-description-create-button');
    this.agentName = this.page.getByTestId('navbar-agent-name-display');
    this.editName = this.page.locator('.lucide.lucide-pen').first();
    this.agentNameInput = this.page.getByTestId('navbar-agent-name-input');
    this.newButton = this.page.getByRole('button', { name: 'New', exact: true });
    this.versionDescriptionInput = this.page.getByRole('dialog').filter({ hasText: 'Create New Version' }).getByTestId('version-description-input');
    this.trashIcon = this.page.locator('.lucide.lucide-trash2').first();
    this.deleteButton = this.page.getByTestId('DELETE_VERSION_MODAL').getByTestId('delete-modal-confirm-button').first();
    this.discardChangesButton = this.page.getByTestId('DELETE_MODAL').getByTestId('delete-modal-confirm-button');
    this.configHistorySlider = this.page.locator('#default-config-history-slider');
    this.publishedButton = this.page.getByTestId('navbar-published-button');
    this.publishedDataBanner = this.page.getByTestId('published-data-banner');
    this.versionTabs = this.page.getByTestId('bridge-version-tabs');
    this.publishDialog = this.page.getByRole('dialog').filter({ hasText: 'Publish Bridge Version' });
    this.publishVersionCheckbox = this.publishDialog.locator('#publish-summary-accordion-toggle');
    this.summaryGenerateButton = this.publishDialog.getByTestId('agent-summary-generate-button');
    this.summarySaveButton = this.publishDialog.getByTestId('agent-summary-save-button');
    this.confirmPublishButton = this.page.locator('#publish-confirm-button').first();
  }

  async openChatbotConfig() {
    await this.chatbotConfig.click();
  }

  async openTestCases() {
    await this.testCases.click();
  }

  async openHistory() {
    await this.history.click();
  }

  async openUpdatesHistory() {
    await this.updatesHistory.click();
  }

  async clickPublish() {
    await expect(async () => {
      if (!(await this.publish.isVisible())) {
        await this.publishToggel.click();
      }
      await expect(this.publish).toBeVisible();
    }).toPass();
    await lockDaisyDropdown(this.page, 'navbar-publish-dropdown-toggle');
  }

  async clickDiscardChangesButton() {
    await this.discardChangesButton.click();
  }

  async clickRevertButton() {
    await this.revert.click();
  }

  async clickPublishButton() {
    await expect(async () => {
      if (!(await this.publish.isVisible())) {
        await this.publishToggel.click();
      }
      await expect(this.publish).toBeVisible();
    }).toPass();
    await lockDaisyDropdown(this.page, 'navbar-publish-dropdown-toggle');
    await this.publish.click();
  }

  async clickMenuButton() {
    await this.menuButton.click();
  }

  async createNewVersion() {
    await this.version.click();
  }

  async getAgentName() {
    return this.agentName;
  }

  async clickEditName() {
    await this.editName.click();
  }

  async agentNameFill(agentName: string) {
    return this.agentNameInput.fill(agentName);
  }

  async clickNewButton() {
    await this.newButton.click();
  }

  async fillVersionDescription(desc: string) {
    await this.versionDescriptionInput.fill(desc);
  }

  async deleteFirstVersion() {
    await this.trashIcon.click();
    await this.deleteButton.click();
  }

  async getAgentNameText(): Promise<string> {
    return this.agentName.innerText();
  }

  async assertConfigHistorySliderVisible() {
    await expect(this.configHistorySlider).toBeInViewport({ timeout: 10000 });
  }

  async isHistoryTabVisible(): Promise<boolean> {
    return this.history.isVisible();
  }

  async isTestCasesTabVisible(): Promise<boolean> {
    return this.testCases.isVisible();
  }

  async isChatbotConfigTabVisible(): Promise<boolean> {
    return this.chatbotConfig.isVisible();
  }

  async isPublishVisible(): Promise<boolean> {
    return this.publish.isVisible();
  }

  async isRevertVisible(): Promise<boolean> {
    return this.revert.isVisible();
  }

  async isNewButtonVisible(): Promise<boolean> {
    return this.newButton.isVisible();
  }

  async submitAgentName() {
    await this.agentNameInput.press('Enter');
  }

  async renameAgent(newName: string) {
    await this.clickEditName();
    await this.agentNameFill(newName);
    await this.submitAgentName();
  }

  async checkPublishVersionCheckbox() {
    await this.publishVersionCheckbox.check();
  }

  async clickGenerateSummary() {
    await this.summaryGenerateButton.click();
  }

  async clickSaveSummary() {
    await this.summarySaveButton.click();
  }

  async expectSummarySaveDisabled() {
    await expect(this.summarySaveButton).toBeDisabled({ timeout: 15000 });
  }

  async clickConfirmPublish() {
    await this.confirmPublishButton.click();
  }

  async expectPublishSuccessToast() {
    await expect(this.page.getByText('Agent Version published')).toBeVisible({ timeout: 15000 });
  }

  async publishAndCreateVersion(desc: string) {
    await this.clickPublish();
    await this.clickPublishButton();
    await this.fillVersionDescription(desc);
    await this.createNewVersion();
  }

  async clickPublishedButton() {
    await this.publishedButton.click();
  }

  async expectPublishedButtonVisible() {
    await expect(this.publishedButton).toBeVisible();
  }

  async expectPublishedDataBannerVisible() {
    await expect(this.publishedDataBanner).toBeVisible();
    await expect(this.publishedDataBanner).toContainText('read-only');
  }

  async expectPublishedDataBannerNotVisible() {
    await expect(this.publishedDataBanner).not.toBeVisible();
  }

  async clickVersionButton(versionId: string) {
    await this.page.getByTestId(`version-button-${versionId}`).click();
  }

  async getFirstVersionButton(): Promise<Locator> {
    return this.versionTabs.locator('button[data-testid^="version-button-"]').first();
  }

  async getVersionButtonCount(): Promise<number> {
    return this.versionTabs.locator('button[data-testid^="version-button-"]').count();
  }

  async clickFirstVersionButton() {
    const btn = this.versionTabs.locator('button[data-testid^="version-button-"]').first();
    await btn.dispatchEvent('click');
  }

  async clickSecondVersionButton() {
    const btn = this.versionTabs.locator('button[data-testid^="version-button-"]').nth(1);
    await btn.dispatchEvent('click');
  }

  async getVersionFromUrl(): Promise<string | null> {
    const url = new URL(this.page.url());
    return url.searchParams.get('version');
  }

  async waitForVersionInUrl(versionId: string) {
    await this.page.waitForURL(`**version=${versionId}**`, { timeout: 10000 });
  }

  async hoverVersionButton(versionId: string) {
    await this.page.getByTestId(`version-button-${versionId}`).hover();
  }

  async hoverFirstVersionButton() {
    const btn = this.versionTabs.locator('button[data-testid^="version-button-"]').first();
    await btn.hover();
  }

  async expectVersionTooltipVisible() {
    await expect(this.page.locator('.tooltip.tooltip-bottom[data-tip]').first()).toBeVisible();
  }

  async getFirstVersionButtonTestId(): Promise<string> {
    const btn = this.versionTabs.locator('button[data-testid^="version-button-"]').first();
    return (await btn.getAttribute('data-testid')) || '';
  }

  async getSecondVersionButtonTestId(): Promise<string> {
    const btn = this.versionTabs.locator('button[data-testid^="version-button-"]').nth(1);
    return (await btn.getAttribute('data-testid')) || '';
  }
}