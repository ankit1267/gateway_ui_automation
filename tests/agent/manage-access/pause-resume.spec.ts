import { test } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;

test.describe('Agents - Pause & Resume - API Agent', () => {

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

  test('TC-ACCESS-05: Pause agent and verify paused tag appears, then resume and verify paused tag is removed', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);

    await agents.pauseAgent(TESTING_AGENT);
    await agents.expectPausedToastVisible();
    await agents.expectPausedTagVisibleOnAgentRow(TESTING_AGENT);

    await agents.resumeAgent(TESTING_AGENT);
    await agents.expectResumedToastVisible();
    await agents.expectPausedTagRemovedFromAgentRow(TESTING_AGENT);
  });

});
