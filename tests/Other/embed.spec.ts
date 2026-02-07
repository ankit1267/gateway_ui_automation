import { test, expect } from '@playwright/test';
import { ORG_ID } from '../../utils/env';

test.use({
  storageState: 'auth.json'
});

test('create embed and verify visibility', async ({ page }) => {
  await page.goto(`org/${ORG_ID}/integration`);
  await page.getByRole('button', { name: '+ Create New Embed' }).click();
  await page.getByRole('textbox', { name: 'Enter embed name' }).fill('My_Embed');
  await page.locator('#integration-create-button').click();
  await expect(
  page
    .locator('#custom-table')
    .getByRole('row', { name: /MyEmbed/ })
    ).toBeVisible();

});

test('create RAG and verify visibility', async ({ page }) => {
  await page.goto(`org/${ORG_ID}/RAG_embed`);
  await page.getByRole('button', { name: '+ Create New RAG Embed' }).click();
  const RAG_NAME = 'RAG'
  await page.getByRole('textbox', { name: 'Enter embed name' }).fill(RAG_NAME);
  await page.locator('#integration-create-button').click();
  await expect(
  page
    .locator('#custom-table')
    .getByRole('row', { name: /RAG_NAME/ })
    ).toBeVisible();
});