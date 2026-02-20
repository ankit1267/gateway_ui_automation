import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('parameter input shows new0', async ({ page }) => {

  // Open org
  await page.goto('/org');
  await page.getByText('Test Space').click();
  await page.getByRole('button', { name: 'Chatbot', exact: true }).click();

  // Open agent
  await page
    .getByTestId('custom-table-row-69901845a2b76c9f0e179aa0')
    .getByText('Parental Guidance')
    .click();

  // Open connectors tab
  await page.getByTestId('tab-button-connectors').click();

  // Open connected agent config
  await page
    .getByTestId('connected-agent-config-button-699018caa2b76c9f0e179bee')
    .click();

  // Add parameter
  const modal = page.getByTestId('AGENT_VARIABLE_MODAL');

  await modal.getByRole('button', { name: 'Parameter', exact: true }).click();
  await modal.getByRole('button', { name: 'Save' }).click();

  // Reopen config so UI refreshes
  await page
    .getByTestId('connected-agent-config-button-699018caa2b76c9f0e179bee')
    .click();

  // Assert input exists and has value "new0"
  const paramInput = page.getByTestId('param-name-input-new0');

  await expect(paramInput).toBeVisible();
  await expect(paramInput).toHaveValue('new0');
  await page.getByTestId('param-delete-button-new0').click();
  await page.getByTestId('AGENT_VARIABLE_MODAL').getByRole('button', { name: 'Save' }).click();

});
