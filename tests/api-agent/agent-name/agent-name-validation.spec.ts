import { test, expect } from '../../../fixtures/base.fixture';



test.describe('@regression Agent name validation', () => {
    let createdAgentNames: string[] = [];

    test.beforeEach(async ({ agents }) => {
        createdAgentNames = [];
        await agents.goto('api');
        await agents.clickCreateNewAgent();
    });

    test.afterEach(async ({ agents }) => {
        if (createdAgentNames.length > 0) {
            await agents.goto('api');
            for (const name of createdAgentNames) {
                await agents.deleteAgentByName(name);
            }
            createdAgentNames = [];
        }
    });

    test('should not allow empty agent name', async ({ agents }) => {
        const agent = await agents.clickCreateNewAgentSubmit();
        const nameLocator = await agent.header.getAgentName();
        createdAgentNames.push((await nameLocator.textContent())!.trim());


        await agent.header.clickEditName();
        await agent.header.agentNameFill('');
        await agents.blurInput();

        await agent.invalidAgentNameAlert('Agent name cannot be empty');
    });

    test('should not allow special characters in agent name', async ({ agents }) => {
        const agent = await agents.clickCreateNewAgentSubmit();
        await agent.header.clickEditName();
        await agent.header.agentNameFill('@#$%');
        await agents.blurInput();
        await agent.invalidAgentNameAlert('Agent name can only contain');
    });

});
