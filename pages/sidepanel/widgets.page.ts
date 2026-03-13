import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class WidgetsPage {
  readonly page: Page;
  readonly pageHeader: Locator;
  readonly createWidgetButton: Locator;
  readonly widgetGrid: Locator;
  readonly emptyStateText: Locator;
  readonly emptyStateCreateButton: Locator;
  readonly createViewHeading: Locator;
  readonly createViewDescription: Locator;
  readonly chatInputInitial: Locator;
  readonly chatInputContinue: Locator;
  readonly sendButton: Locator;
  readonly closeCreateViewButton: Locator;
  readonly generatingIndicator: Locator;
  readonly messagesContainer: Locator;
  readonly saveWidgetButtonInChat: Locator;
  readonly saveWidgetModal: Locator;
  readonly saveWidgetModalNameInput: Locator;
  readonly saveWidgetModalSaveButton: Locator;
  readonly saveWidgetModalCancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.getByTestId('page-header-container');
    this.createWidgetButton = page.getByRole('button', { name: /\+\s*Create Widget/i });
    this.widgetGrid = page.locator('.grid.grid-cols-1');
    this.emptyStateText = page.getByText('No widgets found');
    this.emptyStateCreateButton = page.getByRole('button', { name: '+ Create Widget' }).last();

    this.createViewHeading = page.getByRole('heading', { name: 'Create New Widget' });
    this.createViewDescription = page.getByText('Describe your widget idea');
    this.chatInputInitial = page.getByPlaceholder('Describe your widget...');
    this.chatInputContinue = page.getByPlaceholder('Continue the conversation...');
    this.sendButton = page.locator('button:has(svg)').last();
    this.closeCreateViewButton = page.locator('button.btn-ghost.btn-circle:has(svg)');

    this.generatingIndicator = page.getByText('Generating...');
    this.messagesContainer = page.locator('.overflow-y-auto.px-6.py-8');
    this.saveWidgetButtonInChat = this.messagesContainer.getByRole('button', { name: 'Save Widget' });

    this.saveWidgetModal = page.locator('#SAVE_WIDGET_MODAL');
    this.saveWidgetModalNameInput = this.saveWidgetModal.getByPlaceholder('Enter widget name');
    this.saveWidgetModalSaveButton = this.saveWidgetModal.getByRole('button', { name: 'Save Widget' });
    this.saveWidgetModalCancelButton = this.saveWidgetModal.getByRole('button', { name: 'Cancel' });
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/widgets`);
  }

  async waitForPage() {
    await this.page.waitForLoadState('networkidle');
  }

  async clickCreateWidget() {
    await this.createWidgetButton.click();
  }

  async isEmptyState(): Promise<boolean> {
    return this.emptyStateText.isVisible();
  }

  async getWidgetCardCount(): Promise<number> {
    return this.widgetGrid.locator('.card').count();
  }

  getWidgetCard(widgetName: string): Locator {
    return this.widgetGrid.locator('.card').first().filter({ hasText: widgetName });
  }

  async getWidgetCardTitle(index: number): Promise<string> {
    return this.widgetGrid.locator('.card').nth(index).locator('.card-title').innerText();
  }

  async hoverWidgetCard(widgetName: string) {
    await this.getWidgetCard(widgetName).hover();
  }

  async openWidgetPlayground(widgetName: string) {
    const card = this.getWidgetCard(widgetName);
    await card.hover();
    await card.locator('button[title="Preview"]').click();
  }

  async isCreateViewVisible(): Promise<boolean> {
    return this.createViewHeading.isVisible();
  }

  async fillChatMessage(message: string) {
    const input = await this.chatInputInitial.isVisible()
      ? this.chatInputInitial
      : this.chatInputContinue;
    await input.fill(message);
  }

  async sendChatMessage(message: string) {
    await this.fillChatMessage(message);
    await this.page.keyboard.press('Enter');
  }

  async isGenerating(): Promise<boolean> {
    return this.generatingIndicator.isVisible();
  }

  async waitForGeneration() {
    await this.generatingIndicator.waitFor({ state: 'visible' });
    await this.generatingIndicator.waitFor({ state: 'hidden', timeout: 60000 });
  }

  async getMessageCount(): Promise<number> {
    return this.messagesContainer.locator('> div').count();
  }

  async getLastMessageText(): Promise<string> {
    return this.messagesContainer.locator('> div').last().innerText();
  }

  async clickSaveWidgetInChat() {
    await this.saveWidgetButtonInChat.click();
  }

  async isSaveWidgetVisible(): Promise<boolean> {
    return this.saveWidgetButtonInChat.isVisible();
  }

  async closeCreateView() {
    await this.closeCreateViewButton.first().click();
  }

  async goToCreateMode() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/widgets?create=true`);
  }

  async fillSaveWidgetName(name: string) {
    await this.saveWidgetModalNameInput.clear();
    await this.saveWidgetModalNameInput.fill(name);
  }

  async clickSaveWidgetModalSave() {
    await this.saveWidgetModalSaveButton.click();
  }

  async closeSaveWidgetModal() {
    await this.saveWidgetModalCancelButton.click();
  }

  async expectSaveWidgetModalVisible() {
    await expect(this.saveWidgetModal).toBeVisible();
  }

  async expectWidgetInGrid(widgetName: string) {
    await expect(this.getWidgetCard(widgetName)).toBeVisible({ timeout: 15000 });
  }

  async expectSaveSuccessToast() {
    await expect(this.page.getByText('Widget saved successfully!')).toBeVisible({ timeout: 10000 });
  }
}
