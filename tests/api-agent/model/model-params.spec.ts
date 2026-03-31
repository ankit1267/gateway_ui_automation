import { test, expect } from '../../../fixtures/base.fixture';

test.describe('Model - Parameters change per model', () => {

  test('TC-MODEL-08: Parameters update when switching between models', async ({ agents, page }) => {
    await agents.goto('api');

    const agent = await agents.openAgent("Mathematical Genius_1");
    await agent.tabs.openModel();

    // API Verification: Wait for Anthropic model selection request
    const anthropicResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/versions/') &&
        resp.request().method() === 'PUT' &&
        resp.status() === 200,
      { timeout: 15000 }
    );

    await agent.model.selectServiceProvider('Anthropic');
    await agent.model.selectModel('claude-3-7-sonnet-latest');

    // API Verification: Verify Anthropic model configuration
    const anthropicResponse = await anthropicResponsePromise;
    const anthropicRequestBody = JSON.parse(anthropicResponse.request().postData() || '{}');
    expect(anthropicRequestBody?.configuration?.service_provider).toBe('anthropic');
    expect(anthropicRequestBody?.configuration?.model).toBe('claude-3-7-sonnet-latest');

    await agent.model.expectParameterVisible('top_p');
    await agent.model.expectParameterNotVisible('parallel_tool_calls');

    // API Verification: Wait for OpenAI model selection request
    const openaiResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/versions/') &&
        resp.request().method() === 'PUT' &&
        resp.status() === 200,
      { timeout: 15000 }
    );

    await agent.model.selectServiceProvider('Openai');
    await agent.model.selectModel('gpt-4o-mini');

    // API Verification: Verify OpenAI model configuration
    const openaiResponse = await openaiResponsePromise;
    const openaiRequestBody = JSON.parse(openaiResponse.request().postData() || '{}');
    expect(openaiRequestBody?.configuration?.service_provider).toBe('openai');
    expect(openaiRequestBody?.configuration?.model).toBe('gpt-4o-mini');

    await agent.model.expectParameterVisible('tool_choice');
    await agent.model.expectParameterVisible('parallel_tool_calls');

    
  });

});
