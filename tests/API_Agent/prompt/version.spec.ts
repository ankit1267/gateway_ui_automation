import { test, expect } from '@playwright/test';
import { ApiAgentCreatePage } from '../../../pages/api_agent/apiAgentCreatePage';

test.use({ storageState: 'auth.json' });

const setup = async (page: any) => { 
  await page.goto('/org');
 const createPage = new ApiAgentCreatePage(page);
 
  await createPage.openCreateAgent();
  await createPage.createAgentWithPurpose();
  
  await page.getByRole('button', { name: 'New', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Create New Version' });
  const desc = page.locator('input[type="text"]').first();
  const createBtn = await page.getByRole('button', { name: 'Create' }).nth(4);
  return { dialog, desc, createBtn, page };
};

test('Version cannot be created with empty description', async ({ page }) => {
  const { dialog, desc, createBtn } = await setup(page);
  await createBtn.click();
  await expect(desc).toHaveValue('');
});

test('Version can be created with valid description', async ({ page }) => {
  const { dialog, desc, createBtn } = await setup(page);
  await desc.fill('version 1');
  await createBtn.click();
  await expect(dialog).not.toBeVisible();
});
