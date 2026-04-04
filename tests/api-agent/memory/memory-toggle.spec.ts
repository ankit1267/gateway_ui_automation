import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test('Memory toggle should work as expected', async ({ agents }) => {
    
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.tabs.openMemory();
    const wasChecked = await agent.memory.isGptMemoryToggleChecked();

    await agent.memory.uncheckGptMemoryToggle();
    await agent.memory.expectGptMemoryContextTextareaNotVisible();
    if (wasChecked) {
      await agent.header.expectSavedVisible();
    }

    await agent.memory.checkGptMemoryToggle();
    await agent.header.expectSavedVisible();
    await agent.memory.expectGptMemoryContextTextareaVisible();
});