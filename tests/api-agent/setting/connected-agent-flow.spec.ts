import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_FLOW_AGENT!;

test.describe('Settings - Connected Agent Flow', () => {

  test('TC-FLOW-02: Test model via connected agent flow sends message and opens chat', async ({ agents }) => {
    await agents.goto('api');

    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openSettings();

    await agent.settings.checkAgentFlowToggle();
    await expect(agent.settings.agentFlowTestModelTextbox).toBeVisible();

    await agent.settings.fillAndSendAgentFlowTestMessage('hi');
    await agent.settings.expectAgentFlowChatVisible();

    await agent.settings.closeAgentFlowChat();

    await agent.settings.clickAgentFlowBack();
    await expect(agent.settings.tabsLayoutContent).toBeVisible();
  });

});
