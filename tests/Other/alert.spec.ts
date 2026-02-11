import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

const ORG_NAME = process.env.ORG_NAME!;
const ORG_ID = process.env.ORG_ID!;
const WORKSPACE_NAME = process.env.WORKSPACE_NAME!;

test('Viasocket Embed visible when opening alert', async ({ page }) => {
 await page.goto('/org');
    await page.getByText(`${ORG_NAME}`).click();
  await expect(page.locator('#alert-embed-parent')).toBeVisible();
});

test('Viasocket Embed shows 3 alert', async ({ page }) => {
  await page.goto('/org');
  await page.getByText(`${WORKSPACE_NAME}`).click();
  await page.getByRole('button', { name: 'alerts' }).click();
  await expect(page.locator('#viasocket-embed-iframe-component').contentFrame().locator('div').filter({ hasText: /^Error Alert$/ }).first()).toBeVisible();
  await expect(page.locator('#viasocket-embed-iframe-component').contentFrame().locator('div').filter({ hasText: /^Missing Variable Alert$/ }).first()).toBeVisible();
  await expect(page.locator('#viasocket-embed-iframe-component').contentFrame().locator('div').filter({ hasText: /^retry alert is created$/ }).first()).toBeVisible();
});