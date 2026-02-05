import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('Auth Key – validation, create, copy and delete', async ({ page }) => {
  await page.goto('https://dev.gtwy.ai/org/57720/agents?type=chatbot');

  // -----------------------------
  // Open Auth Key section
  // -----------------------------
  await page.getByRole('button', { name: 'Auth Key' }).click();

  // -----------------------------
  // TC-01: Validation – empty name
  // -----------------------------
  await page.getByRole('button', { name: '+ Create New Auth Key' }).click();
  await page.getByRole('button', { name: '+ Create', exact: true }).click();

  await expect(
    page.getByText('The name must be at least 3')
  ).toBeVisible();

  // -----------------------------
  // TC-02: Create Auth Key
  // -----------------------------
  await page.getByRole('button', { name: '+ Create New Auth Key' }).click();

  const nameInput = page.getByRole('textbox', { name: 'Name* :' });
  await nameInput.fill('new1');

  await page.getByRole('button', { name: '+ Create', exact: true }).click();

  await page
    .locator('.Toastify__toast--success', {
      hasText: 'Auth key created successfully'
    })
    .waitFor({ state: 'attached' });

  // Confirm key appears in list
  await expect(page.getByText('new1')).toBeVisible();

  // -----------------------------
  // TC-03: Copy Auth Key
  // -----------------------------
  const copyButton = page.locator('[data-tip="copy"]').first();

  // Ensure tooltip is interactable
  await copyButton.scrollIntoViewIfNeeded();
  await copyButton.hover(); // important for tooltip-based actions
  await copyButton.click();


  await page
    .locator('.Toastify__toast--success', {
      hasText: 'Content copied to clipboard'
    })
    .waitFor({ state: 'attached' });

  // -----------------------------
  // TC-04: Delete Auth Key
  // -----------------------------
  const deleteTrigger = page.locator('.tooltip > a').first();
  await deleteTrigger.click();

  await page.getByRole('button', { name: 'Delete' }).click();

  await page
    .locator('.Toastify__toast--success', {
      hasText: 'Auth Key Deleted Successfully'
    })
    .waitFor({ state: 'attached' });
});
