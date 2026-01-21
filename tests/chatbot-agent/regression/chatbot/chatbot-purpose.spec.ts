import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json',
});

test('Create chatbot with purpose and verify generated prompt', async ({ page }) => {
  // Open agents page
  await page.goto('https://app.gtwy.ai/org/57294/agents?type=chatbot');

  // Create new chatbot
  await page.getByRole('button', { name: '+ Create New Chatbot Agent' }).click();

  const sidebar = page.locator('#default-agent-sidebar');
  await expect(sidebar).toBeVisible();

  // Fill purpose
  await sidebar
    .getByRole('textbox', { name: 'Agent purpose description' })
    .fill('A customer support agent');

  // Create agent
  await sidebar.getByRole('button', { name: 'Create Agent' }).click();

  await page.goto(
    'https://app.gtwy.ai/org/57294/agents/configure/696e198eeee863e59dd64cef?version=696e198eeee863e59dd64cf1&type=chatbot'
  );


  // Ensure Prompt tab is active
  await page.getByRole('tab', { name: 'Prompt' }).click();

  // Scope to System Prompt container
  const systemPromptContainer = page
    .getByText('System Prompt', { exact: true })
    .locator('..');

  // Target the actual prompt editor (role=textbox)
  const systemPrompt = systemPromptContainer.getByRole('textbox');

  // Wait until visible
  await expect(systemPrompt).toBeVisible({ timeout: 20000 });

  // Wait until content is generated
  await expect
    .poll(async () => {
      const text = await systemPrompt.inputValue();
      return text && text.trim().length > 20;
    })
    .toBeTruthy();

  // Assertions
  const promptText = (await systemPrompt.inputValue()).toLowerCase();

  await expect(promptText).toContain('customer');
  await expect(promptText).toContain('support');
  await expect(promptText).toContain('agent');



});
