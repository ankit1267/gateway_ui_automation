import { test } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;

test.describe('Agent - Navbar Navigation', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });


  test('TC-NAV-01: Click Test Cases tab and verify test cases table is visible', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);

    const agent = await agents.openAgent(TESTING_AGENT);

    await agent.header.openTestCases();

    await agent.testCasePage.expectPageHeaderVisible();
  });

  test('TC-NAV-02: Click History tab and verify thread container is visible', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);

    const agent = await agents.openAgent(TESTING_AGENT);
   

    await agent.header.openHistory();

    await agent.history.expectThreadContainerVisible();
  });

  test('TC-NAV-03: Click Updates History button and verify config history slider opens', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);

    const agent = await agents.openAgent(TESTING_AGENT);
   

    await agent.header.openUpdatesHistory();

    await agent.header.assertConfigHistorySliderVisible();
  });

});
