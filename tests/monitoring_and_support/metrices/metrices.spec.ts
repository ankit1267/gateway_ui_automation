import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

const ORG_NAME = process.env.ORG_NAME!;
const ORG_ID = process.env.ORG_ID!;

test('Metrics – filters and dashboard validation', async ({ page }) => {
  await page.goto('/org');
  await page.getByText(`${ORG_NAME}`).click();

  // -----------------------------
  // Open Metrics
  // -----------------------------
  await page.getByRole('button', { name: /metrics/i }).click();

  // Metrics dashboard should load
  await expect(
    page.getByText('Metrics Dashboard', { exact: false })
  ).toBeVisible();

  // -----------------------------
  // Group By filter
  // -----------------------------
  const groupByButton = page.locator('#metrics-filter-group-by-button');
  await expect(groupByButton).toBeVisible();
  await groupByButton.click();

  // Assert dropdown opened
  await expect(page.getByText(/agent/i)).toBeVisible();

  // Close dropdown
  await groupByButton.click();

  // -----------------------------
  // Agent filter
  // -----------------------------
  const agentFilterButton = page.locator('#metrics-filter-agent-button');
  await expect(agentFilterButton).toBeVisible();
  await agentFilterButton.click();

  // Select "All Agents"
  await page.getByText('All Agents', { exact: false }).click();

  // -----------------------------
  // Time range filter
  // -----------------------------
  const timeRangeButton = page.locator('#metrics-filter-time-range-button');
  await expect(timeRangeButton).toBeVisible();
  await timeRangeButton.click();

  await page.getByText('30 days', { exact: true }).click();

  // -----------------------------
  // Metrics data / chart validation
  // -----------------------------
  // At least one chart or SVG should be rendered
  await expect(
    page.locator('svg').first()
  ).toBeVisible();
});
