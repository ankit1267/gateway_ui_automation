import { test } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!

test.describe('Agent - Config History Panel', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-HISTORY-01: Click Updates History button on navbar and verify side panel is visible', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);

    const agent = await agents.openAgent(TESTING_AGENT);

    await agent.header.openUpdatesHistory();

    await agent.header.assertConfigHistorySliderVisible();
  });

});
