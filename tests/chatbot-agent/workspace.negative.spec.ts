import { test, expect, Page } from '@playwright/test';

/**
 * Helper: open Create Workspace modal
 */
async function openCreateWorkspaceModal(page: Page) {
    await page.getByRole('button', { name: '+ Create New Workspace' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
}

/**
 * Helper: click Create button INSIDE modal
 */
async function clickCreateInModal(page: Page) {
    const modal = page.getByRole('dialog');
    await modal.getByRole('button', { name: 'Create', exact: true }).click();
}

test.describe('Create Workspace – Negative Test Cases', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/org');
        await expect(page.getByText('Existing Workspaces')).toBeVisible();
    });

    // ❌ TC-NEG-01: Empty workspace name
    test('should not allow creating workspace with empty name', async ({ page }) => {
        await openCreateWorkspaceModal(page);
        await clickCreateInModal(page);

        await expect(page.getByRole('dialog')).toBeVisible();
    });

    // ❌ TC-NEG-02: Workspace name with only spaces
    test('should not allow workspace name with only spaces', async ({ page }) => {
        await openCreateWorkspaceModal(page);
        await page.getByRole('textbox', { name: 'Workspace Name' }).fill('     ');
        await clickCreateInModal(page);

        await expect(page.getByRole('dialog')).toBeVisible();
    });

    // ❌ TC-NEG-03: Missing timezone selection
    // test('should not allow workspace creation without timezone', async ({ page }) => {
    //     await openCreateWorkspaceModal(page);
    //     await page.getByRole('textbox', { name: 'Workspace Name' }).fill('No Timezone Workspace');
    //     await clickCreateInModal(page);

    //     await expect(
    //         page.getByText(/timezone is required/i)
    //     ).toBeVisible();
    // });

    // ❌ TC-NEG-04: Duplicate workspace name
    test('should not allow duplicate workspace name', async ({ browser }) => {
        const context = await browser.newContext({
            storageState: 'auth.json'
        });

        const page = await context.newPage();
        await page.goto('/org');

        const workspaceName = 'Ansh Pandit';

        const workspaces = page.getByText(workspaceName);
        const countBefore = await workspaces.count();

        await openCreateWorkspaceModal(page);
        await page.getByRole('textbox', { name: 'Workspace Name' }).fill(workspaceName);
        await clickCreateInModal(page);

        await expect(workspaces).toHaveCount(countBefore);

        await context.close();
    });


    // ❌ TC-NEG-05: Special characters only
    test('should not create workspace with special characters only', async ({ page }) => {
        const name = '@@@###$$$';

        const countBefore = await page.getByText(name).count();

        await openCreateWorkspaceModal(page);
        await page.getByRole('textbox', { name: 'Workspace Name' }).fill(name);
        await clickCreateInModal(page);

        await expect(page.getByText(name)).toHaveCount(countBefore);
    });
    // ❌ TC-NEG-06: Very long workspace name
    test('should restrict workspace name to max 40 characters', async ({ page }) => {
        const longName = 'A'.repeat(300);

        await openCreateWorkspaceModal(page);

        const input = page.getByRole('textbox', { name: 'Workspace Name' });
        await input.fill(longName);

        const value = await input.inputValue();
        expect(value.length).toBe(40);
    });


    // ❌ TC-NEG-07: Multiple rapid submissions
    // test('should prevent multiple submissions on Create button', async ({ page }) => {
    //     await openCreateWorkspaceModal(page);
    //     await page.getByRole('textbox', { name: 'Workspace Name' }).fill('Rapid Click Workspace');

    //     const modal = page.getByRole('dialog');
    //     const createBtn = modal.getByRole('button', { name: 'Create', exact: true });

    //     await createBtn.click();
    //     await createBtn.click();
    //     await createBtn.click();

    //     await expect(
    //         page.getByText(/creating|please wait|processing/i)
    //     ).toBeVisible();
    // });

    // ❌ TC-NEG-08: Close modal without submitting
    test('should not create workspace when modal is closed', async ({ page }) => {
        await openCreateWorkspaceModal(page);

        // Use actual Cancel / Close button
        await page.getByRole('button', { name: /cancel|close/i }).click();

        await expect(page.getByText('Existing Workspaces')).toBeVisible();
    });

    // ❌ TC-NEG-09: Session expired user
    test('should redirect to login if session is expired', async ({ browser }) => {
        const context = await browser.newContext({ storageState: undefined });
        const page = await context.newPage();

        await page.goto('https://app.gtwy.ai/org');
        await expect(page).toHaveURL(/login/);

        await context.close();
    });

});
