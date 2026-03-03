import type { Page, Locator } from '@playwright/test';

export class AuthDataModal {
  private readonly closeXButton: Locator;
  private readonly routeNameInput: Locator;
  private readonly copyRouteNameButton: Locator;
  private readonly clientIdInput: Locator;
  private readonly copyClientIdButton: Locator;
  private readonly redirectionUrlInput: Locator;
  private readonly copyRedirectionUrlButton: Locator;
  private readonly openRedirectionUrlLink: Locator;
  private readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.closeXButton = page.getByTestId('auth-data-close-x-button');
    this.routeNameInput = page.getByTestId('auth-data-route-name-input');
    this.copyRouteNameButton = page.getByTestId('auth-data-copy-route-name-button');
    this.clientIdInput = page.getByTestId('auth-data-client-id-input');
    this.copyClientIdButton = page.getByTestId('auth-data-copy-client-id-button');
    this.redirectionUrlInput = page.getByTestId('auth-data-redirection-url-input');
    this.copyRedirectionUrlButton = page.getByTestId('auth-data-copy-redirection-url-button');
    this.openRedirectionUrlLink = page.getByTestId('auth-data-open-redirection-url-link');
    this.closeButton = page.getByTestId('auth-data-close-button');
  }

  async copyRouteName() {
    await this.copyRouteNameButton.click();
  }

  async copyClientId() {
    await this.copyClientIdButton.click();
  }

  async copyRedirectionUrl() {
    await this.copyRedirectionUrlButton.click();
  }

  async openRedirectionUrl() {
    await this.openRedirectionUrlLink.click();
  }

  async close() {
    await this.closeButton.click();
  }

  async closeX() {
    await this.closeXButton.click();
  }

  getRouteNameInput(): Locator {
    return this.routeNameInput;
  }

  getClientIdInput(): Locator {
    return this.clientIdInput;
  }

  getRedirectionUrlInput(): Locator {
    return this.redirectionUrlInput;
  }

  async isVisible(): Promise<boolean> {
    return this.routeNameInput.isVisible();
  }

  async waitForVisible() {
    await this.routeNameInput.waitFor({ state: 'visible' });
  }

  async getRouteNameValue(): Promise<string> {
    return this.routeNameInput.inputValue();
  }

  async getClientIdValue(): Promise<string> {
    return this.clientIdInput.inputValue();
  }

  async getRedirectionUrlValue(): Promise<string> {
    return this.redirectionUrlInput.inputValue();
  }
}
