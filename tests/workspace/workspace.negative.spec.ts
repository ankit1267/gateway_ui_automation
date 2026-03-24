import { test, expect } from '@playwright/test';
import { WorkspacePage } from '../../pages/workspace.page';

test.describe.serial('Create Workspace - Negative Test Cases (POM)', () => {
    let workspacePage: WorkspacePage;

    test.beforeEach(async ({ page }) => {
        workspacePage = new WorkspacePage(page);
        await workspacePage.goto();
        await expect(page.getByText('Existing Workspaces')).toBeVisible();
    });

    // TC-NEG-01: Empty workspace name
    test('should not allow creating workspace with empty name', async ({ page }) => {
        await workspacePage.clickCreateWorkspace();
        await expect(page.getByRole('dialog')).toBeVisible();

        await workspacePage.submit();

        await expect(page.getByRole('dialog')).toBeVisible();
    });

    // TC-NEG-02: Workspace name with only spaces
    test('should not allow workspace name with only spaces', async ({ page }) => {
        await workspacePage.clickCreateWorkspace();
        await expect(page.getByRole('dialog')).toBeVisible();

        await workspacePage.fillName('     ');
        await workspacePage.submit();

        await expect(page.getByRole('dialog')).toBeVisible();
    });

    // TC-NEG-03: Duplicate workspace name
    test('should not allow duplicate workspace name', async ({ page }) => {
        const workspaceName = 'Ansh Pandit';

        const workspaces = page.getByText(workspaceName);
        const countBefore = await workspaces.count();

        await workspacePage.clickCreateWorkspace();
        await expect(page.getByRole('dialog')).toBeVisible();

        await workspacePage.fillName(workspaceName);
        await workspacePage.submit();

        await expect(workspaces).toHaveCount(countBefore);
    });

    // TC-NEG-04: Special characters only
    test('should not create workspace with special characters only', async ({ page }) => {
        const name = '@@@###$$$';

        const countBefore = await page.getByText(name).count();

        await workspacePage.clickCreateWorkspace();
        await expect(page.getByRole('dialog')).toBeVisible();

        await workspacePage.fillName(name);
        await workspacePage.submit();

        await expect(page.getByText(name)).toHaveCount(countBefore);
    });

    // TC-NEG-05: Very long workspace name
    test('should restrict workspace name to max 40 characters', async ({ page }) => {
        const longName = 'A'.repeat(300);

        await workspacePage.clickCreateWorkspace();
        await expect(page.getByRole('dialog')).toBeVisible();

        await workspacePage.fillName(longName);

        const value = await workspacePage.nameInput.inputValue();
        expect(value.length).toBe(40);
    });

    // TC-NEG-06: Close modal without submitting
    test('should not create workspace when modal is closed', async ({ page }) => {
        await workspacePage.clickCreateWorkspace();
        await expect(page.getByRole('dialog')).toBeVisible();

        await workspacePage.close();

        await expect(page.getByText('Existing Workspaces')).toBeVisible();
    });

});
