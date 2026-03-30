import { test } from '../../fixtures/base.fixture';

const DELETE_AGENT = 'DeleteAgent';

test.describe('Agent - Delete', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-AGENT-01: Delete agent and undo deletion from agents list', async ({ agents }) => {
    await agents.deleteAgentByName(DELETE_AGENT);
    await agents.assertAgentVisible(DELETE_AGENT);
    await agents.undoDeleteAgentByName(DELETE_AGENT);
  });

  test('TC-AGENT-02: Verify 30 days left countdown is visible after agent deletion', async ({ agents }) => {
    await agents.deleteAgentByName(DELETE_AGENT);
    await agents.verifyDeleteCountdown(DELETE_AGENT, 30);
    await agents.undoDeleteAgentByName(DELETE_AGENT);
  });

  test('TC-AGENT-03: Cancel delete action and verify agent remains in list', async ({ agents }) => {
    await agents.cancelDeleteAgentByName(DELETE_AGENT);
    await agents.assertAgentVisible(DELETE_AGENT);
  });

});
