import { test, expect, Page } from '@playwright/test';

test.use({ storageState: 'auth.json' });

const setupChatbotVersionModal = async (page: Page) => {
    await page.goto('/org/57294/agents?type=chatbot');

    await page.getByRole('button', { name: '+ Create New Chatbot Agent' }).click();
    await page
        .locator('#default-agent-sidebar')
        .getByRole('button', { name: 'Create Agent' })
        .click();

    await page.getByRole('button', { name: 'New', exact: true }).click();

    // ✅ Scope modal to "Create New Version" only
    const modal = page
        .locator('div.modal-box')
        .filter({
            has: page.getByRole('heading', { name: 'Create New Version' }),
        });

    const descriptionInput = modal.getByRole('textbox');
    const createButton = modal.locator('button.btn-primary.ml-2');

    // ✅ strict-mode safe
    await expect(modal).toBeVisible();

    return { modal, descriptionInput, createButton };
};

test('❌ Version cannot be created with empty description (chatbot)', async ({ page }) => {
    const { modal, descriptionInput, createButton } =
        await setupChatbotVersionModal(page);

    page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('Please enter a version description');
        await dialog.accept();
    });

    await createButton.click();

    await expect(descriptionInput).toHaveValue('');
    await expect(modal).toBeVisible();
});

test('✅ Version can be created with valid description (chatbot)', async ({ page }) => {
    const { modal, descriptionInput, createButton } =
        await setupChatbotVersionModal(page);

    await descriptionInput.fill('version 1');
    await createButton.click();

    await expect(modal).not.toBeVisible();

});
