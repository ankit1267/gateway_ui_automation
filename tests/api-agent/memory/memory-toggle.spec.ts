import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test('Memory toggle should work as expected', async ({ agents }) => {
    
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.tabs.openMemory();
    await agent.memory.uncheckGptMemoryToggle();
    await agent.memory.expectGptMemoryContextTextareaNotVisible();
    await agent.memory.checkGptMemoryToggle();
    await agent.memory.expectGptMemoryContextTextareaVisible();
});