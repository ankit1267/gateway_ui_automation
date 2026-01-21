import { test, expect, Page } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test.describe('@regression Agent name edit validation', () => {

  const createAgentAndOpenConfig = async (page: Page) => {
    await page.goto('org/58161/agents');
    //await page.getByText('My_Space').click();
    await page.getByRole('button', { name: '+ Create New API Agent' }).click();

    await page
      .locator('#default-agent-sidebar')
      .getByRole('button', { name: 'Create Agent' })
      .click();
  };

  

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

    // ✅ Validation: name should remain the same since empty is not allowed
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
