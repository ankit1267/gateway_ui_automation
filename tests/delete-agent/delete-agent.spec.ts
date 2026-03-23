import { test } from '../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;

test.describe.serial('Agent - Delete', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-AGENT-01: Delete agent and undo deletion from agents list', async ({ agents }) => {
    await agents.deleteAgentByName(TESTING_AGENT);
    await agents.assertAgentVisible(TESTING_AGENT);
    await agents.undoDeleteAgentByName(TESTING_AGENT);
  });

  test('TC-AGENT-02: Verify 30 days left countdown is visible after agent deletion', async ({ agents }) => {
    await agents.deleteAgentByName(TESTING_AGENT);
    await agents.verifyDeleteCountdown(TESTING_AGENT, 30);
    await agents.undoDeleteAgentByName(TESTING_AGENT);
  });

  test('TC-AGENT-03: Cancel delete action and verify agent remains in list', async ({ agents }) => {
    await agents.cancelDeleteAgentByName(TESTING_AGENT);
    await agents.assertAgentVisible(TESTING_AGENT);
  });

});
