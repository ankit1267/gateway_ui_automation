import { test, expect } from '@playwright/test';

test.use({
    storageState: 'auth.json',
});

const ORG_ID = process.env.ORG_ID!;

test.describe('Chatbot Settings – History & System Prompt Tone', () => {

    test('Verify chat history and authoritative system prompt tone', async ({ page }) => {

        // Go to Org
        await page.goto(`org/${ORG_ID}/agents?type=chatbot`);


        // Open specific chatbot
        const chatbotRow = page
            .locator('#custom-table-view')
            .getByText('Smart Meeting Scheduler_1', { exact: true })
            

        await chatbotRow.click();

        //  Open Settings tab
        const settingsTab = page.getByRole('tab', { name: 'Settings' });
        await expect(settingsTab).toBeVisible();
        await settingsTab.click();

        //Set response style & authoritative tone
        await page.locator('#response-style-select').selectOption('analytical');
        await page.locator('#tone-select').selectOption('authoritative');

        // Assertion: tone is set correctly
        await expect(page.locator('#tone-select')).toHaveValue('authoritative');

        //Send a message via iframe
        const chatFrame = page
            .locator('#iframe-component-interfaceEmbed')
            .contentFrame();

        const messageBox = chatFrame.getByRole('textbox', {
            name: 'Message AI Assistant...',
        });

        await expect(messageBox).toBeVisible();
        await messageBox.fill('Hello');
        await messageBox.press('Enter');

        // Open History
        const historyBtn = page.getByRole('button', { name: 'History' });
        await expect(historyBtn).toBeVisible();
        await historyBtn.click();

        //Open system prompt from history
        const moreBtn = page.getByRole('button', { name: 'More...' }).last();
        await expect(moreBtn).toBeVisible();
        await moreBtn.click();

        //Locate system prompt text using class
        const systemPrompt = page
            .locator('#chat-details-slider')
            .locator('.text-base-content.break-words')
            .last();

        await expect(systemPrompt).toContainText('authoritative');

        await expect(systemPrompt).toBeVisible();

        //Assert authoritative tone keywords
        await expect(systemPrompt).toContainText([
            'authoritative',
        ]);
    });

});
