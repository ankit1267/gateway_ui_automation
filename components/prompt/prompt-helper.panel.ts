import type { Page, Locator, FrameLocator } from '@playwright/test';

import { expect } from '@playwright/test';



export class PromptHelperPanel {

  private readonly page: Page;

  private readonly openHelperButton: Locator;

  private readonly closeHelperButton: Locator;

  private readonly messagesPanel: Locator;

  private readonly configScrollContainer: Locator;

  private readonly canvasInstructionTextarea: Locator;

  private readonly techDocFrame: FrameLocator;

  private readonly mainContent: Locator;



  constructor(page: Page) {

    this.page = page;

    this.openHelperButton = page.getByTestId('prompt-header-open-helper-button');

    this.closeHelperButton = page.getByTestId('prompt-header-close-helper-button');

    this.messagesPanel = page.locator('#messages');

    this.configScrollContainer = page.locator('#config-scroll-container');

    this.canvasInstructionTextarea = page.getByTestId('canvas-instruction-textarea');

    this.techDocFrame = page.frameLocator('#iframe-component-techdocEmbed');

    this.mainContent = page.getByRole('main');

  }



  async open() {

    await this.page.getByRole('textbox', { name: 'e.g. Always be polite. Never' }).click();

    await this.openHelperButton.click();

  }



  async close() {

    await this.closeHelperButton.click();

  }



  async expectVisible() {

    await expect(this.messagesPanel).toBeVisible();

    await expect(this.configScrollContainer).toBeVisible();

    await expect(this.canvasInstructionTextarea).toBeVisible();

  }



  async expectTipTapEditorVisible() {

    await expect(

      this.techDocFrame.locator('#tiptap-editor')

    ).toBeVisible();

  }



  async expectMainVisible() {

    await expect(this.mainContent).toBeVisible();

  }

}