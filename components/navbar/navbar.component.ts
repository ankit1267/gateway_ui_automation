import type { Page, Locator } from '@playwright/test';

export class Navbar {
  private readonly homeButton: Locator;
  private readonly agentNameDisplay: Locator;
  private readonly agentNameInput: Locator;
  private readonly publishedButton: Locator;
  private readonly publishDropdownToggle: Locator;
  private readonly publishButton: Locator;
  private readonly revertButton: Locator;
  private readonly historyTab: Locator;
  private readonly testCaseTab: Locator;
  private readonly configureTab: Locator;
  private readonly ellipsisMenuToggle: Locator;
  private readonly historyButton: Locator;
  private readonly versionDescriptionInput: Locator;
  private readonly versionCreateButton: Locator;
  private readonly mobileAgentNameDisplay: Locator;
  private readonly mobileAgentNameInput: Locator;
  private readonly mobilePublishedButton: Locator;

  constructor(private readonly page: Page) {
    this.homeButton = page.locator('[data-testid="navbar-home-button"]');
    this.agentNameDisplay = page.getByTestId('navbar-agent-name-display');
    this.agentNameInput = page.getByTestId('navbar-agent-name-input');
    this.publishedButton = page.getByTestId('navbar-published-button');
    this.publishDropdownToggle = page.getByTestId('navbar-publish-dropdown-toggle');
    this.publishButton = page.getByTestId('navbar-publish-button');
    this.revertButton = page.getByTestId('navbar-revert-button');
    this.historyTab = page.getByTestId('navbar-tab-history');
    this.testCaseTab = page.getByTestId('navbar-tab-testcase');
    this.configureTab = page.getByTestId('navbar-tab-configure');
    this.ellipsisMenuToggle = page.getByTestId('navbar-ellipsis-menu-toggle');
    this.historyButton = page.getByTestId('navbar-history-button');
    this.versionDescriptionInput = page.getByRole('textbox', { name: 'Enter version description' });
    this.versionCreateButton = page.getByRole('dialog').getByTestId('version-description-create-button');
    this.mobileAgentNameDisplay = page.getByTestId('navbar-mobile-agent-name-display-inner');
    this.mobileAgentNameInput = page.getByTestId('navbar-mobile-agent-name-input');
    this.mobilePublishedButton = page.getByTestId('navbar-mobile-published-button');
  }

  async clickHome() {
    await this.homeButton.click();
  }

  getAgentNameLocator(): Locator {
    return this.agentNameDisplay;
  }

  async getAgentNameText(): Promise<string> {
    return this.agentNameDisplay.innerText();
  }

  async clickAgentName() {
    await this.agentNameDisplay.click();
  }

  async isAgentNameEditable(): Promise<boolean> {
    return this.agentNameInput.isVisible();
  }

  async fillAgentName(name: string) {
    await this.agentNameInput.fill(name);
  }

  async submitAgentName() {
    await this.agentNameInput.press('Enter');
  }

  async renameAgent(newName: string) {
    await this.clickAgentName();
    await this.fillAgentName(newName);
    await this.submitAgentName();
  }

  async clickPublishedButton() {
    await this.publishedButton.click();
  }

  async isPublished(): Promise<boolean> {
    return this.publishedButton.isVisible();
  }

  async openPublishDropdown() {
    await this.publishDropdownToggle.click();
  }

  async clickPublish() {
    await this.publishButton.click();
  }

  async isPublishVisible(): Promise<boolean> {
    return this.publishButton.isVisible();
  }

  async clickRevert() {
    await this.revertButton.click();
  }

  async isRevertVisible(): Promise<boolean> {
    return this.revertButton.isVisible();
  }

  async openHistoryTab() {
    await this.historyTab.click();
  }

  async openTestCaseTab() {
    await this.testCaseTab.click();
  }

  async openConfigureTab() {
    await this.configureTab.click();
  }

  async isHistoryTabVisible(): Promise<boolean> {
    return this.historyTab.isVisible();
  }

  async isTestCaseTabVisible(): Promise<boolean> {
    return this.testCaseTab.isVisible();
  }

  async isConfigureTabVisible(): Promise<boolean> {
    return this.configureTab.isVisible();
  }

  async clickEllipsisMenu() {
    await this.ellipsisMenuToggle.click();
  }

  async openUpdatesHistory() {
    await this.historyButton.click();
  }

  async fillVersionDescription(desc: string) {
    await this.versionDescriptionInput.fill(desc);
  }

  async clickCreateVersion() {
    await this.versionCreateButton.click();
  }

  async publishWithDescription(desc: string) {
    await this.openPublishDropdown();
    await this.clickPublish();
    await this.fillVersionDescription(desc);
    await this.clickCreateVersion();
  }

  // --- Mobile locators ---

  async getMobileAgentNameText(): Promise<string> {
    return this.mobileAgentNameDisplay.innerText();
  }

  async clickMobileAgentName() {
    await this.mobileAgentNameDisplay.click();
  }

  async isMobileAgentNameEditable(): Promise<boolean> {
    return this.mobileAgentNameInput.isVisible();
  }

  async fillMobileAgentName(name: string) {
    await this.mobileAgentNameInput.fill(name);
  }

  async submitMobileAgentName() {
    await this.mobileAgentNameInput.press('Enter');
  }

  async clickMobilePublishedButton() {
    await this.mobilePublishedButton.click();
  }

  async isMobilePublishedVisible(): Promise<boolean> {
    return this.mobilePublishedButton.isVisible();
  }

  // --- Tab by ID ---

  getTab(tabId: string): Locator {
    return this.page.getByTestId(`navbar-tab-${tabId}`);
  }

  async clickTab(tabId: string) {
    await this.getTab(tabId).click();
  }

  async isTabVisible(tabId: string): Promise<boolean> {
    return this.getTab(tabId).isVisible();
  }
}
