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
    await this.page.locator('#main-slider-nav-api').click();
  }

  async openChatbot() {
    await this.page.locator('#main-slider-nav-chatbot').click();
  }

  async openKnowledgeBase() {
    await this.page.locator('#main-slider-nav-knowledge_base').click();
  }

  async openWidgets() {
    await this.page.locator('#main-slider-nav-widgets').click();
  }

  async openAuthKey() {
    await this.page.locator('#main-slider-nav-pauthkey').click();
  }

  async openApiKeys() {
    await this.page.locator('#main-slider-nav-apikeys').click();
  }

  async openAlerts() {
    await this.page.locator('#main-slider-nav-alerts').click();
  }

  async openMetrics() {
    await this.page.locator('#main-slider-nav-metrics').click();
  }

  async openIntegration() {
    await this.page.locator('#main-slider-nav-integration').click();
  }

  async openFeedback() {
    await this.page.locator('#main-slider-nav-feedback').click();
  }

  async openPrebuiltPrompts() {
    await this.page.locator('#main-slider-nav-prebuilt-prompts').click();
  }

  async openWorkspaceSettings() {
    await this.page.locator('#main-slider-nav-workspace-settings').click();
  }

  async openAddNewModel() {
    await this.page.locator('#main-slider-nav-add-new-model').click();
  }

  async openAuthRoute() {
    await this.page.locator('#main-slider-nav-auth-route').click();
  }

  async openChatbotConfig() {
    await this.page.locator('#main-slider-nav-chatbotConfig').click();
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