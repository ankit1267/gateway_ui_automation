import { test, expect } from '@playwright/test';

test.use({
    storageState: 'auth.json',
});

test('TC-CON-01: Verify Connectors flow for a chatbot agent', async ({ page }) => {
    // Step 1: Open chatbot agents page
    await page.goto('https://dev.gtwy.ai/org/57720/agents?type=chatbot');
    await page.waitForLoadState('networkidle');

    // Step 2: Create new chatbot agent
    const createAgentBtn = page.getByRole('button', {
        name: /create new chatbot agent/i,
    });

    await expect(createAgentBtn).toBeVisible({ timeout: 20000 });
    await createAgentBtn.click();

    await page
        .locator('#default-agent-sidebar')
        .getByRole('button', { name: 'Create Agent' })
        .click();

    // Step 3: Open Connectors tab
    const connectorsTab = page.getByRole('tab', { name: 'Connectors' });
    await expect(connectorsTab).toBeVisible();
    await connectorsTab.click();

    // ─────────────────────────────────────────
    // TOOLS
    // ─────────────────────────────────────────

    // Step 4: Add first tool
    const addToolBtn = page.locator('#embed-list-add-first-tool-button');
    await expect(addToolBtn).toBeVisible();
    await addToolBtn.click();

    await page.getByText('Add new Tools', { exact: true }).click();

    // Step 5: Close tools modal
    const closeToolModal = page.locator('#viasocket-embed-close-button');
    await expect(closeToolModal).toBeVisible();
    await closeToolModal.click();

    // ─────────────────────────────────────────
    // CONNECTED AGENTS
    // ─────────────────────────────────────────

    // Step 6: Add connected agent
    const addAgentBtn = page.locator('#connected-agent-list-add-first-agent-button');
    await expect(addAgentBtn).toBeVisible();
    await addAgentBtn.click();

    // Select second agent from list
    await page
        .locator('#connected-agent-list-content > div:nth-child(2)')
        .click();

    // ─────────────────────────────────────────
    // KNOWLEDGE BASE
    // ─────────────────────────────────────────

    // Step 7: Add Knowledge Base
    const addKbBtn = page.locator('#knowledgebase-add-first-button');
    await expect(addKbBtn).toBeVisible();
    await addKbBtn.click();

    await page.getByText('Add new Knowledge Base', { exact: true }).click();

    // Step 8: Close Knowledge Base modal
    await page.getByRole('button', { name: '✕' }).click();

    // Final assertion: still on Connectors tab
    await expect(
        page.getByRole('tab', { name: 'Connectors', selected: true })
    ).toBeVisible();
});
