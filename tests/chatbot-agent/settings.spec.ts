import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

const ORG_NAME = process.env.ORG_NAME!;
const ORG_ID = process.env.ORG_ID!;

test('Chatbot settings + memory history validation', async ({ page }) => {
    await page.goto('/org');
    await page.getByText(`${ORG_NAME}`).click();
    
    // Open chatbot
    await page.getByRole('main').getByText(/untitled_agent/i).first().click();

    // Open Settings
    await page.getByRole('tab', { name: 'Settings' }).click();

    // Update tone & response style
    await page.locator('#tone-select').selectOption('authoritative');
    await page.locator('#response-style-select').selectOption('action-Oriented');

    // Work with iframe safely
    const iframe = page.frameLocator('#iframe-component-interfaceEmbed');
    const messageBox = iframe.getByRole('textbox', {
        name: 'Message AI Assistant...'
    });

    await messageBox.fill('hello');
    await messageBox.press('Enter');

    // Open History
    await page.getByRole('button', { name: 'History' }).click();

    // 🔑 IMPORTANT: wait for iframe overlay to stop intercepting clicks
    await expect(
        page.locator('#iframe-component-interfaceEmbed')
    ).toBeHidden({ timeout: 10_000 });

    // Wait until at least one More button exists
    const moreButton = page.locator('#thread-item-user-more-button').first();

    await expect(moreButton).toBeVisible();
    await moreButton.click();


    // Assert memory content
    await expect(
        page.getByText(/Role:\s*AI Bot/i)
    ).toBeVisible();
});
