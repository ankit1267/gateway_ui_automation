import { test, expect, Page } from '@playwright/test';
import { ChatbotAgentPage } from '../../pages/chatbotAgentCreatePage';

test.use({ storageState: 'auth.json' });

const ORG_NAME = process.env.ORG_NAME!;
const ORG_ID = process.env.ORG_ID!;

test.describe('@regression Agent name validation', () => {

  let api: ChatbotAgentPage;

  // ------------------------------------
  // Runs before each test
  // ------------------------------------
  test.beforeEach(async ({ page }) => {
    api = new ChatbotAgentPage(page);

    await page.goto('/org');
    await page.getByText(`${ORG_NAME}`).click();

    await page.getByRole('button', { name: '+ Create New Chatbot Agent' }).click();

    await page
      .locator('#default-agent-sidebar')
      .getByRole('button', { name: 'Create Agent' })
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

});
