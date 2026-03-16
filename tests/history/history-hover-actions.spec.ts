import { test } from '../../fixtures/base.fixture';

const AGENT_ID = process.env.AGENT_ID!;

test.describe('History - API Agent Hover Actions', () => {
  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-HISTORY-04: Hover group chat agents response and verify hover actions are visible', async ({ agents }) => {
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.header.openHistory();

    await agent.history.openFirstSidebarThread();
    await agent.history.expectThreadResponseVisible();

    await agent.history.hoverGroupChatAgentsResponse();
    await agent.history.expectGroupChatHoverActionsVisible();
  });
});
