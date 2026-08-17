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
  readonly saveWidgetModalDescriptionInput: Locator;
  readonly saveWidgetModalSaveButton: Locator;
  readonly saveWidgetModalCancelButton: Locator;
  readonly searchInput: Locator;
  readonly templatePreviewModal: Locator;
  readonly commandPaletteBackdrop: Locator;
  readonly commandPaletteSearchInput: Locator;
  readonly commandPaletteCloseButton: Locator;
  readonly commandPaletteModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.getByTestId('page-header-container');
    this.createWidgetButton = page.getByTestId('create-widget-button-header');
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

    this.saveWidgetModal = page.getByTestId('save-widget-modal');
    this.saveWidgetModalNameInput = this.saveWidgetModal.getByTestId('save-widget-name-input');
    this.saveWidgetModalDescriptionInput =this.saveWidgetModal.getByTestId('save-widget-description-textarea');
    this.saveWidgetModalSaveButton = page.getByTestId('SAVE_WIDGET_MODAL').getByTestId('save-widget-save-button');
    this.saveWidgetModalCancelButton = this.saveWidgetModal.getByTestId('save-widget-cancel-button');

    this.searchInput = page.getByRole('textbox', { name: /Search Widget/i });
    this.templatePreviewModal = page.getByTestId('TEMPLATE_PLAYGROUND');

    this.commandPaletteBackdrop = page.getByTestId('command-palette-backdrop');
    this.commandPaletteModal = page.getByTestId('command-palette-modal');
    this.commandPaletteSearchInput = page.getByTestId('command-palette-search-input');
    this.commandPaletteCloseButton = page.getByTestId('command-palette-close-button');
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
    await this.page.goto(`/org/${orgId}/widgets`);
    await this.page.waitForURL(`/org/${orgId}/widgets`);
    await this.dismissOnboardingOverlay();
  }

  // async waitForPage() {
  //   await this.page.waitForLoadState('networkidle');
  // }
  //replacing the above function

  async waitForPage() {
    await this.pageHeader.waitFor({ state: 'visible' });
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
    return this.widgetGrid.locator('.card').filter({ hasText: widgetName }).first();
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
    await this.page.waitForURL(`/org/${orgId}/widgets?create=true`);
    await this.dismissOnboardingOverlay();
  }

  async fillSaveWidgetName(name: string) {
    await this.saveWidgetModalNameInput.clear();
    await this.saveWidgetModalNameInput.fill(name);
  }

  async fillSaveWidgetDescription(description: string) { 
    await this.saveWidgetModalDescriptionInput.clear(); 
    await this.saveWidgetModalDescriptionInput.fill(description); 
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

  async expectSearchInputVisible() {
    await expect(this.searchInput).toBeVisible();
  }

  async clickSearchInput() {
    await this.searchInput.click();
  }

  async expectCommandPaletteVisible() {
    await expect(this.commandPaletteBackdrop).toBeVisible();
  }

  async fillCommandPaletteSearch(name: string) {
    await this.commandPaletteSearchInput.fill(name);
  }

  async expectSearchResultVisible(name: string) {
    await expect(this.commandPaletteModal.getByText(name).first()).toBeVisible();
  }

  async closeCommandPalette() {
    await this.commandPaletteCloseButton.click();
  }

  async expectCommandPaletteNotVisible() {
    await expect(this.commandPaletteBackdrop).not.toBeVisible();
  }

  getTemplateCardByName(name: string): Locator {
    return this.widgetGrid.locator('.card').filter({ has: this.page.locator('.card-title', { hasText: name }) }).first();
  }

  async getFirstWidgetCardName(): Promise<string> {
    return this.widgetGrid.locator('.card').first().locator('.card-title').innerText();
  }

  async expectCardPreviewAreaVisible(name: string) {
    const card = this.getTemplateCardByName(name);
    await expect(card.locator('.bg-base-200').first()).toBeVisible();
  }

  async expectCardNameVisible(name: string) {
    const card = this.getTemplateCardByName(name);
    await expect(card).toBeVisible();
    await expect(card.locator('.card-title')).toContainText(name);
  }

  async expectCardDescriptionVisible(name: string) {
    const card = this.getTemplateCardByName(name);
    await expect(card.locator('.card-body p').first()).toBeVisible();
  }

  async expectCardRelativeTimeVisible(name: string) {
    const card = this.getTemplateCardByName(name);
    await expect(card.locator('.card-body').getByText(/\d+[dhmy]o?\s*ago|just now/i)).toBeVisible();
  }

  async hoverCardAndExpectPlayButtonVisible(name: string) {
    const card = this.getTemplateCardByName(name);
    await card.hover();
    await expect(card.locator('button[title="Preview"]')).toBeVisible();
  }

  async hoverCardAndExpectDateFormat(name: string) {
    const card = this.getTemplateCardByName(name);
    await card.hover();
    await expect(card.getByText(/\d{1,2}\s\w{3}\s\d{2},\s\d{2}:\d{2}/)).toBeVisible();
  }

  async clickCardPreviewButton(name: string) {
    const card = this.getTemplateCardByName(name);
    await card.hover();
    await card.locator('button[title="Preview"]').click();
  }

  async expectTemplatePreviewModalVisible() {
    await expect(this.templatePreviewModal).toBeVisible();
    await expect(this.templatePreviewModal.getByText('Template Preview')).toBeVisible();
  }

  async expectTemplatePreviewCloseButtonVisible() {
    await expect(this.templatePreviewModal.getByTestId('TEMPLATE_PLAYGROUND-close-button')).toBeVisible();
  }

  async clickTemplatePreviewClose() {
    await this.templatePreviewModal.getByTestId('TEMPLATE_PLAYGROUND-close-button').click();
  }

  async expectTemplatePreviewModalNotVisible() {
    await expect(this.templatePreviewModal).not.toHaveAttribute('open', '');
  }
}
