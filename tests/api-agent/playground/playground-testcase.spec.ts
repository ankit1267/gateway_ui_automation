import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Playground Test Case Sidebar', () => {

  test('TC-PG-TC-01: Playground test case sidebar full flow', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.playground.typeMessage('testing');
    await agent.playground.expectChatMessageVisible(1);

    await agent.playground.expectChatControlsVisible();

    await agent.playground.clickAddNewTestCase();

    await agent.playground.toggleTestCases();
    await agent.playground.expectTestCaseSidebarVisible();
    await agent.playground.expectRunAllButtonVisible();

    await expect(async () => {
      const count = await agent.playground.getTestCaseCardCount();
      expect(count).toBeGreaterThan(0);
    }).toPass({ timeout: 10000 });

    await agent.playground.expectLastTestCaseExpandButtonVisible();
    await agent.playground.expectLastTestCaseRunButtonVisible();
    await agent.playground.expectLastTestCaseDeleteButtonVisible();

    await agent.playground.clickLastTestCaseCard();

    await agent.playground.toggleTestCases();
    await agent.playground.expectTestCaseSidebarVisible();

    await agent.playground.clickLastTestCaseExpandButton();
    await agent.playground.expectLastTestCaseDetailsVisible();

    await agent.playground.clickLastTestCaseExpandButton();
    await agent.playground.expectLastTestCaseDetailsNotVisible();

    await agent.playground.clickLastTestCaseRunButton();

    const lastTestCaseId = await agent.playground.getLastTestCaseId();
    await agent.playground.clickLastTestCaseDeleteButton();

    await expect(
      agent.playground.page.getByRole('alert').filter({ hasText: 'Test case deleted successfully' })
    ).toBeVisible({ timeout: 10000 });

    await expect(agent.playground.getTestCaseCard(lastTestCaseId)).not.toBeVisible({ timeout: 15000 });
  });

});
