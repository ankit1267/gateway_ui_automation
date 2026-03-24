import { test, expect } from '../../fixtures/base.fixture';

test('Create chatbot with purpose and verify generated prompt', async ({ agents, page }) => {
  // Open agents page
  await agents.goto('chatbot');

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

  // Ensure Prompt tab is active
  await page.getByRole('tab', { name: 'Prompt' }).click();

  await expect(page.getByTestId('prompt-header-default')).toBeVisible();
  const systemPrompt = page.getByTestId('prompt-textarea')
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

  const agentName = await page.getByTestId('navbar-agent-name-display').innerText();

  await page.locator('#main-slider-toggle-button').click();
  await page.getByRole('button', { name: 'Chatbot', exact: true }).click();

  const agentRow = page.getByRole('row').filter({ hasText: agentName });
  await agentRow.getByRole('button').last().click();
  await page
    .locator('div[role="button"] svg.rotate-90')
    .first()
    .locator('..')
    .click();

  // Delete flow
  await page
    .getByRole('button', { name: 'Delete Agent' })
    .click();

  await page
    .getByRole('button', { name: 'Delete' })
    .click();
});
