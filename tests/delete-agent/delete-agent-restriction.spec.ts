import { Sidebar } from '../../components/sidebar/sidebar.component';
import { test, expect } from '../../fixtures/base.fixture';

const PARENT_AGENT = 'Motivational Quotist';
const CHILD_AGENT = 'ChildAgent';

test('TC-AGENT-04: Verify error when deleting an agent that is used as a connector', async ({ agents, sidepanel }) => {
  await agents.goto('api');

  const agent = await agents.openAgent(PARENT_AGENT);
  await agent.tabs.openConnectors();
  await agent.connectors.clickAddAgent();
  await agent.connectors.a2aDropdown.selectAgent(CHILD_AGENT);

  await agents.sidebar.toggleSidebar();
  await agents.sidebar.openChatbot();

  await agents.deleteAgentByName(CHILD_AGENT);

  await expect(agents.sidebar.getToast('Cannot delete agent. It is')).toBeVisible();

  await agents.sidebar.openApi();

  const parentAgent = await agents.openAgent(PARENT_AGENT);
  await parentAgent.tabs.openConnectors();
  await parentAgent.connectors.removeAgent();
});

test('TC-AGENT-05: Verify connected agent cannot be deleted from chatbot list', async ({ agents }) => {
  await agents.goto('chatbot');

  await agents.deleteAgentByName(CHILD_AGENT);

  await expect(
    agents.sidebar.getToast('Cannot delete agent. It is')
  ).toBeVisible();
});
