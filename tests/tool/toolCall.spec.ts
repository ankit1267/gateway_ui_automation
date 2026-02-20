import { test, expect, Page, FrameLocator } from '@playwright/test';
import { navigateToAgents } from '../../utils/navigation';

test.use({
    storageState: 'auth.json'
});

const WORKSPACE_NAME = process.env.WORKSPACE_NAME!;
const AGENT_NAME = 'AutomationTestcases';
const USER_QUERY = 'List all the workspace testcases.';
const EXPECTED_FUNCTION = 'GetDocumentContentonGoogleDocs';

async function openAgent(page: Page) {
    
    // Navigate to org page & workspace
    await navigateToAgents(page, 'chatbot');
    
    await page
        .getByRole('cell', { name: 'AutomationTestcases' })
        .click();

    await page.waitForTimeout(10000);

}

function getChatFrame(page: Page): FrameLocator {
    return page.locator('#iframe-component-interfaceEmbed').contentFrame();
}

async function sendMessage(page: Page, frame: FrameLocator, message: string) {

    const textbox = frame.getByRole('textbox', {
        name: 'Message AI Assistant...'
    });

    await textbox.waitFor();

    // Only click if New Chat is visible
    const newChat = frame.getByRole('button').nth(1);

    if (await newChat.isVisible()) {
        await newChat.click();
    }

    await textbox.fill(message);
    await textbox.press('Enter');

}

async function verifyToolExecution(page: Page, functionName: string) {
    await page.getByTestId('navbar-tab-history').click();

    await page.waitForTimeout(5000);

    await expect(
        page.getByText(functionName, { exact: true })
    ).toBeVisible({ timeout: 15000 });
}

test.describe('Tool Execution Validation', () => {

    test('Should execute correct function for workspace query', async ({ page }) => {

        // Step 1: Open Agent
        await openAgent(page);

        const frame = getChatFrame(page);

        // Step 2: Send Query
        await sendMessage(page, frame, USER_QUERY);

        // // Optional: Wait for AI response indicator
        await expect(frame.getByText('Function executed'))
            .toBeVisible({ timeout: 40000 });

        // Step 3: Verify Tool Called
        await verifyToolExecution(page, EXPECTED_FUNCTION);
    });

});
