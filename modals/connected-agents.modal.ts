import type { Page, Locator } from '@playwright/test';

export class ConnectedAgentsModal {
  private readonly modal: Locator;
  private readonly closeButton: Locator;
  private readonly agentsList: Locator;
  private readonly emptyState: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('CONNECTED_AGENTS_MODAL');
    this.closeButton = page.getByTestId('connected-agents-close-button');
    this.agentsList = page.getByTestId('connected-agents-list');
    this.emptyState = page.getByTestId('connected-agents-empty-state');
  }

  async close() {
    await this.closeButton.click();
  }

  getModal(): Locator {
    return this.modal;
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async isAgentsListVisible(): Promise<boolean> {
    return this.agentsList.isVisible();
  }

  async isEmptyState(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  getAgentCard(bridgeId: string): Locator {
    return this.page.getByTestId(`connected-agent-card-${bridgeId}`);
  }

  async isAgentCardVisible(bridgeId: string): Promise<boolean> {
    return this.getAgentCard(bridgeId).isVisible();
  }

  async getAgentCount(): Promise<number> {
    return this.agentsList.locator('[data-testid^="connected-agent-card-"]').count();
  }

  async getModalText(): Promise<string> {
    return this.modal.innerText();
  }
}
