import { test, expect, Page } from '@playwright/test';
import { ChatbotAgentPage } from '../../pages/chatbotAgentCreatePage';

test.use({ storageState: 'auth.json' });

// -------- Test Data --------
const WORKSPACE_NAME = process.env.WORKSPACE_NAME!;
const AGENT_PURPOSE = 'Sales agent that can answer questions about our products and pricing.';

test('TC-AGENT-01 | Publish agent successfully', async ({ page }) => {



    // -------- Step 1: Open Org --------
    await page.goto('/org');
    await page.getByText(WORKSPACE_NAME).click();

    // -------- Step 2: Open Chatbot --------
    await page.getByRole('button', { name: 'Chatbot', exact: true }).click();

    // -------- Step 3: Create New Agent --------
    await page.getByTestId('create-new-agent-button').click();
    await page
        .locator('#default-agent-sidebar')
        .getByTestId('agent-purpose')
        .fill(AGENT_PURPOSE);

    await page
        .locator('#default-agent-sidebar')
        .getByTestId('create-new-bridge-submit-button')
        .click();


    await expect(page.
        locator('#iframe-component-interfaceEmbed').
        contentFrame().locator('div').filter({ hasText: 'What can I help with?' }).nth(2)).toBeVisible();


    // -------- Step 4: Publish Agent --------
    const publishToggle = page.getByTestId('navbar-publish-dropdown-toggle');
    const publishBtn = page.getByTestId('navbar-publish-button');


    await publishToggle.click();

    while (!(await publishBtn.isVisible())) {
        await publishToggle.click();
    }


    // wait for dropdown item to appear
    await expect(publishBtn).toBeVisible({ timeout: 15000 });
    await publishBtn.click();


    await page.getByRole('checkbox').check();

    const publishDialog = page
        .getByRole('dialog')
        .filter({ hasText: 'Publish Bridge Version' });

    await publishDialog
        .getByTestId('agent-summary-generate-button')
        .click();

    await publishDialog
        .getByTestId('agent-summary-save-button')
        .click();

    await expect(
        publishDialog.getByTestId('agent-summary-save-button')
    ).toBeDisabled({ timeout: 15000 });

    await page
        .getByRole('button', { name: 'Confirm Publish' })
        .click();

    // -------- Assertion --------
    await expect(
        page.getByText('Agent Version published')
    ).toBeVisible({ timeout: 15000 });

    const agentPage = new ChatbotAgentPage(page);
    const agentName = await page.getByTestId('navbar-agent-name-display').innerText();
    await agentPage.deleteAgentByName(agentName);

});