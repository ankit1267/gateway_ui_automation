import { test, expect } from '../../fixtures/base.fixture';

const TESTING_AGENT = 'Parental Guidance';

test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');

});

test('child agent is triggered', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    const chatbot = agent.chatbot;

    await chatbot.openNewThread();
    await chatbot.sendMessage('My name is tilakraj');
    

    await chatbot.expectResponse(/Function executed/i);
    await chatbot.expectText('tilakraj');
});

test('child agent is triggered with variable', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.header.openHistory();
    await agent.history.openToolItem();
    await agent.history.verifyVariableVisible(/"user_name"\s*:\s*"tilakraj"/);
    await agent.history.closeToolItem();

});
