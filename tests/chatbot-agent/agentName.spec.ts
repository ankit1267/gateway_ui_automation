import { test, expect } from '@playwright/test';
import { ChatbotAgentPage } from '../../pages/chatbotAgentCreatePage';

test.use({ storageState: 'auth.json' });

test.describe('Chatbot Agent Name – Negative Test Cases', () => {
    let chatbotAgentPage: ChatbotAgentPage;

    test.beforeEach(async ({ page }) => {
        chatbotAgentPage = new ChatbotAgentPage(page);
        await chatbotAgentPage.openCreateChatbotAgent();
    });

    // ❌ TC-NEG-01: Empty agent name
    test('should not allow empty agent name', async () => {
        await chatbotAgentPage.setAgentName('');
        await chatbotAgentPage.expectEmptyNameError();
    });

    // ❌ TC-NEG-02: Agent name with only spaces
    test('should not allow agent name with only spaces', async () => {
        await chatbotAgentPage.setAgentName('     ');
        await expect(chatbotAgentPage.agentNameInput()).toHaveValue('');
    });

    // ❌ TC-NEG-03: Special characters only
    test('should not allow agent name with special characters only', async () => {
        await chatbotAgentPage.setAgentName('@@@###$$$');
        await chatbotAgentPage.expectInvalidCharactersError();
    });

    // ✅ TC-POS-04: Mixed characters still invalid
    test('should not allow mixed invalid characters', async () => {
        await chatbotAgentPage.setAgentName('@@@###$$agent$');
        await chatbotAgentPage.expectInvalidCharactersError();
    });

    // ❌ TC-NEG-05: Very long agent name
    test('should restrict agent name length', async () => {
        await chatbotAgentPage.setAgentName('A'.repeat(300));

        const value = await chatbotAgentPage.agentNameInput().inputValue();
        expect(value.length).toBeLessThanOrEqual(50);
    });

    // ❌ TC-NEG-07: Session expired user
    test('should redirect to login if session is expired', async ({ browser }) => {
        const context = await browser.newContext({ storageState: undefined });
        const page = await context.newPage();

        await page.goto('https://app.gtwy.ai/org/57294/agents');
        await expect(page).toHaveURL(/login/);

        await context.close();
    });
});
