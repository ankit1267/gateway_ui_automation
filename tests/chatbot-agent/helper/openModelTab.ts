import { Page, expect } from '@playwright/test';

export async function openModelTab(page: Page) {
    // Navigate to org
    await page.goto('/org');

    // Open workspace
    await page.getByText('Ansh Pandit').click();

    // Directly navigate to chatbot agents page
    await page.goto('/org/57720/agents?type=chatbot');

    // Wait for page hydration
    await page.waitForLoadState('networkidle');

    // Open agent
    await page
        .getByRole('table')
        .getByText('untitled_agent_1')
        .click();

    // Open Model tab
    await page.getByRole('tab', { name: 'Model' }).click();
}
