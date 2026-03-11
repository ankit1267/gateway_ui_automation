import { test } from '../../../fixtures/base.fixture';

const Agent = process.env.AGENT_NAME!;

test.describe('Model - Hover Preview', () => {

  test('TC-MODEL-HOVER-01: hovering over a model option shows model information panel', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(Agent);
    await agent.tabs.openModel();

    await agent.model.selectServiceProvider('Openai');

    await agent.model.openModelDropdown();

    await agent.model.hoverOverModelOption('gpt-5-nano');

    await agent.model.expectModelPreviewVisible();
    await agent.model.expectModelPreviewContainsName('gpt-5-nano');
  });

  test('TC-MODEL-HOVER-02: model preview disappears when mouse leaves the dropdown', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(Agent);
    await agent.tabs.openModel();

    await agent.model.selectServiceProvider('Openai');

    await agent.model.openModelDropdown();
    await agent.model.hoverOverModelOption('gpt-5-nano');
    await agent.model.expectModelPreviewVisible();

    await agent.getPage.mouse.move(0, 0);
    await agent.model.expectModelPreviewNotVisible();
  });

  test('TC-MODEL-HOVER-03: hovering different models updates the preview', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(Agent);
    await agent.tabs.openModel();

    await agent.model.selectServiceProvider('Openai');

    await agent.model.openModelDropdown();

    await agent.model.hoverOverModelOption('gpt-5-nano');
    await agent.model.expectModelPreviewVisible();
    await agent.model.expectModelPreviewContainsName('gpt-5-nano');

    await agent.model.hoverOverModelOption('gpt-4.1');
    await agent.model.expectModelPreviewContainsName('gpt-4.1');
  });

});
