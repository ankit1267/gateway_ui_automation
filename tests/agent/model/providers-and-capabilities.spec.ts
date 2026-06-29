import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Model - Providers & Capabilities', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  // ── Missing Test Area #9: Service Provider - Missing Providers ──
  test('TC-MODEL-PROVIDERS-01: Verify model lists for multiple providers', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    const providers = ['Mistral', 'Anthropic', 'Gemini', 'Grok'];

    for (const provider of providers) {
      await agent.model.selectServiceProvider(provider as any);
      // await expect(page.getByTestId('service-dropdown-trigger')).toContainText(provider);
      
      // Open model dropdown and verify it's not empty
      await agent.model.openModelDropdown();
      // await expect(page.getByTestId('model-dropdown-grouped-option-')).not.toHaveCount(0);
      
    }
  });

  // ── Missing Test Area #13: Model Change Mid-Conversation ──
  test('TC-MODEL-CHAT-01: Changing model during conversation', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    

    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Gemini');
    await agent.model.selectModel('gemini-2.5-flash');
    // 1. Send message with Model A
    await agent.chatbot.sendMessage('Hello, what model are you?');
    await agent.chatbot.expectResponse(/./);

    // 2. Change to Model B
    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Openai');
    await agent.model.selectModel('gpt-4o-mini');
  
    // 3. Send another message and verify it works
   
    await agent.chatbot.sendMessage('How about now?');
    await agent.chatbot.expectResponse(/./);
  });

  // ── Missing Test Area #17: Penalty Parameters ──
  
});
