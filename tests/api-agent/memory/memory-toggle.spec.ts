import { test, expect } from '../../../fixtures/base.fixture';

test('Memory toggle should work as expected', async ({ agents }) => {
    
    await agents.goto('api');
    const agent = await agents.openAgent(process.env.TESTING_AGENT!);

    await agent.tabs.openMemory();
    await agent.memory.uncheckGptMemoryToggle();
    await agent.memory.expectGptMemoryContextTextareaNotVisible();
    await agent.memory.checkGptMemoryToggle();
    await agent.memory.expectGptMemoryContextTextareaVisible();
});