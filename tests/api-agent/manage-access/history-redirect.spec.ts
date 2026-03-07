import { test } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;

test.describe('Agents - History Button Redirect - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-ACCESS-03: Clicking History button on agent row redirects to agent history page', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);

    await agents.clickHistoryButton(TESTING_AGENT);

    await agents.expectHistoryPageUrl();
  });

});
