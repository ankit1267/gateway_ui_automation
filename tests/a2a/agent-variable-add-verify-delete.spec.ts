import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });


test.beforeEach(async ({ page }) => {
  await page.goto('/org');
  await page.getByText('Test Space').click();
  await page.getByRole('button', { name: 'Chatbot', exact: true }).click();

  // Open agent
  await page
    .getByTestId('custom-table-row-69901845a2b76c9f0e179aa0')
    .getByText('Parental Guidance')
    .click();
});

test('add age variable, verify in payload, then delete', async ({ page }) => {

  // -------------------------
  // Open Connector Config
  // -------------------------
  await page.getByTestId('tab-button-connectors').click();

  await page
    .getByTestId('connected-agent-config-button-699018caa2b76c9f0e179bee')
    .click();

  const modal = page.getByTestId('AGENT_VARIABLE_MODAL');

  // -------------------------
  // Add Variable: age
  // -------------------------
  await modal.getByRole('button', { name: 'Parameter', exact: true }).click();

  const paramName = page.getByTestId('param-name-input-new0');
  await expect(paramName).toBeVisible();
  await paramName.fill('age');
  await paramName.press('Enter');
  const checkbox = page.getByTestId('param-required-checkbox-age');
  await expect(checkbox).toBeVisible();
  await checkbox.check();
  await page.getByTestId('param-type-select-age').selectOption('number');
  await page.getByTestId('param-value-path-input-age').fill('age');

  await modal.getByRole('button', { name: 'Save' }).click();

  // -------------------------
  // Send User Query
  // -------------------------
  const frame = page
    .locator('#iframe-component-interfaceEmbed')
    .contentFrame();

  const button = frame.getByRole('button').nth(1);
  await expect(button).toBeVisible();
  await button.click();

  const input = frame.getByRole('textbox', {
    name: 'Message AI Assistant...'
  });

  await expect(input).toBeVisible();
  await input.fill('hello i am tilak');
  await input.press('Enter');

  const scrollable = frame.locator('#scrollableDiv');

  //  Child Agent executed
  await expect(
    scrollable.getByText(/Function executed/i)
  ).toBeVisible({ timeout: 40000 });
});

test('Verfiy age variaable passed', async ({ page }) => {


  // Open history
  await page.getByTestId('navbar-tab-history').click();

  const frame = page
    .locator('#iframe-component-interfaceEmbed')
    .contentFrame();
    
  if(await frame.getByRole('img').nth(1).isVisible()){
    await frame.getByRole('img').nth(1).click();
  }
  
  // Click first tool item (dynamic id safe)
  const toolItem = page
    .locator('[data-testid^="thread-item-tool-data-"]')
    .first();

  await expect(toolItem).toBeVisible();
  if(await frame.getByRole('img').nth(1).isVisible()){
    await frame.getByRole('img').nth(1).click();
  }
  await toolItem.click();

  // Assert variable JSON
  await expect(
    page.getByText(/"age"\s*:\s*\d+/)
  ).toBeVisible();

  await page.getByTestId('tools-data-modal-close-button').click();

  // -------------------------
  // Delete Variable
  // -------------------------
  const modal = page.getByTestId('AGENT_VARIABLE_MODAL');
  await page.getByTestId('navbar-tab-configure').click();
  await page.getByTestId('tab-button-connectors').click();

  await page
    .getByTestId('connected-agent-config-button-699018caa2b76c9f0e179bee')
    .click();

  await page.getByTestId('param-delete-button-age').click();

  await modal.getByRole('button', { name: 'Save' }).click();


});