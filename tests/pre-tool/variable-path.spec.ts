import { test, expect } from '../../fixtures/base.fixture';

const TESTING_AGENT = 'Pretool Variable';

test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');

});

test('Connected pre-tool variable passing', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    const chatbot = agent.chatbot;

    // Point the pre-tool's "age" parameter at a variable named "age". Until this is set, the
    // parameter has no value path and the tool returns AGE:undefined.
    await agent.tabs.openPrompt();
    await agent.prompt.setPreToolParamValuePath('age', 'age');

    // Give that variable the value the chat should echo back
    await agent.prompt.openVariableManager();
    await agent.prompt.expectVariableKeyWithValueVisible('age');
    await agent.prompt.fillVariableValueByKey('age', '40');
    await agent.prompt.closeVariableManager();

    await chatbot.sendMessage('Hi');
    await chatbot.waitForResponseComplete(90000);
    await chatbot.expectResponse(/AGE:40/i);

    // Clear the value path again so the agent is left as it was found
    await agent.tabs.openPrompt();
    await agent.prompt.setPreToolParamValuePath('age', '');
});

