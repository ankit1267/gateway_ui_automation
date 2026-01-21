import { test, expect } from '@playwright/test';
import { openModelTab } from '../../helper/openModelTab';
import { selectServiceProvider } from '../../helper/selectServiceProvider';

test.use({
  storageState: 'auth.json'
});



test('TC-MODEL-01: Select Mistral as Service Provider', async ({ page }) => {
  await openModelTab(page);
  await selectServiceProvider(page, 'Mistral');
});


test('TC-MODEL-02: Verify Model List Loads for Mistral', async ({ page }) => {
  await openModelTab(page);
  await selectServiceProvider(page, 'Mistral');

  await page
  .locator('#model-tab-config-section')
  .getByText('Model', { exact: true })
  .locator('..')
  .getByRole('button')
  .click();

  const mistralModels = [
    'mistral-medium-latest',
    'magistral-medium-latest',
    'codestral-latest',
    'mistral-small-latest',
    'magistral-small-latest',
  ];

  for (const model of mistralModels) {
    await expect(
      page.getByRole('option', { name: model })
    ).toBeVisible();
  }
});



test('TC-MODEL-03: Verify Model List Loads for Openai', async ({ page }) => {
  await openModelTab(page);
  await selectServiceProvider(page, 'Openai');

  await page
  .locator('#model-tab-config-section')
  .getByText('Model', { exact: true })
  .locator('..')
  .getByRole('button')
  .click();

  const openAiModels = [
    'gpt-5',
    'gpt-5-nano',
    'gpt-4o-mini',
    'chatgpt-4o-latest',
    'gpt-4.1',
    'gpt-4.1-mini',
    'gpt-4.1-nano',
  ];

  for (const model of openAiModels) {
    await expect(
      page.getByRole('option', { name: model ,exact: true})
    ).toBeVisible();
  }
});

test('TC-MODEL-04: Verify Model List Loads for Anthropic', async ({ page }) => {
  await openModelTab(page);
  await selectServiceProvider(page, 'Anthropic');

  await page
  .locator('#model-tab-config-section')
  .getByText('Model', { exact: true })
  .locator('..')
  .getByRole('button')
  .click();

  const anthropicModels = [
    'claude-3-7-sonnet-latest',
    'claude-3-7-sonnet-latest'
  ];

  for (const model of anthropicModels) {
    await expect(
      page.getByRole('option', { name: model ,exact: true})
    ).toBeVisible();
  }
});

test('TC-MODEL-05: Verify Model List Loads for Groq', async ({ page }) => {
  await openModelTab(page);
  await selectServiceProvider(page, 'Groq');

  await page
  .locator('#model-tab-config-section')
  .getByText('Model', { exact: true })
  .locator('..')
  .getByRole('button')
  .click();

  const groq = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant'
  ];

  for (const model of groq) {
    await expect(
      page.getByRole('option', { name: model ,exact: true})
    ).toBeVisible();
  }
});

test('TC-MODEL-06: Verify Model List Loads for Gemini', async ({ page }) => {
  await openModelTab(page);
  await selectServiceProvider(page, 'Gemini');

  await page
  .locator('#model-tab-config-section')
  .getByText('Model', { exact: true })
  .locator('..')
  .getByRole('button')
  .click();

  const gemini = [
    'gemini-2.5-pro',
    'gemini-2.5-flash-lite'
  ];

  for (const model of gemini) {
    await expect(
      page.getByRole('option', { name: model ,exact: true})
    ).toBeVisible();
  }
});

test('TC-MODEL-07: Verify Model List Loads for Ai-ml', async ({ page }) => {
  await openModelTab(page);
  await selectServiceProvider(page, 'Ai ml');

  await page
  .locator('#model-tab-config-section')
  .getByText('Model', { exact: true })
  .locator('..')
  .getByRole('button')
  .click();

  const aiml = [
    'gpt-oss-120b',
    'gpt-oss-20b'
  ];

  for (const model of aiml) {
    await expect(
      page.getByRole('option', { name: model ,exact: true})
    ).toBeVisible();
  }
});

test('TC-MODEL-07: Verify Model List Loads for Grok', async ({ page }) => {
  await openModelTab(page);
  await selectServiceProvider(page, 'Grok');

  await page
  .locator('#model-tab-config-section')
  .getByText('Model', { exact: true })
  .locator('..')
  .getByRole('button')
  .click();

  const grok = [
    'grok-4-fast',
    'grok-4-0709'
  ];

  for (const model of grok) {
    await expect(
      page.getByRole('option', { name: model ,exact: true})
    ).toBeVisible();
  }
});

