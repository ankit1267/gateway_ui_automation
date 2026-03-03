import { Page, Locator } from '@playwright/test';

export class Sidebar {
  private readonly toggleButton: Locator;
  private readonly searchInput: Locator;
  private readonly searchClearFilterButton: Locator;
  private readonly mainLayout: Locator;
  private readonly createAgentButton: Locator;

  constructor(private page: Page) {
    this.toggleButton = page.locator('#main-slider-toggle-button');
    this.searchInput = page.getByTestId('search-items-input');
    this.searchClearFilterButton = page.getByTestId('search-items-clear-filter-button');
    this.mainLayout = page.getByTestId('main-layout-container');
    this.createAgentButton = page.getByRole('button', { name: /create.*agent/i });
  }

  async toggleSidebar() {
    await this.toggleButton.click();
  }

  async isSidebarToggleVisible(): Promise<boolean> {
    return this.toggleButton.isVisible();
  }

  private getSidebarItem(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  async openApi() {
    await this.getSidebarItem('API').click();
  }

  async openChatbot() {
    await this.getSidebarItem('Chatbot').click();
  }

  async openKnowledgeBase() {
    await this.getSidebarItem('Knowledge Base').click();
  }

  async openWidgets() {
    await this.getSidebarItem('Widgets').click();
  }

  async openAuthKey() {
    await this.getSidebarItem('Auth Key').click();
  }

  async openApiKeys() {
    await this.getSidebarItem('API Keys').click();
  }

  async openAlerts() {
    await this.getSidebarItem('Alerts').click();
  }

  async openMetrics() {
    await this.getSidebarItem('Metrics').click();
  }

  async openIntegration() {
    await this.getSidebarItem('Integration').click();
  }

  async openFeedback() {
    await this.getSidebarItem('Feedback').click();
  }

  async openPrebuiltPrompts() {
    await this.getSidebarItem('Prebuilt Prompts').click();
  }

  async openWorkspaceSettings() {
    await this.getSidebarItem('Workspace Settings').click();
  }

  async openAddNewModel() {
    await this.getSidebarItem('Add New Model').click();
  }

  async openAuthRoute() {
    await this.getSidebarItem('Auth Route').click();
  }

  async openChatbotConfig() {
    await this.getSidebarItem('Chatbot Config').click();
  }

  async isSidebarItemVisible(name: string): Promise<boolean> {
    return this.getSidebarItem(name).isVisible();
  }

  async clickSidebarItemByName(name: string) {
    await this.getSidebarItem(name).click();
  }

  // --- Search ---

  async searchAgents(query: string) {
    await this.searchInput.fill(query);
  }

  async getSearchValue(): Promise<string> {
    return this.searchInput.inputValue();
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async clearSearchFilter() {
    await this.searchClearFilterButton.click();
  }

  async isSearchVisible(): Promise<boolean> {
    return this.searchInput.isVisible();
  }

  async isClearFilterVisible(): Promise<boolean> {
    return this.searchClearFilterButton.isVisible();
  }

  // --- Main layout ---

  async isMainLayoutVisible(): Promise<boolean> {
    return this.mainLayout.isVisible();
  }

  // --- Create agent ---

  async clickCreateAgent() {
    await this.createAgentButton.click();
  }

  async isCreateAgentVisible(): Promise<boolean> {
    return this.createAgentButton.isVisible();
  }

  // --- Page heading helpers ---

  getPageHeading(name: string): Locator {
    return this.page.getByRole('heading', { name });
  }

  async isPageHeadingVisible(name: string): Promise<boolean> {
    return this.getPageHeading(name).isVisible();
  }

  // --- Toast / Alert ---

  getAlert(text: string): Locator {
    return this.page.getByRole('alert').filter({ hasText: text });
  }

  getToast(text: string): Locator {
    return this.page.getByText(text);
  }
}