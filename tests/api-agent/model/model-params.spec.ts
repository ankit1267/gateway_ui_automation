import { test } from '../../../fixtures/base.fixture';

test.describe('Model - Parameters change per model', () => {

  test('TC-MODEL-08: Parameters update when switching between models', async ({ agents }) => {
    await agents.goto('api');

    const agent = await agents.openAgent("Mathematical Genius_1");
    await agent.tabs.openModel();

    await agent.model.selectServiceProvider('Anthropic');
    await agent.model.selectModel('claude-3-7-sonnet-latest');

    await agent.model.expectParameterVisible('top_p');
    await agent.model.expectParameterNotVisible('parallel_tool_calls');

    await agent.model.selectServiceProvider('Openai');
    await agent.model.selectModel('gpt-4o-mini');

    await agent.model.expectParameterVisible('tool_choice');
    await agent.model.expectParameterVisible('parallel_tool_calls');

    
  });

});
