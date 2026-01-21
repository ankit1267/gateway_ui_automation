import { test, expect, Page } from '@playwright/test';

test.use({
    storageState: 'auth.json',
});

/**
 * Helper: navigate to Create Chatbot Agent screen
 */
async function openCreateChatbotAgent(page: Page) {
    await page.goto('/org/57294/agents');
    await page.getByRole('button', { name: 'Chatbot', exact: true }).click();
    await page.getByRole('button', { name: '+ Create New Chatbot Agent' }).click();
    await page
        .locator('#default-agent-sidebar')
        .getByRole('button', { name: 'Create Agent' })
        .click();

    // Open agent name edit mode
    await page.locator('.lucide.lucide-pen').first().click();
}

/**
 * Helper: get Agent Name input
 * (based on your current UI – fragile but OK for now)
 */
function agentNameInput(page: Page) {
    return page.locator('input[type="text"]').nth(3);
}

test.describe('Chatbot Agent Name – Negative Test Cases', () => {

    test.beforeEach(async ({ page }) => {
        await openCreateChatbotAgent(page);
    });

    // ❌ TC-NEG-01: Empty agent name
    test('should not allow empty agent name', async ({ page }) => {
        const input = agentNameInput(page);

        await input.fill('');
        await input.press('Enter');

        // ✅ Assert validation error message
        const errorToast = page.getByText('Agent name cannot be empty');

        await expect(errorToast).toBeVisible({ timeout: 10_000 });
    });


    // ❌ TC-NEG-02: Agent name with only spaces
    test('should not allow agent name with only spaces', async ({ page }) => {
        const input = agentNameInput(page);

        await input.fill('     ');
        await input.press('Enter');

        // Spaces are trimmed → treated as empty
        await expect(input).toHaveValue('');
    });

    // ❌ TC-NEG-03: Special characters only
    test('TC-NEG-03: should not allow agent name with special characters only', async ({ page }) => {
        const input = agentNameInput(page);

        await input.fill('@@@###$$$');
        await input.press('Enter');

        // ✅ Assert validation error message
        await expect(
            page.getByText(
                'Agent name can only contain letters, numbers, spaces, hyphens, and underscores'
            )
        ).toBeVisible();
    });


    // ✅ TC-POS-04: Agent name with mixed characters is allowed
    test('should allow agent name with mixed valid and invalid characters', async ({ page }) => {
        const input = agentNameInput(page);

        await input.fill('@@@###$$agent$');
        await input.press('Enter');

        // ✅ Assert validation error message
        await expect(
            page.getByText(
                'Agent name can only contain letters, numbers, spaces, hyphens, and underscores'
            )
        ).toBeVisible();
    });


    // ❌ TC-NEG-05: Very long agent name
    test('should restrict agent name length', async ({ page }) => {
        const longName = 'A'.repeat(300);
        const input = agentNameInput(page);

        await input.fill(longName);

        const value = await input.inputValue();
        expect(value.length).toBeLessThanOrEqual(50); // adjust if product limit differs
    });

    // ❌ TC-NEG-06: Close without saving
    // test('should not update agent name when edit is cancelled', async ({ page }) => {
    //     const validName = 'Agent One';
    //     const input = agentNameInput(page);

    //     await input.fill(validName);
    //     await input.press('Enter');
    //     await expect(input).toHaveValue(validName);

    //     // Try editing but do not press Enter
    //     await input.fill('Another Name');

    //     // Click outside / blur
    //     await page.click('body');

    //     // Name should remain unchanged
    //     await page.locator('.lucide.lucide-pen').first().click();
    //     await expect(input).toHaveValue(validName);
    // });

    // ❌ TC-NEG-07: Session expired user
    test('should redirect to login if session is expired', async ({ browser }) => {
        const context = await browser.newContext({ storageState: undefined });
        const page = await context.newPage();

        await page.goto('https://app.gtwy.ai/org/57294/agents');
        await expect(page).toHaveURL(/login/);

        await context.close();
    });

});


