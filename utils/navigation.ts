import { Page } from '@playwright/test';

export async function navigateToAgents(page: Page, type?: 'chatbot' | 'api') {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');

    let url = `/org/${orgId}/agents`;
    if (type) {
        url += `?type=${type}`;
    }

    await page.goto(url);
    // await page.waitForLoadState('networkidle'); // Optional, depending on app behavior
}
