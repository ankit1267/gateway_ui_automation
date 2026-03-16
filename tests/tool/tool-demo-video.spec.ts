import { test } from '../../fixtures/base.fixture';

const AGENT_ID = process.env.TESTING_AGENT_ID!;

test.describe('Tool - Info Tooltip Demo Video', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-TOOL-01: Tutorial video iframe is visible after clicking info tooltip video button', async ({ agents }) => {
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.tabs.openConnectors();
    await agent.connectors.hoverInfoTooltipIcon();
    await agent.connectors.clickInfoTooltipVideoButton();
    await agent.connectors.expectTutorialVideoVisible();
  });

});
