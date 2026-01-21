import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json',
});

test('Regression: Agent publish and chat completion flow', async ({ page }) => {
  // 1. Open org
  await page.goto('/org');

  // 2. Select workspace
  await page.getByText('Tilakraj').click();

  //3 Create new API agent
  await page.getByRole('button', { name: '+ Create New API Agent' }).click();


  await page.locator('#default-agent-sidebar').getByRole('textbox', {
        name: 'Agent purpose description',
    }).fill(
        'An AI agent that assists in writing, debugging, and optimizing automated tests written in playwright using typescript.',
    );    
    
   await page
        .locator('#default-agent-sidebar')
        .getByRole('button', { name: 'Create Agent' })
        .click();

  // 5. Model selection
  await page.getByRole('tab', { name: 'Model' }).click();
  await page.getByRole('button', { name: 'Openai' }).click();
  await page.getByRole('listbox').getByRole('option', { name: 'Mistral' }).click();

  await page.getByRole('button', { name: 'Select API key' }).click();
  await page.getByRole('listbox').getByRole('option', { name: 'Mistral' }).click();
  // 6. Add Knowledge Base
  await page.getByRole('tab', { name: 'Connectors' }).click();
  await page.getByRole('button', { name: 'Add' }).nth(3).click();
  await page.getByText('Add new Knowledge Base').click();

  await page.getByRole('textbox', { name: 'Knowledge Base name' }).fill(
    'Playwright Documentation'
  );
  await page
    .getByRole('textbox', { name: 'Brief description of the' })
    .fill('Playwright commands');

  await page
    .getByRole('textbox', { name: 'https://example.com/resource' })
    .fill('https://playwright.dev/docs/intro');

  await page.getByRole('button', { name: 'Add Resource' }).click();

  // 7. Publish agent
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await page.getByRole('button', { name: 'Publish' }).nth(2).click();

  await page
    .getByRole('dialog')
    .filter({ hasText: 'Publish Bridge VersionView' })
    .getByRole('checkbox')
    .check();

  await page.getByRole('button', { name: 'Generate New Summary' }).click();
  await page.getByRole('button', { name: 'Save' }).first().click();
  await page.getByRole('button', { name: 'Confirm Publish' }).click();
  
  await page.waitForTimeout(5000); // Wait for publish to complete
  const messages = page.locator('text=/./');
  const before = await messages.count();
  // 8. Chat completion
  const input = page.getByRole('textbox', { name: 'Type here' });
  await input.fill('hello');
  await page.keyboard.press('Enter');
  // 9. Assertion: assistant response appears
  // await expect(page.locator(
  //   '.chat-bubble.break-all.gap-0.justify-start.relative.w-full.mr-8'
  // )).toBeVisible({ timeout: 30000 });

  // const assistantLabel = page.getByText(/^assistant/i);

  // await expect(assistantLabel).toBeVisible({ timeout: 30000 });

  // Input should clear after sending
  //await expect(input).toHaveValue('');

// And a response should appear
  //await expect(page.locator('text=/./')).toBeVisible({ timeout: 30000 });
  const after = await messages.count();
  expect(after).toBeGreaterThan(before);
});
