import { expect, Page } from '@playwright/test';

export type ServiceProvider = 'Openai' | 'Mistral' | 'Anthropic' |'Groq' | 'Gemini' |'Ai ml'|'Grok';

export async function selectServiceProvider(
  page: Page,
  provider: ServiceProvider
) {
  const modelConfig = page.locator('#model-tab-config-section');

  // Scope to the Service Provider field row
  const serviceProviderRow = modelConfig
    .getByText('Service Provider', { exact: true })
    .locator('..');

  await serviceProviderRow
    .getByRole('button')
    .click();

  await page
    .getByRole('listbox')
    .getByRole('option', { name: provider, exact: true })
    .click();

  await expect(
    serviceProviderRow.getByRole('button', { name: provider })
  ).toBeVisible();
}
