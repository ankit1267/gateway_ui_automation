import type { Page, Locator } from '@playwright/test';

export class ApiKeyModal {
  private readonly modal: Locator;
  private readonly form: Locator;
  private readonly title: Locator;
  private readonly nameInput: Locator;
  private readonly apiKeyInput: Locator;
  private readonly commentInput: Locator;
  private readonly limitInput: Locator;
  private readonly submitButton: Locator;
  private readonly cancelButton: Locator;
  private readonly serviceSelect: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.getByTestId('API_KEY_MODAL');
    this.form = page.locator('#apikey-modal-form');
    this.title = this.form.getByRole('heading');
    this.nameInput = page.getByTestId('apikey-modal-field-name-input');
    this.apiKeyInput = page.getByTestId('apikey-modal-field-apikey-input');
    this.commentInput = page.getByTestId('apikey-modal-field-comment-input');
    this.limitInput = page.getByTestId('apikey-modal-field-apikey_limit-input');
    this.submitButton = page.getByTestId('apikey-modal-submit-button');
    this.cancelButton = page.getByTestId('apikey-modal-cancel-button');
    this.serviceSelect = page.getByTestId('apikey-modal-service-select');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillApiKey(apiKey: string) {
    await this.apiKeyInput.fill(apiKey);
  }

  async fillComment(comment: string) {
    await this.commentInput.fill(comment);
  }

  async fillLimit(limit: string) {
    await this.limitInput.fill(limit);
  }

  async submit() {
    await this.submitButton.click();
  }

  async addApiKey(name: string, apiKey: string, comment?: string, limit?: string) {
    await this.fillName(name);
    await this.fillApiKey(apiKey);
    if (comment) await this.fillComment(comment);
    if (limit) await this.fillLimit(limit);
    await this.submit();
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

  async getNameValue(): Promise<string> {
    return this.nameInput.inputValue();
  }

  async getApiKeyValue(): Promise<string> {
    return this.apiKeyInput.inputValue();
  }

  async getCommentValue(): Promise<string> {
    return this.commentInput.inputValue();
  }

  async getLimitValue(): Promise<string> {
    return this.limitInput.inputValue();
  }

  async clearName() {
    await this.nameInput.clear();
  }

  async clearApiKey() {
    await this.apiKeyInput.clear();
  }

  getForm(): Locator {
    return this.form;
  }

  getTitle(): Locator {
    return this.title;
  }

  async getTitleText(): Promise<string> {
    return this.title.innerText();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async selectService(service: string) {
    await this.serviceSelect.selectOption(service);
  }

  async getServiceValue(): Promise<string> {
    return this.serviceSelect.inputValue();
  }

  async isServiceDisabled(): Promise<boolean> {
    return this.serviceSelect.isDisabled();
  }

  async isSubmitDisabled(): Promise<boolean> {
    return this.submitButton.isDisabled();
  }

  async clearComment() {
    await this.commentInput.clear();
  }

  async clearLimit() {
    await this.limitInput.clear();
  }
}
