import { test, expect, Page } from '@playwright/test';
import { ApiAgentCreatePage } from '../../../pages/api-agent/api-agent-create.page';
import { navigateToAgents } from '../../../utils/navigation';

test.use({ storageState: 'auth.json' });

const ORG_ID = process.env.ORG_ID!;
const ORG_NAME = process.env.WORKSPACE_NAME;
test.describe('@regression Agent name validation', () => {

  let api: ApiAgentCreatePage;

  // ------------------------------------
  // Runs before each test
  // ------------------------------------
  test.beforeEach(async ({ page }) => {
    api = new ApiAgentCreatePage(page);

    await navigateToAgents(page, 'api');
    await page.getByTestId('create-new-agent-button').click();
    await page
      .locator('#default-agent-sidebar')
      .getByTestId('create-new-bridge-submit-button')
      .click();
  });

  // ------------------------------------
  // Cleanup after each test
  // ------------------------------------
  test.afterEach(async ({ page }) => {
    const agentNameEl = page.locator('#navbar-agent-name-display');
    if (await agentNameEl.count() === 0) return;

    const agentName = (await agentNameEl.textContent())?.trim();
    if (agentName) {
      await api.deleteAgentByName(agentName);
    }
  });

  // ------------------------------------
  // Locators
  // ------------------------------------

  const agentNameDisplay = (page: Page) =>
    page.locator('#navbar-agent-name-display');
  // BEST PRACTICE:
  // page.getByTestId('agent-name-display')

  const openEditName = async (page: Page) => {
    await page.locator('.lucide.lucide-pen').first().click();
  };
  // BEST PRACTICE:
  // page.getByTestId('edit-agent-name')

  const agentNameInput = (page: Page) =>
    page.locator('input[type="text"]').nth(3);
  // BEST PRACTICE:
  // page.getByTestId('agent-name-input')

  // ------------------------------------
  // Tests
  // ------------------------------------

  test('should not allow empty agent name', async ({ page }) => {
    const originalName =
      (await agentNameDisplay(page).textContent())!.trim();

    await openEditName(page);
    await agentNameInput(page).fill('');
    await agentNameInput(page).press('Enter');

    // blur input instead of clicking hidden elements
    await page.locator('.hidden').first().click();

    await expect(agentNameDisplay(page)).toHaveText(originalName);
  });

  test('should not allow special characters in agent name', async ({ page }) => {
    const originalName =
      (await agentNameDisplay(page).textContent())!.trim();

    await openEditName(page);
    await agentNameInput(page).fill('@#$%');
    await agentNameInput(page).press('Enter');

    await page.locator('body').click();

    await expect(agentNameDisplay(page)).toHaveText(originalName);
  });

  test('should enforce max length of 51 characters', async ({ page }) => {
    const longName = 'A'.repeat(60);

    await openEditName(page);

    const input = agentNameInput(page);
    await input.fill(longName);

    const value = await input.inputValue();

    expect(value.length).toBeLessThanOrEqual(51);

    await page.locator('.hidden').first().click();
  });

});
