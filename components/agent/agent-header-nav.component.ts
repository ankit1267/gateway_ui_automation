import type { Page, Locator } from '@playwright/test';

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

  constructor(private readonly page: Page) {
    this.history = this.page.getByTestId('navbar-tab-history');
    this.testCases = this.page.getByTestId('navbar-tab-testcase');
    this.chatbotConfig = this.page.getByTestId('navbar-tab-configure');
    this.updatesHistory = this.page.getByTestId('navbar-history-button');
    this.publishToggel = this.page.getByTestId('navbar-publish-dropdown-toggle');
    this.publish = this.page.getByTestId('navbar-publish-button');
    this.revert = this.page.getByTestId('navbar-revert-button');
    this.menuButton = this.page.getByTestId('navbar-ellipsis-menu-toggle');
    this.version = this.page.getByRole('dialog').getByTestId('version-description-create-button');
    this.agentName = this.page.getByTestId('navbar-agent-name-display');
    this.editName = this.page.locator('.lucide.lucide-pen').first();
    this.agentNameInput = this.page.getByTestId('navbar-agent-name-input');
    this.newButton = this.page.getByRole('button', { name: 'New', exact: true });
    this.versionDescriptionInput = this.page.getByRole('textbox', { name: 'Enter version description' });
    this.trashIcon = this.page.locator('.lucide.lucide-trash2').first();
    this.deleteButton = this.page.getByTestId('DELETE_VERSION_MODAL').getByTestId('delete-modal-confirm-button').first();
    this.discardChangesButton = this.page.getByTestId('DELETE_MODAL').getByTestId('delete-modal-confirm-button');
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
    for (let i = 1; i < 3; i++) {
      if (!(await this.publish.isVisible())) {
        await this.publishToggel.click();
      } else {
        break;
      }
    }
  }

  async clickDiscardChangesButton() {
    await this.discardChangesButton.click();
  }

  async clickRevertButton() {
    await this.revert.click();
  }

  async clickPublishButton() {
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

  async publishAndCreateVersion(desc: string) {
    await this.clickPublish();
    await this.clickPublishButton();
    await this.fillVersionDescription(desc);
    await this.createNewVersion();
  }
}