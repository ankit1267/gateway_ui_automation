import { test, expect } from '@playwright/test';
import { ApiAgentCreatePage } from '../../../pages/api_agent/apiAgentCreatePage';

test.use({ storageState: 'auth.json' });

const WORKSPACE = process.env.WORKSPACE_NAME!;
const AGENT_NAME = process.env.AGENT_NAME!;

test.beforeEach(async ({ page }) => {
  await page.goto('/org');
  await page.getByText(WORKSPACE).click();
  await page.getByText(AGENT_NAME, { exact: true }).click();
  await page.getByRole('button', { name: 'New', exact: true }).click();
});

test('Version cannot be created with empty description', async ({ page }) => {

  page.once('dialog', async dialog => {
    expect(dialog.message()).toMatch(/description/i);
    await dialog.dismiss();
  });

  await page
    .getByRole('dialog')
    .getByTestId('version-description-create-button')
    .click();
});

test('Version can be created with valid description', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Enter version description' }).fill('version');
  await page
    .getByRole('dialog')
    .getByTestId('version-description-create-button')
    .click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'New version created' })
  ).toBeVisible();
  await page.locator('.lucide.lucide-trash2').first().click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();

});


