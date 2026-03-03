import type { Page, Locator } from '@playwright/test';

export class AgentSidebar {
  readonly page: Page;
  readonly closeButton: Locator;
  readonly searchInput: Locator;
  readonly createToggle: Locator;
  readonly createTypeName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.closeButton = page.getByTestId('agent-sidebar-close-button');
    this.searchInput = page.getByTestId('agent-sidebar-search-input');
    this.createToggle = page.getByTestId('agent-sidebar-create-toggle');
    this.createTypeName = page.getByTestId('agent-sidebar-create-type-name');
  }

  async close() {
    await this.closeButton.click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async getSearchValue(): Promise<string> {
    return this.searchInput.inputValue();
  }

  async isSearchVisible(): Promise<boolean> {
    return this.searchInput.isVisible();
  }

  // --- Agent selection ---

  getAgentSelectButton(agentId: string): Locator {
    return this.page.getByTestId(`agent-sidebar-select-${agentId}`);
  }

  async selectAgent(agentId: string) {
    await this.getAgentSelectButton(agentId).click();
  }

  getAgentConfigButton(agentId: string): Locator {
    return this.page.getByTestId(`agent-sidebar-config-${agentId}`);
  }

  async configureAgent(agentId: string) {
    await this.getAgentConfigButton(agentId).click();
  }

  // --- Create toggle ---

  async openCreateToggle() {
    await this.createToggle.click();
  }

  async clickCreateTypeName() {
    await this.createTypeName.click();
  }
}
