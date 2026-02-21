import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('API Agents text is visible', async ({ page }) => {
  await page.goto('/org');
  await page.getByText(process.env.WORKSPACE_NAME!).click();
  await expect(page.getByRole('heading', { name: 'API Agents' })).toBeVisible();
});

test('Chatbot Agents text is visible', async ({ page }) => {
  await page.goto('/org');
  await page.getByText(process.env.WORKSPACE_NAME!).click();
  await page.getByRole('button', { name: 'Chatbot', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Chatbot Agents' })).toBeVisible();
});