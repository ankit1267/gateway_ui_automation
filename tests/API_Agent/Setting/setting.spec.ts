import { test, expect } from '@playwright/test';

test.use({
    storageState: 'auth.json'
});

const ORG_ID = process.env.ORG_ID;
const AGENT_NAME = process.env.AGENT_NAME;

test.beforeEach(async ({ page }) => {
    await page.goto(`org/${ORG_ID}/agents`);
    await page.getByText(`${AGENT_NAME}`, { exact: true }).click();
    await page.getByRole('tab', { name: 'Settings' }).click();
})
test(
    'TC-SET-01: Switching to Triggers shows ViaSocket embed in Settings',
    async ({ page }) => {

        const triggerCheck = page.getByRole('radio', { name: 'Triggers' });
        const apiRadio = page.getByRole('radio', { name: 'API' });
        if (!await triggerCheck.isChecked()) {
            triggerCheck.click();
        }
        await expect(triggerCheck).toBeChecked({ timeout: 10_000 });
        const embedHeader = page.locator('#viasocket-embed-header');
        await expect(embedHeader).toBeVisible();

        if (await embedHeader.isVisible()) {
            await page.locator('#viasocket-embed-close-button').click();
        }

        await apiRadio.click();
        await expect(
            page.getByRole('radio', { name: 'API' })
        ).toBeChecked({ timeout: 10_000 });
    }
);

test(
    'TC-SET-02:Verify that user can select different tone options in Settings.',
    async ({ page }) => {

        const apiRadio = page.getByRole('radio', { name: 'API' });
        if (!await apiRadio.isChecked()) {
            await page.locator('#viasocket-embed-close-button').click();
            await apiRadio.click();
        }
        await page.locator('#tone-select').selectOption('neutral');
        await page.locator('#tone-select').selectOption('humorous');
        await page.locator('#tone-select').selectOption('formal');

    }
)

test(
    'TC-SET-03:Verify response style dropdown accepts valid values.',
    async ({ page }) => {

        const apiRadio = page.getByRole('radio', { name: 'API' });
        if (!await apiRadio.isChecked()) {
            await page.locator('#viasocket-embed-close-button').click();
            await apiRadio.click();
        }
        const responseStyle = page.locator('#response-style-select');

        await responseStyle.selectOption('analytical');
        await responseStyle.selectOption('crisp');
        await responseStyle.selectOption('storytelling');

    }
)

test(
    'TC-SET-04:Verify enabling and disable Guardrails configuration.',
    async ({ page }) => {

        const apiRadio = page.getByRole('radio', { name: 'API' });
        if (!await apiRadio.isChecked()) {
            await page.locator('#viasocket-embed-close-button').click();
            await apiRadio.click();
        }
        await page.locator('#guardrails-toggle').click();

        await expect(
            page.getByRole('button', { name: 'Add Guardrail Types' })
        ).toBeVisible({ timeout: 10_000 });
        await page.locator('#guardrails-toggle').click();
        await expect(
            page.getByRole('button', { name: 'Add Guardrail Types' })
        ).toBeHidden({ timeout: 10_000 });
    }
)

test(
    'TC-SET-05:Verify webhook validation when Custom mode is selected.',
    async ({ page }) => {

        const apiRadio = page.getByRole('radio', { name: 'API' });
        if (!await apiRadio.isChecked()) {
            await page.locator('#viasocket-embed-close-button').click();
            await apiRadio.click();
        }
        await page.getByRole('radio', { name: 'Custom' }).check();
        await page.getByRole('textbox', { name: 'Webhook URL' }).fill('');
        await page.locator('.hidden').first().click();

        await expect(
            page.getByText('Please enter a valid webhook')
        ).toBeVisible();
        
        await page.getByRole('radio', { name: 'Default' }).check();

    }
)

test(
    'TC-SET-06:Invalid headers JSON is rejected.',
    async ({ page }) => {
        const apiRadio = page.getByRole('radio', { name: 'API' });
        if (!await apiRadio.isChecked()) {
            await page.locator('#viasocket-embed-close-button').click();
            await apiRadio.click();
        }
        await page.getByRole('radio', { name: 'Custom' }).check();
        await page
            .getByRole('textbox', { name: 'Headers (JSON format)' })
            .fill('{invalid}');
        await page.locator('.hidden').first().click();
        await expect(
            page.getByText('Invalid JSON')
        ).toBeVisible();

        await page.getByRole('radio', { name: 'Default' }).check();

    }
)

test(
    'TC-SET-07:Agent Settings – Guardrail Configuration.',
      async ({ page }) => {

        const apiRadio = page.getByRole('radio', { name: 'API' });
        if (!await apiRadio.isChecked()) {
            await page.locator('#viasocket-embed-close-button').click();
            await apiRadio.click();
        }
        const guardrailToggle = page.locator('#guardrails-toggle');
        await guardrailToggle.check();

        const addGuardrailBtn = page.getByRole('button', { name: 'Add Guardrail Types' });
        await expect(addGuardrailBtn).toBeEnabled();
        await addGuardrailBtn.click();

        const promptInjection = page.locator('#guardrail-checkbox-prompt_injection');
        const bias = page.locator('#guardrail-checkbox-bias');

        await expect(promptInjection).toBeVisible();
        await expect(bias).toBeVisible();

        await promptInjection.check();
        await bias.check();

        await expect(promptInjection).toBeChecked();
        await expect(bias).toBeChecked();

        await promptInjection.uncheck();
        await bias.uncheck();

        

        //Disable guardrails toggle again
        await guardrailToggle.uncheck();
        await expect(guardrailToggle).not.toBeChecked();
    }
)


