import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('Integration Guide – validate copy & access key actions', async ({ page }) => {
    await page.goto('https://dev.gtwy.ai/org/57720/agents?type=chatbot');

    // Open chatbot
    await page.getByRole('main').getByText(/untitled_agent_34/i).click();

    // Open Integration Guide tab
    await page.getByRole('tab', { name: 'Integration Guide' }).click();

    // --- Slugname field ---
    const slugInput = page.getByRole('textbox', { name: /Enter Slugname/i });
    await expect(slugInput).toBeVisible();
    await expect(slugInput).toHaveValue(/untitled_agent_34/i);

    // --- Step 1: JWT copy ---
    const jwtContainer = page.locator('#first-step-container');
    const copyContainer = jwtContainer.locator('#copy-button-container');

    await expect(copyContainer).toBeVisible();
    await copyContainer.click();

    // ✅ Assert meaningful content exists (proves copy source is valid)
    await expect(jwtContainer).toContainText('org_id');
    await expect(jwtContainer).toContainText('chatbot_id');

    // // --- Access Key ---
    const showKeyBtn = page.getByRole('button', { name: /Show Access Key/i });
    await expect(showKeyBtn).toBeVisible();
    await showKeyBtn.click();

    const accessKeyContainer = page.locator('#input-with-copy-button');
    await expect(accessKeyContainer).toBeVisible();

    // // Assert non-empty visible text
    // await expect(accessKeyContainer).not.toHaveText('');


    // --- Step 2: Main script copy ---
    const mainScriptContainer = page.locator('#second-step-main-script-code');
    const mainScriptCopy = mainScriptContainer.getByRole('button', { name: 'Copy' });

    await expect(mainScriptCopy).toBeVisible();
    await mainScriptCopy.click();

    // Assert script content exists
    await expect(mainScriptContainer).toContainText('chatbot-main-script');

    // --- Step 2: Method copy buttons ---
    const methodBlocks = page.locator('[id^="second-step-method-"]');
    const methodCount = await methodBlocks.count();

    expect(methodCount).toBeGreaterThan(0);

    for (let i = 0; i < methodCount; i++) {
        const method = methodBlocks.nth(i);
        const copyBtn = method.getByRole('button', { name: 'Copy' });

        await expect(copyBtn).toBeVisible();
        await copyBtn.click();

        // Assert method code exists
        await expect(method.locator('code')).not.toBeEmpty();
    }
});
