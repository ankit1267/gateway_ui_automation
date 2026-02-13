import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('Memory feature should enable, save context, and persist', async ({ page }) => {

  const memoryText = 'remember my conversation';
  const WORKSPACE_NAME = process.env.WORKSPACE_NAME!;
  const CHATBOT_AGENT = process.env.CHATBOT_AGENT!;

 
 // Open agents page
  await page.goto('/org');
  await page.getByText(`${WORKSPACE_NAME}`).click();
  await page.getByRole('button', { name: 'Chatbot', exact: true }).click();

  await page
    .getByTestId('custom-table-row-69845b02ff78d5f934bb77f6')
    .getByText(`${CHATBOT_AGENT}`)
    .click();

  // Open Memory tab
  await page.getByTestId('tab-button-memory').click();
  await page.getByTestId('memory-tab-container').getByText('Memory Context').click();

  const toggle = page.getByTestId('gpt-memory-toggle');
  const textarea = page.getByTestId('gpt-memory-context-textarea');

  // Enable memory if disabled
  if (!(await toggle.isChecked())) {
    await toggle.check();
    await expect(toggle).toBeChecked();
  }

  // Clear and fill memory context
  await textarea.fill('');
  await textarea.fill(memoryText);

  // Validate text is saved in UI
  await expect(textarea).toHaveValue(memoryText);

  // Navigate away
  await page.getByTestId('tab-button-integration').click();

  // Come back to Memory tab
  await page.getByTestId('tab-button-memory').click();

  // Verify persistence
  await expect(textarea).toHaveValue(memoryText);

  // Disable memory
  await toggle.uncheck();
  await expect(toggle).not.toBeChecked();

});
