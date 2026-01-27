import { test } from '@playwright/test';
import { ModelPage } from '../../../pages/api_agent/modelPage';

test.use({ storageState: 'auth.json' });

test('TC-MODEL-01: Verify model list loads for Mistral', async ({ page }) => {
  const modelPage = new ModelPage(page);

  await modelPage.openModelTab();
  await modelPage.selectServiceProvider('Mistral');
  await modelPage.openModelDropdown();

  await modelPage.expectModelsVisible([
    'mistral-medium-latest',
    'magistral-medium-latest',
    'codestral-latest',
    'mistral-small-latest',
    'magistral-small-latest',
  ]);
});

test('TC-MODEL-02: Verify model list loads for OpenAI', async ({ page }) => {
  const modelPage = new ModelPage(page);

  await modelPage.openModelTab();
  await modelPage.selectServiceProvider('Openai');
  await modelPage.openModelDropdown();

  await modelPage.expectModelsVisible([
    'gpt-5',
    'gpt-5-nano',
    'gpt-4o-mini',
    'chatgpt-4o-latest',
    'gpt-4.1',
    'gpt-4.1-mini',
    'gpt-4.1-nano',
  ]);
});

test('TC-MODEL-03: Verify model list loads for Anthropic', async ({ page }) => {
  const modelPage = new ModelPage(page);

  await modelPage.openModelTab();
  await modelPage.selectServiceProvider('Anthropic');
  await modelPage.openModelDropdown();

  await modelPage.expectModelsVisible([
    'claude-3-7-sonnet-latest',
  ]);
});

test('TC-MODEL-04: Verify model list loads for Groq', async ({ page }) => {
  const modelPage = new ModelPage(page);

  await modelPage.openModelTab();
  await modelPage.selectServiceProvider('Groq');
  await modelPage.openModelDropdown();

  await modelPage.expectModelsVisible([
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
  ]);
});

test('TC-MODEL-05: Verify model list loads for Gemini', async ({ page }) => {
  const modelPage = new ModelPage(page);

  await modelPage.openModelTab();
  await modelPage.selectServiceProvider('Gemini');
  await modelPage.openModelDropdown();

  await modelPage.expectModelsVisible([
    'gemini-2.5-pro',
    'gemini-2.5-flash-lite',
  ]);
});

test('TC-MODEL-06: Verify model list loads for Ai-ml', async ({ page }) => {
  const modelPage = new ModelPage(page);

  await modelPage.openModelTab();
  await modelPage.selectServiceProvider('Ai ml');
  await modelPage.openModelDropdown();

  await modelPage.expectModelsVisible([
    'gpt-oss-120b',
    'gpt-oss-20b',
  ]);
});

test('TC-MODEL-07: Verify model list loads for Grok', async ({ page }) => {
  const modelPage = new ModelPage(page);

  await modelPage.openModelTab();
  await modelPage.selectServiceProvider('Grok');
  await modelPage.openModelDropdown();

  await modelPage.expectModelsVisible([
    'grok-4-fast',
    'grok-4-0709',
  ]);
});
