import { test, expect } from '../../fixtures/base.fixture';


const CHILD_AGENT = 'ChildAgent';


test('TC-AGENT-05: Verify connected agent cannot be deleted from chatbot list', async ({ agents }) => {
  await agents.goto('chatbot');

  await agents.deleteAgentByName(CHILD_AGENT);

  await expect(
    agents.sidebar.getToast('Cannot delete agent. It is')
  ).toBeVisible();
});
