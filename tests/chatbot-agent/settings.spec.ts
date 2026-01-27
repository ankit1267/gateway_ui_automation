import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('Chatbot settings + memory history validation', async ({ page }) => {
    await page.goto('https://dev.gtwy.ai/org/57720/agents?type=chatbot');

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

    // Scope to History panel to avoid background "More..." buttons
    const historyPanel = page.getByRole('complementary', { name: /history/i });

    await historyPanel
        .getByRole('button', { name: 'More...' })
        .first()
        .click();

    // Assert memory content
    await expect(
        page.getByText(/Role:\s*AI Bot/i)
    ).toBeVisible();
});
