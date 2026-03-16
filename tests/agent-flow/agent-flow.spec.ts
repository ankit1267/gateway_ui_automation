import { test, expect } from '../../fixtures/base.fixture';

const AGENT_ID = process.env.TESTING_AGENT_ID!;

test('TC-FLOW-01: Enable agent flow, verify playground visible, navigate back', async ({ agents }) => {
  await agents.goto('api');

  const agent = await agents.openAgentById(AGENT_ID);
  await agent.tabs.openSettings();

  await agent.settings.checkAgentFlowToggle();

  await expect(agent.settings.agentFlowTestModelTextbox).toBeVisible();

  await agent.settings.clickAgentFlowBack();
  await expect(agent.settings.tabsLayoutContent).toBeVisible();

  await agent.settings.uncheckAgentFlowToggle();
});
