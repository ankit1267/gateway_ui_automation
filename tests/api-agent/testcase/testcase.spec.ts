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

  test('TC-TESTCASE-02: Test Cases page header is visible on navigation', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
  
    await agent.header.openTestCases();
    await agent.testCasePage.expectPageHeaderVisible();
  });

  test('TC-TESTCASE-03: URL changes to /testcase path when navigating to Test Cases tab', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.header.openTestCases();
    await expect(page).toHaveURL(/\/agents\/testcase\//);
  });

  test('TC-TESTCASE-04: Test Cases table and all column headers are visible', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    
    await agent.header.openTestCases();
    await agent.testCasePage.expectTableVisible();
    await agent.testCasePage.expectColumnHeadersVisible();
  });

  test('TC-TESTCASE-05: Navigate back to Agent Config from Test Cases restores configure URL', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    
    await agent.header.openTestCases();
    await expect(page).toHaveURL(/\/agents\/testcase\//);
    await agent.header.openChatbotConfig();
    await expect(page).toHaveURL(/\/agents\/configure\//);
  });

});
