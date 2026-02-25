import { test, expect } from '@playwright/test';
import { WorkspacePage } from '../../pages/workspace.page';


test.use({
  storageState: 'auth.json'
});

test('API Agents text is visible', async ({ page }) => {
  const workspacePage = new WorkspacePage(page);
  await workspacePage.goto();
  await workspacePage.selectWorkspace(process.env.WORKSPACE_NAME!);
  await expect(page.getByRole('heading', { name: 'API Agents' })).toBeVisible();
});

test('Chatbot Agents text is visible', async ({ page }) => {
  const workspacePage = new WorkspacePage(page);
  await workspacePage.goto();
  await workspacePage.selectWorkspace(process.env.WORKSPACE_NAME!);
  await page.getByRole('button', { name: 'Chatbot', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Chatbot Agents' })).toBeVisible();
});