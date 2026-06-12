import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Playground Test Case Sidebar', () => {

  test('TC-PG-TC-01: Playground test case sidebar full flow', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);

    const { requestBody, responseBody } = await agent.playground.typeMessageAndWaitForApi('testing');
    agent.playground.verifyChatRequestBody(requestBody, 'testing');
    agent.playground.verifyChatResponseBody(responseBody);
    await agent.playground.expectChatMessageVisible(1);

    await agent.playground.expectChatControlsVisible();

    await agent.playground.clickAddNewTestCase();
    await agent.playground.clickCreateTestCase();

    await agent.playground.toggleTestCases();
    await agent.playground.expectTestCaseSidebarVisible();
    await agent.playground.expectRunAllButtonVisible();

    await expect(async () => {
      const count = await agent.playground.getTestCaseCardCount();
      expect(count).toBeGreaterThan(0);
    }).toPass({ timeout: 10000 });

    // Capture the test case ID while sidebar is still open
    const testCaseId = await agent.playground.getLastTestCaseId();

    await agent.playground.expectLastTestCaseExpandButtonVisible();
    await agent.playground.expectLastTestCaseRunButtonVisible();
    await agent.playground.expectLastTestCaseDeleteButtonVisible();

    await agent.playground.clickLastTestCaseCard();

    // Wait for sidebar to close (handleTestCaseClick has a 500ms async delay before closing)
    await expect(agent.playground.page.getByTestId('chat-testcase-sidebar')).not.toBeAttached({ timeout: 5000 });

    // Re-open sidebar
    await agent.playground.toggleTestCases();
    await agent.playground.expectTestCaseSidebarVisible();

    await agent.playground.getTestCaseExpandButton(testCaseId).click();
    await expect(agent.playground.getTestCaseDetails(testCaseId)).toBeVisible();

    await agent.playground.getTestCaseExpandButton(testCaseId).click();
    await expect(agent.playground.getTestCaseDetails(testCaseId)).not.toBeVisible();

    const { requestBody: runReq } = await agent.playground.runTestCaseAndWaitForApi(testCaseId);
    agent.playground.verifyRunTestCaseRequestBody(runReq);

    const { status } = await agent.playground.deleteTestCaseAndWaitForApi(testCaseId);
    expect(status).toBe(200);

    await expect(
      agent.playground.page.getByRole('alert').filter({ hasText: 'Test case deleted successfully' })
    ).toBeVisible({ timeout: 10000 });

    await expect(agent.playground.getTestCaseCard(testCaseId)).not.toBeVisible({ timeout: 15000 });
  });

});
