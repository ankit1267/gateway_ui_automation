import { test, expect } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test('TC-FLOW-01: Enable agent flow, verify playground visible, navigate back', async ({ agents }) => {
  await agents.goto('api');

  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openSettings();

  await agent.settings.checkAgentFlowToggle();

  await expect(agent.settings.agentFlowTestModelTextbox).toBeVisible();

  await agent.settings.clickAgentFlowBack();
  await expect(agent.settings.tabsLayoutContent).toBeVisible();

  await agent.settings.uncheckAgentFlowToggle();
});
