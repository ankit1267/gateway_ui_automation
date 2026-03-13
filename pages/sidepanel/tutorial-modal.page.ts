import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class TutorialModalPage {
  readonly page: Page;
  readonly tutorialButton: Locator;
  readonly modalDialog: Locator;
  readonly modalContainer: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tutorialButton = page.locator('#main-slider-tutorial-button');
    this.modalDialog = page.getByTestId('TUTORIAL_MODAL');
    this.modalContainer = page.getByTestId('tutorial-modal-container');
    this.closeButton = page.getByTestId('tutorial-close-button');
  }

  async clickTutorialButton() {
    await this.tutorialButton.click();
  }

  async expectModalVisible() {
    await expect(this.modalContainer).toBeVisible();
  }

  async expectModalNotVisible() {
    await expect(this.modalDialog).not.toHaveAttribute('open', '');
  }

  async clickCloseButton() {
    await this.closeButton.click();
  }

  async getTutorialItemCount(): Promise<number> {
    const items = this.page.locator('[data-testid^="tutorial-item-"]');
    return items.count();
  }

  async expectTutorialItemVisible(index: number) {
    await expect(this.page.getByTestId(`tutorial-item-${index}`)).toBeVisible();
  }

  async expectTutorialItemsHaveTitleAndDescription() {
    const items = this.page.locator('[data-testid^="tutorial-item-"]');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const text = await item.innerText();
      expect(text.trim().length).toBeGreaterThan(0);
    }
  }

  async clickWatchButton(index: number) {
    await this.page.getByTestId(`tutorial-watch-button-${index}`).click();
  }

  async expectWatchButtonVisible(index: number) {
    await expect(this.page.getByTestId(`tutorial-watch-button-${index}`)).toBeVisible();
  }

  async expectToggleVisible(index: number) {
    await expect(this.page.getByTestId(`tutorial-toggle-${index}`)).toBeVisible();
  }

  async clickToggle(index: number) {
    await this.page.getByTestId(`tutorial-toggle-${index}`).click();
  }

  async expectCloseVideoButtonVisible(index: number) {
    await expect(this.page.getByTestId(`tutorial-close-video-button-${index}`)).toBeVisible();
  }

  async clickCloseVideoButton(index: number) {
    await this.page.getByTestId(`tutorial-close-video-button-${index}`).click();
  }

  async expectVideoSectionExpanded(index: number) {
    await this.expectCloseVideoButtonVisible(index);
  }

  async expectVideoSectionCollapsed(index: number) {
    await expect(this.page.getByTestId(`tutorial-close-video-button-${index}`)).not.toBeVisible();
  }

  async expectAllWatchButtonsVisible() {
    const items = this.page.locator('[data-testid^="tutorial-item-"]');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await this.expectWatchButtonVisible(i);
    }
  }

  async expectAllTogglesVisible() {
    const items = this.page.locator('[data-testid^="tutorial-item-"]');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await this.expectToggleVisible(i);
    }
  }
}
