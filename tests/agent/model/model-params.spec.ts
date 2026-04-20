import { test, expect } from '../../../fixtures/base.fixture';
import { waitForAgentUpdateApi, verifyAgentUpdateRequest } from '../../../utils/model-api';

test.describe('Model - Parameters change per model', () => {

  test('TC-MODEL-08: Parameters update when switching between models', async ({ agents, page }) => {
    await agents.goto('api');

    const agent = await agents.openAgent("Mathematical Genius_1");
    await agent.tabs.openModel();

    // API Verification: Select Anthropic service provider
    const [serviceResponse] = await Promise.all([
      waitForAgentUpdateApi(page, { payloadField: 'service' }),
      agent.model.selectServiceProvider('Anthropic')
    ]);

    await verifyAgentUpdateRequest(serviceResponse, {
      'service': 'anthropic'
    });

    // API Verification: Select Anthropic model
    const anthropicResponse = await Promise.all([
      waitForAgentUpdateApi(page),
      agent.model.selectModel('claude-opus-4-6')
    ]).then(([resp]) => resp);

    await verifyAgentUpdateRequest(anthropicResponse, {
      'configuration.model': 'defined'
    });

    await agent.model.expectParameterVisible('top_p');
    await agent.model.expectParameterNotVisible('parallel_tool_calls');

    // API Verification: Select OpenAI service provider
    const [openaiServiceResponse] = await Promise.all([
      waitForAgentUpdateApi(page, { payloadField: 'service' }),
      agent.model.selectServiceProvider('Openai')
    ]);

    await verifyAgentUpdateRequest(openaiServiceResponse, {
      'service': 'openai'
    });

    // API Verification: Select OpenAI model
    const openaiResponse = await Promise.all([
      waitForAgentUpdateApi(page),
      agent.model.selectModel('gpt-4o-mini')
    ]).then(([resp]) => resp);

    await verifyAgentUpdateRequest(openaiResponse, {
      'configuration.model': 'defined'
    });

    await agent.model.expectParameterVisible('tool_choice');
    await agent.model.expectParameterVisible('parallel_tool_calls');

    
  });

});
