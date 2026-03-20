import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test.describe('Test Cases - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-TESTCASE-01: Open first test case row and verify elements, then run test case v1 and v2', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Openai');
    await agent.header.openTestCases();

    // Open the first row
    await agent.testCasePage.clickRow(0);

    // Check user input and expected output visible
    await agent.testCasePage.expectUserInputVisible();
    await agent.testCasePage.expectExpectedOutputVisible();

    // Check edit and delete buttons visible
    await agent.testCasePage.expectEditButtonVisible();
    await agent.testCasePage.expectDeleteButtonVisible();

    // Click run test case v1 button (index 0)
    await agent.testCasePage.clickRunTestCaseVersion(0);
    await agent.testCasePage.expectTestCaseRunSuccessToast();
    await agent.testCasePage.closeSuccessToast();

    // Click run test case v2 button (index 1)
    await agent.testCasePage.clickRunTestCaseVersion(1);
    await agent.testCasePage.expectTestCaseRunSuccessToast();
  });

});
