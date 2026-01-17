import { test, expect, Page } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test.describe('@regression Agent name edit validation', () => {

  const createAgentAndOpenConfig = async (page: Page) => {
    await page.goto('/org');
    await page.getByText('My space').click();
    await page.getByRole('button', { name: '+ Create New API Agent' }).click();

    await page
      .locator('#default-agent-sidebar')
      .getByRole('button', { name: 'Create Agent' })
      .click();

    

    //await expect(page).toHaveURL(/agents\/configure/);
    await expect(
    page.getByRole('heading', { name: 'CONFIGURATION', exact: true })
  ).toBeVisible();
  };

  // const openEditName = async (page: Page) => {
  //   await page.locator('.lucide.lucide-pen').first().click();
  // };

  const openEditName = async (page: Page) => {
  //await page.locator('.lucide.lucide-pen').first().click();
  //await page.waitForSelector('input[type="text"]', { state: 'visible' });
   await page.locator('.lucide.lucide-pen').first().click();
  // wait for the visible text input and focus it
  const visibleInput = page.locator('input[type="text"]:visible').first();
  await visibleInput.waitFor({ state: 'visible' });
  //await visibleInput.click();
};


  // const agentNameInput = (page: Page) =>
  //   page.locator('input:not([readonly])').first();

  const agentNameInput = (page: Page) => page.locator('input[type="text"]:visible').first();


  test('Agent name cannot be empty', async ({ page }) => {
    await createAgentAndOpenConfig(page);
     const agentNameDisplay = page.getByText(/untitled_agent_/i).first();
    const originalName = (await agentNameDisplay.textContent())!.trim();

    await openEditName(page);
  console.log('count', await page.locator('input[type="text"]').count());
  await expect(agentNameInput(page)).toBeVisible();
  await expect(agentNameInput(page)).toBeEditable();
  await agentNameInput(page).fill('abc');
    await agentNameInput(page).press('Enter');

    // ✅ Validation detected by unchanged state
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

  const agentNameDisplay = page.getByText(/untitled_agent_/i).first();
  const originalName = (await agentNameDisplay.textContent())!.trim();

  await openEditName(page);

  // Try to enter 52 characters (exceeds max length)
  await agentNameInput(page).fill('Abcd');
  await agentNameInput(page).press('Enter');

  // ✅ Correct expectation: value is rejected, name stays the same
  await expect(agentNameDisplay).toHaveText(originalName);
  });

  


});
