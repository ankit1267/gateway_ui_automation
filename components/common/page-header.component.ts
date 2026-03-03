import type { Page, Locator } from '@playwright/test';

export class PageHeader {
  private readonly container: Locator;
  private readonly title: Locator;
  private readonly description: Locator;
  private readonly learnMoreLink: Locator;

  constructor(private readonly page: Page, titleText?: string) {
    this.container = page.getByTestId('page-header-container');
    this.title = titleText
      ? page.getByRole('heading', { name: titleText })
      : this.container.locator('h1');
    this.description = this.container.locator('p');
    this.learnMoreLink = page.getByTestId('page-header-learn-more-link');
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible();
  }

  async waitForVisible() {
    await this.container.waitFor({ state: 'visible' });
  }

  getTitleLocator(): Locator {
    return this.title;
  }

  async getTitleText(): Promise<string> {
    return this.title.innerText();
  }

  getDescriptionLocator(): Locator {
    return this.description;
  }

  async getDescriptionText(): Promise<string> {
    return this.description.innerText();
  }

  getLearnMoreLocator(): Locator {
    return this.learnMoreLink;
  }

  async isLearnMoreVisible(): Promise<boolean> {
    return this.learnMoreLink.isVisible();
  }

  async clickLearnMore() {
    await this.learnMoreLink.click();
  }

  async openLearnMoreInNewTab(): Promise<Page> {
    const popupPromise = this.page.waitForEvent('popup');
    await this.learnMoreLink.click();
    const newPage = await popupPromise;
    await newPage.waitForLoadState();
    return newPage;
  }
}
