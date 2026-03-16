import { test, expect } from '../../fixtures/base.fixture';

const AGENT_ID = process.env.AGENT_ID!;

test.describe('History - API Agent Thread Response', () => {
  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-HISTORY-03: Open a history thread and verify thread response is shown', async ({ agents }) => {
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.header.openHistory();

    const apiStatus = await agent.history.openFirstSidebarThreadAndGetApiStatus();
    expect(apiStatus).toBe(200);
    await agent.history.expectThreadResponseVisible();
  });
});
