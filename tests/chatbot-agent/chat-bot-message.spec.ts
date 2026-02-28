import { test, expect } from "../../fixtures/base.fixture";

const Agent = process.env.CHATBOT_AGENT!;

test.describe('Chatbot Message', () => {
    
    test.beforeEach(async ({ agents }) => {
        await agents.goto('chatbot');
    });

    test('TC-CHAT-01: Verify Chatbot Message', async ({ agents }) => {
        const agent = await agents.openAgent(Agent);
        await agent.chatbot.openNewThread();
        await agent.chatbot.isHomeVisible();
        await agent.chatbot.sendMessage('hi');
        await agent.chatbot.expectCopyButtonVisible();
        await agent.chatbot.clickCopyButton();
        await agent.chatbot.expectGoodResponseButtonVisible();
        await agent.chatbot.expectBadResponseButtonVisible();
        await agent.chatbot.clickGoodResponseButton();
        await agent.chatbot.clickBadResponseButton();
    });
});
