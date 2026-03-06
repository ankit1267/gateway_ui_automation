import { test } from '../../../fixtures/base.fixture';

test.describe('Widget Response Type', () => {

  test('TC-WIDGET-01: Select widgets and verify selection count updates', async ({ agents }) => {
    await agents.goto('api');

    const agent = await agents.openAgent(process.env.AGENT_NAME!);

    await agent.prompt.selectResponseType('widget');

    await agent.prompt.expectAvailableWidgetsPanelVisible();

    await agent.prompt.selectWidgetByIndex(0);
    await agent.prompt.expectSelectedWidgetChipVisible(2);
    await agent.prompt.selectWidgetByIndex(0);
    

  });

});
