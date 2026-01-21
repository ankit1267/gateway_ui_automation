import { Page, expect } from '@playwright/test';

export class ChatbotConfigurePage {
    constructor(private page: Page) { }

    async setResponseType() {
        await this.page.locator('select[name="response_type"]').selectOption('text');
    }

    async configureModel() {
        // Open Model tab (ensure correct tab)
        await this.page.getByRole('tab', { name: 'Model' }).click();

        // Open Service Provider dropdown
        const providerDropdown = this.page.getByRole('button', { name: /service provider/i });
        await providerDropdown.click();

        // Wait for dropdown options to appear
        const geminiOption = this.page.getByRole('option', { name: 'Gemini' });
        await geminiOption.waitFor({ state: 'visible' });

        // Select Gemini
        await geminiOption.click();

        // ✅ Assert provider is selected (critical)
        await this.page.getByText('Gemini').first().waitFor({ state: 'visible' });

        // Now select model
        const modelDropdown = this.page.getByRole('button', { name: /model/i });
        await modelDropdown.click();

        const modelOption = this.page.getByRole('option', { name: 'gemini-2.5-flash' });
        await modelOption.waitFor({ state: 'visible' });
        await modelOption.click();
    }




    async addSpringBootConnector() {
        await this.page.getByRole('tab', { name: 'Connectors' }).click();
        await this.page.getByRole('button', { name: 'Add' }).nth(3).click();
        await this.page.getByText('Spring boot resource').click();
    }

    async publish() {
        await this.page.getByRole('tab', { name: 'Settings' }).click();

        await this.page.getByRole('button', { name: 'Publish', exact: true }).click();
        await this.page.getByRole('button', { name: 'Publish' }).nth(2).click();
        await this.page.getByRole('button', { name: 'Confirm Publish' }).click();

        await this.page.getByRole('button', { name: 'Generate New Summary' }).click();
        await this.page.getByRole('button', { name: 'Save' }).click();
        await this.page.getByRole('button', { name: 'Confirm Publish' }).click();
    }
}
