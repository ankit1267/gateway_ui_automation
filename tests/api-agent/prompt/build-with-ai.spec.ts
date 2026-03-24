import { test } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Prompt - Build with AI', () => {
  test('TC-PROMPT-BAI-01: generate and apply instruction from Build with AI panel', async ({ agents }) => {
    await agents.goto('api');

    const agent = await agents.openAgent(AGENT_NAME);

    await agent.prompt.openBuildWithAI();
    await agent.prompt.closeBuildWithAI();
    await agent.prompt.openBuildWithAI();
    await agent.prompt.promptHelper.generateInstruction('improve');
    await agent.prompt.promptHelper.clickCanvasSendButton();

    await agent.prompt.promptHelper.expectApplyButtonVisible();
    await agent.prompt.promptHelper.clickResetChat();
    await agent.prompt.promptHelper.expectConversationsCleared();

    await agent.prompt.promptHelper.generateInstruction('improve');
    await agent.prompt.promptHelper.clickCanvasSendButton();

    await agent.prompt.promptHelper.expectApplyButtonVisible();
    await agent.prompt.promptHelper.expectCopyButtonVisible();

    await agent.prompt.expectBuildWithAIScrollable();

    await agent.prompt.promptHelper.clickApplyButton();

    await agent.prompt.promptHelper.expectMainVisible();

    
  });
});
