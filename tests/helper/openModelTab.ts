import { Page } from '@playwright/test';

export async function openModelTab(page: Page) {
  // Navigate to org
  await page.goto('/org');

  // Open workspace
  await page.getByText('Tilakraj').click();

  // Open agent
  await page
    .getByRole('table')
    .getByText('Gesture Game Assistant_1')
    .click();

  // Open Model tab
  await page.getByRole('tab', { name: 'Model' }).click();
  
}
