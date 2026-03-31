import { test, expect } from '../../fixtures/base.fixture';

const TESTING_AGENT = 'Parental Guidance';

test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
    
});

test('add age variable, verify in payload, then delete', async ({ agents }) => {

    // -------------------------
    // Open Connectors Config
    // -------------------------
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();

    await agent.connectors.clickAgentConfig();

    const modal = agent.connectors.variableModal;
    // -------------------------
    // Add Variable
    // -------------------------
    await modal.addParameter();
    await modal.fillParameterName('new0');
    await modal.setRequired('new0');
    await modal.selectType('new0', 'number');
    await modal.fillValuePath('new0', 'age');
    await modal.save();

    // -------------------------
    // Send Query in Chatbot
    // -------------------------

    const chatbot = agent.chatbot;
    if (await chatbot.isCopyButtonVisible()) {
        await chatbot.openNewThread();
    }
    if(await chatbot.isHomeVisible()){
        await chatbot.sendMessage('hello i am tilak');
    }
    await chatbot.expectResponse(/Function executed/i);

});

test('Verify new0 variable passed', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.header.openHistory();
    await agent.history.openToolItem();
    await agent.history.verifyVariableVisible(/"new0"\s*:\s*0/);
    await agent.history.closeToolItem();
    await agent.header.openChatbotConfig();
    await agent.tabs.openConnectors();
    await agent.connectors.clickAgentConfig();
    await agent.connectors.variableModal.deleteParameter('new0');
    await agent.connectors.variableModal.save();
});