import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('TC-CONNECTOR-01: ViaSocket embed is visible when adding a tool', async ({ page }) => {
  // Step 1: Go to agents page
  await page.goto('https://dev.gtwy.ai/org/57719/agents');

  // Step 2: Open agent (use text, not row ID)
  await page.getByText('Gesture Game Assistant_1').click();

  // Step 3: Open Connectors tab
  await page.getByRole('tab', { name: 'Connectors' }).click();

  // Step 4: Click "Add Tool"
  await page.locator('#embed-list-add-first-tool-button').click();

  // Step 5: Click "Add new Tools"
  await page.getByText('Add new Tools').click();

  // Assertion: ViaSocket embed is visible
  await expect(
    page.locator('#viasocket-embed-header')
  ).toBeVisible();
});
