import { test, expect } from '@playwright/test';
import { ORG_ID, WORKSPACE_NAME } from '../../utils/env';

test.use({
  storageState: 'auth.json'
});

test('Viasocket Embed visible when opening alert', async ({ page }) => {
  await page.goto(`org/${ORG_ID}/alerts`);
  await expect(page.locator('#viasocket-embed-iframe-component')).toBeVisible();
});

test('Viasocket Embed shows 3 alert', async ({ page }) => {
  await page.goto('/org');
  await page.getByText(`${WORKSPACE_NAME}`).click();
  await page.getByRole('button', { name: 'alerts' }).click();
  await expect(page.locator('#viasocket-embed-iframe-component').contentFrame().locator('div').filter({ hasText: /^Error Alert$/ }).first()).toBeVisible();
  await expect(page.locator('#viasocket-embed-iframe-component').contentFrame().locator('div').filter({ hasText: /^Missing Variable Alert$/ }).first()).toBeVisible();
  await expect(page.locator('#viasocket-embed-iframe-component').contentFrame().locator('div').filter({ hasText: /^retry alert is created$/ }).first()).toBeVisible();
});