import type { Page, Locator } from '@playwright/test';

export class PrebuiltPromptsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly agentTabsContainer: Locator;
  readonly selectedAgentHeading: Locator;
  readonly tokenCountBadge: Locator;
  readonly promptTextarea: Locator;
  readonly saveButton: Locator;
  readonly defaultButton: Locator;
  readonly loadingSpinner: Locator;
  readonly emptyStateHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { level: 1 });
    this.pageDescription = page.locator('.text-sm.text-base-content\\/60');
    this.agentTabsContainer = page.locator('.flex.flex-wrap.gap-2');
    this.selectedAgentHeading = page.locator('h2.text-lg.font-semibold');
    this.tokenCountBadge = page.locator('.text-xs.text-base-content\\/60.bg-base-300');
    this.promptTextarea = page.locator('textarea.textarea');
    this.saveButton = page.getByRole('button', { name: /save/i });
    this.defaultButton = page.getByRole('button', { name: /default/i });
    this.loadingSpinner = page.locator('.loading-spinner');
    this.emptyStateHeading = page.getByRole('heading', { name: /no.*found/i });
  }

  private async dismissOnboardingOverlay() {
    const overlay = this.page.getByTestId('org-page-guard-modal-overlay');
    if (await overlay.isVisible()) {
      await this.page.getByRole('button', { name: 'Close onboarding' }).click();
      await overlay.waitFor({ state: 'hidden' });
    }
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/prebuilt-prompts`);
    await this.page.waitForURL(`/org/${orgId}/prebuilt-prompts`);
    await this.dismissOnboardingOverlay();
  }

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async selectAgent(agentName: string) {
    await this.agentTabsContainer
      .getByRole('button', { name: agentName, exact: true })
      .click();
  }

  getAgentTab(agentName: string): Locator {
    return this.agentTabsContainer.getByRole('button', { name: agentName, exact: true });
  }

  async getAgentTabNames(): Promise<string[]> {
    return this.agentTabsContainer.getByRole('button').allInnerTexts();
  }

  async isAgentTabSelected(agentName: string): Promise<boolean> {
    const tab = this.getAgentTab(agentName);
    const className = await tab.getAttribute('class');
    return className?.includes('bg-primary') ?? false;
  }

  async getSelectedAgentName(): Promise<string> {
    return this.selectedAgentHeading.innerText();
  }

  async getTokenCount(): Promise<string> {
    return this.tokenCountBadge.innerText();
  }

  async fillPrompt(prompt: string) {
    await this.promptTextarea.fill(prompt);
  }

  async getPromptValue(): Promise<string> {
    return this.promptTextarea.inputValue();
  }

  async clearPrompt() {
    await this.promptTextarea.clear();
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickDefault() {
    await this.defaultButton.click();
  }

  async isSaveDisabled(): Promise<boolean> {
    return this.saveButton.isDisabled();
  }

  async isSaveLoading(): Promise<boolean> {
    return this.loadingSpinner.isVisible();
  }

  async isEmptyState(): Promise<boolean> {
    return this.emptyStateHeading.isVisible();
  }

  async updatePrompt(agentName: string, newPrompt: string) {
    await this.selectAgent(agentName);
    await this.fillPrompt(newPrompt);
    await this.clickSave();
  }

  async resetToDefault(agentName: string) {
    await this.selectAgent(agentName);
    await this.clickDefault();
  }
}
