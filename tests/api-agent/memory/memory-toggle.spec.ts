import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_ID = process.env.TESTING_AGENT_ID!;

test('Memory toggle should work as expected', async ({ agents }) => {
    
    await agents.goto('api');
    const agent = await agents.openAgentById(AGENT_ID);

    await agent.tabs.openMemory();
    await agent.memory.uncheckGptMemoryToggle();
    await agent.memory.expectGptMemoryContextTextareaNotVisible();
    await agent.memory.checkGptMemoryToggle();
    await agent.memory.expectGptMemoryContextTextareaVisible();
});