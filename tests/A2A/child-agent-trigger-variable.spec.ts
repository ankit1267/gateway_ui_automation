import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
  await page.goto('/org');
  await page.getByText('Test Space').click();
  await page.getByRole('button', { name: 'Chatbot', exact: true }).click();

  // Open agent
  await page
    .getByTestId('custom-table-row-69901845a2b76c9f0e179aa0')
    .getByText('Parental Guidance')
    .click();
});

test('child agent is triggered', async ({ page }) => {

  const frame = page
    .locator('#iframe-component-interfaceEmbed')
    .contentFrame();


  const button = frame.getByRole('button').nth(1);
  await expect(button).toBeVisible();
  await button.click();

  const input = frame.getByRole('textbox', {
    name: 'Message AI Assistant...'
  });

  await expect(input).toBeVisible();
  await input.fill('My name is tilakraj');
  await input.press('Enter');

  const scrollable = frame.locator('#scrollableDiv');

  //  Child Agent executed
  await expect(
    scrollable.getByText(/Function executed/i)
  ).toBeVisible({ timeout: 30000 });

  //  Child Agent response
  await expect(scrollable)
    .toContainText('tilakraj', { timeout: 30000 });
});


test('child agent is triggered with variable', async ({ page }) => {
  // Open history
  await page.getByTestId('navbar-tab-history').click();
  const frame = page
    .locator('#iframe-component-interfaceEmbed')
    .contentFrame();
    
  if(await frame.getByRole('img').nth(1).isVisible()){
    await frame.getByRole('img').nth(1).click();
  }
  
  // Click first tool item (dynamic id safe)
  const toolItem = page
    .locator('[data-testid^="thread-item-tool-data-"]')
    .first();
  
 

  await expect(toolItem).toBeVisible();


  await toolItem.click();

  // Assert variable JSON
  await expect(
    page.getByText(/"user_name"\s*:\s*"tilakraj"/)
  ).toBeVisible();
});