import { test } from '../../fixtures/base.fixture';

const CHATBOT_AGENT = process.env.CHATBOT_AGENT!;
const memoryText = 'remember my conversation';

test.describe.serial('Memory - Chatbot Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
  });

  test('TC-MEM-01: Memory feature should enable, save context, and persist', async ({ agents }) => {
    const agent = await agents.openAgent(CHATBOT_AGENT);

    await agent.tabs.openMemory();

    // Enable memory if disabled
    await agent.memory.enableIfDisabled();
    await agent.memory.expectToggleChecked();

    await agent.memory.clickMemoryContext();

    // Clear and fill memory context
    await agent.memory.fillGptMemoryContextTextarea(memoryText);
    await agent.memory.expectContextValue(memoryText);

    // Navigate away and come back
    await agent.tabs.openIntegrationGuide();
    await agent.tabs.openMemory();

    // Verify persistence
    await agent.memory.expectContextValue(memoryText);

    // Disable memory
    await agent.memory.uncheckGptMemoryToggle();
    await agent.memory.expectToggleUnchecked();
  });

});
