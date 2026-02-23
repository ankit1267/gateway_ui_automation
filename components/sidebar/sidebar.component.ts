import { Page, Locator } from '@playwright/test';

export class Sidebar {
  private readonly sidebar: Locator;


  constructor(private page: Page) {
    this.sidebar = page.locator('#main-slider-toggle-button');
   
  }

  async toggleSidebar() {
    await this.sidebar.click();
  }

  async openApi() {
    await this.page.getByRole('button', { name: 'API' }).click();
  }

  async openChatbot() {
    await this.page.getByRole('button', { name: 'Chatbot' }).click();
  }

  async openKnowledgeBase() {
    await this.page.getByRole('button', { name: 'Knowledge Base' }).click();
  }

  async openWidgets() {
    await this.page.getByRole('button', { name: 'Widgets' }).click();
  }

  async openAuthKey() {
    await this.page.getByRole('button', { name: 'Auth Key' }).click();
  }

  async openApiKeys() {
    await this.page.getByRole('button', { name: 'API Keys' }).click();
  }

  async openAlerts() {
    await this.page.getByRole('button', { name: 'Alerts' }).click();
  }

  async openMetrics() {
    await this.page.getByRole('button', { name: 'Metrics' }).click();
  }
}