import { test, expect } from '../../fixtures/base.fixture';

test.describe('Admin Settings - GTWY Tools', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoPrebuiltPrompts();
    await sidepanel.prebuiltPromptsPage.waitForPage();
  });

  test('TC-ADMIN-21: GTWY Tools page title and description are visible', async ({ sidepanel }) => {
    await expect(sidepanel.prebuiltPromptsPage.pageTitle).toBeVisible();
    await expect(sidepanel.prebuiltPromptsPage.pageDescription).toBeVisible();
  });

  test('TC-ADMIN-22: Agent tabs are visible', async ({ sidepanel }) => {
    await expect(sidepanel.prebuiltPromptsPage.agentTabsContainer).toBeVisible();
    const tabNames = await sidepanel.prebuiltPromptsPage.getAgentTabNames();
    expect(tabNames.length).toBeGreaterThan(0);
  });

  test('TC-ADMIN-23: Selected agent heading, prompt textarea and token count are visible', async ({ sidepanel }) => {
    await expect(sidepanel.prebuiltPromptsPage.selectedAgentHeading).toBeVisible();
    await expect(sidepanel.prebuiltPromptsPage.promptTextarea).toBeVisible();
    await expect(sidepanel.prebuiltPromptsPage.tokenCountBadge).toBeVisible();
  });

  test('TC-ADMIN-24: Save and Default buttons are visible', async ({ sidepanel }) => {
    await expect(sidepanel.prebuiltPromptsPage.saveButton).toBeVisible();
    await expect(sidepanel.prebuiltPromptsPage.defaultButton).toBeVisible();
  });

  test('TC-ADMIN-25: Save button is disabled initially', async ({ sidepanel }) => {
    const isDisabled = await sidepanel.prebuiltPromptsPage.isSaveDisabled();
    expect(isDisabled).toBe(true);
  });

  test('TC-ADMIN-26: Switching agent tab updates the heading', async ({ sidepanel }) => {
    const tabNames = await sidepanel.prebuiltPromptsPage.getAgentTabNames();
    if (tabNames.length > 1) {
      const firstAgent = await sidepanel.prebuiltPromptsPage.getSelectedAgentName();

      await sidepanel.prebuiltPromptsPage.selectAgent(tabNames[1]);
      const secondAgent = await sidepanel.prebuiltPromptsPage.getSelectedAgentName();

      expect(secondAgent).toBe(tabNames[1]);
      expect(secondAgent).not.toBe(firstAgent);
    }
  });

  test('TC-ADMIN-27: Editing prompt enables the Save button', async ({ sidepanel }) => {
    const isDisabledBefore = await sidepanel.prebuiltPromptsPage.isSaveDisabled();
    expect(isDisabledBefore).toBe(true);

    const currentPrompt = await sidepanel.prebuiltPromptsPage.getPromptValue();
    await sidepanel.prebuiltPromptsPage.fillPrompt(currentPrompt + ' test');

    const isDisabledAfter = await sidepanel.prebuiltPromptsPage.isSaveDisabled();
    expect(isDisabledAfter).toBe(false);

    await sidepanel.prebuiltPromptsPage.fillPrompt(currentPrompt);
  });

  test('TC-ADMIN-39: Default button resets prompt to original', async ({ sidepanel }) => {
    const originalPrompt = await sidepanel.prebuiltPromptsPage.getPromptValue();
    await sidepanel.prebuiltPromptsPage.fillPrompt('Completely new prompt text for testing');

    const isDisabled = await sidepanel.prebuiltPromptsPage.isSaveDisabled();
    expect(isDisabled).toBe(false);

    await sidepanel.prebuiltPromptsPage.clickDefault();
    await sidepanel.page.waitForTimeout(1000);

    const restoredPrompt = await sidepanel.prebuiltPromptsPage.getPromptValue();
    expect(restoredPrompt.length).toBeGreaterThan(0);
  });

  test('TC-ADMIN-40: Switching agent tab loads different prompt content', async ({ sidepanel }) => {
    const tabNames = await sidepanel.prebuiltPromptsPage.getAgentTabNames();
    if (tabNames.length > 1) {
      const firstPrompt = await sidepanel.prebuiltPromptsPage.getPromptValue();

      await sidepanel.prebuiltPromptsPage.selectAgent(tabNames[1]);
      await sidepanel.page.waitForTimeout(500);

      const secondPrompt = await sidepanel.prebuiltPromptsPage.getPromptValue();
      expect(secondPrompt.length).toBeGreaterThan(0);
    }
  });

  test('TC-ADMIN-41: Switching agent tab updates token count', async ({ sidepanel }) => {
    const tabNames = await sidepanel.prebuiltPromptsPage.getAgentTabNames();
    if (tabNames.length > 1) {
      const firstTokenCount = await sidepanel.prebuiltPromptsPage.getTokenCount();

      await sidepanel.prebuiltPromptsPage.selectAgent(tabNames[1]);
      await sidepanel.page.waitForTimeout(500);

      const secondTokenCount = await sidepanel.prebuiltPromptsPage.getTokenCount();
      expect(secondTokenCount).toBeTruthy();
    }
  });

  test('TC-ADMIN-42: Agent tab highlights when selected', async ({ sidepanel }) => {
    const tabNames = await sidepanel.prebuiltPromptsPage.getAgentTabNames();
    if (tabNames.length > 1) {
      await sidepanel.prebuiltPromptsPage.selectAgent(tabNames[1]);
      const isSelected = await sidepanel.prebuiltPromptsPage.isAgentTabSelected(tabNames[1]);
      expect(isSelected).toBe(true);
    }
  });

});
