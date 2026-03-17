import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginContainer: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;
  readonly googleLoginButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginContainer = page.getByTestId('login-container');
    this.termsLink = page.getByTestId('login-page-terms-link');
    this.privacyLink = page.getByTestId('login-page-privacy-link');
    this.googleLoginButton = page.getByRole('button', { name: /google/i });
    this.loginButton = page.getByTestId('login-button');
  }

  async goto() {
    await this.page.goto('/login');
    await this.page.waitForURL('/login');
  }

  async waitForPage() {
    await this.loginContainer.waitFor({ state: 'visible' });
  }

  async isLoginContainerVisible(): Promise<boolean> {
    return this.loginContainer.isVisible();
  }

  async clickTermsLink() {
    await this.termsLink.click();
  }

  async clickPrivacyLink() {
    await this.privacyLink.click();
  }

  async isTermsLinkVisible(): Promise<boolean> {
    return this.termsLink.isVisible();
  }

  async isPrivacyLinkVisible(): Promise<boolean> {
    return this.privacyLink.isVisible();
  }

  async getTermsLinkHref(): Promise<string | null> {
    return this.termsLink.getAttribute('href');
  }

  async getPrivacyLinkHref(): Promise<string | null> {
    return this.privacyLink.getAttribute('href');
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return this.loginButton.isVisible();
  }
}
