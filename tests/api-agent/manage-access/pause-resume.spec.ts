import { test } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;

test.describe.serial('Agents - Pause & Resume - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-ACCESS-04: Pause agent from More Options menu and verify success toast, then resume and verify success toast', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);

    await agents.pauseAgent(TESTING_AGENT);
    await agents.expectPausedToastVisible();

    await agents.resumeAgent(TESTING_AGENT);
    await agents.expectResumedToastVisible();
  });

});
