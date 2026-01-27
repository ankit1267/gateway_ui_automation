import { test, expect, Page } from '@playwright/test';
import { ApiAgentCreatePage } from '../../pages/api_agent/apiAgentCreatePage';

test.use({ storageState: 'auth.json' });

const ORG_ID = process.env.ORG_ID

test.describe('@regression Agent name edit validation', () => {

  const createAgentAndOpenConfig = async (page: Page) => {
    await page.goto(`org/${ORG_ID}/agents`);
    //await page.getByText('My_Space').click();
    await page.getByRole('button', { name: '+ Create New API Agent' }).click();

    await page
      .locator('#default-agent-sidebar')
      .getByRole('button', { name: 'Create Agent' })
      .click();
  };
  test.afterEach(async ({ page }) => {
  const api = new ApiAgentCreatePage(page);
  const agentNameEl = page.locator('#navbar-agent-name-display');

  // Only clean up if agent UI exists
  if (await agentNameEl.count() === 0) return;

  await expect(agentNameEl).toBeVisible({ timeout: 15000 });

  const agentName = (await agentNameEl.textContent())?.trim();
  expect(agentName).toBeTruthy();

  await api.deleteAgentByName(agentName!);
});

  

  const openEditName = async (page: Page) => {
   await page.locator('.lucide.lucide-pen').first().click();
  };


  

  const agentNameInput = (page: Page) => page.locator('input[type="text"]').nth(3);


  test('Agent name cannot be empty', async ({ page }) => {
  
    await createAgentAndOpenConfig(page);
    const agentNameDisplay = page.getByText(/untitled_agent_/i).first();
    const originalName = (await agentNameDisplay.textContent())!.trim();

    await openEditName(page);

    await agentNameInput(page).fill('');
    await agentNameInput(page).press('Enter');
    await page.locator('.hidden').first().click();
    // Validation: name should remain the same since empty is not allowed
    await expect(agentNameDisplay).toHaveText(originalName);
  });

  test('Agent name should not allow special characters', async ({ page }) => {
    await createAgentAndOpenConfig(page);
    const agentNameDisplay = page.getByText(/untitled_agent_/i).first();
    const originalName = (await agentNameDisplay.textContent())!.trim();
    await openEditName(page);

    await agentNameInput(page).fill('@#$%');
    await agentNameInput(page).press('Enter');

     await expect(agentNameDisplay).toHaveText(originalName);
  });

  test('Agent name should have a max length of 51 characters', async ({ page }) => {
    await createAgentAndOpenConfig(page);
    const longName = 'A'.repeat(53);
    await openEditName(page);
    const input = agentNameInput(page);
    await input.fill(longName);
    const value = await input.inputValue();

    expect(value.length).toBeLessThanOrEqual(50); 
   
  });

});
