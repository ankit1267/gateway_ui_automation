import { test, expect } from '../../../fixtures/base.fixture';



const AGENT_NAME = process.env.AGENT_NAME!;


test('Check if llm configs are working', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openModel();
    const model = agent.model;
    // Test max_tokens slider and buttons
    await model.fillAdvancedParameter('max_tokens', '38216');
    await model.clickAdvancedParameterMaxBtn('max_tokens');
    await model.clickAdvancedParameterMinBtn('max_tokens');
    await model.clickAdvancedParameterResetBtn('max_tokens');

    // Test tool_choice dropdown
    await model.clickAdvancedParameterDropdown('tool_choice');
    await model.expectAdvancedParameterMenuVisible('tool_choice');
    await model.clickAdvancedParameterDropdown('tool_choice');
    // Test parallel tool calls checkbox
    await model.toggleParallelToolChoice(false);
    await model.toggleParallelToolChoice(true);
    // Test fallback model toggle works
    await model.toggleFallbackModel(false);
    await model.expectEnableFallbackModelTextVisible();
    await model.toggleFallbackModel(true);
    await model.expectFallbackModelContainerVisible();
    await model.clickFallbackServiceDropdown();
    await model.expectFallbackServiceDropdownVisible();
    await model.clickFallbackModelDropdown();
    await model.expectFallbackModelDropdownVisible();
    // Test configure api key
    await model.clickConfigureApiKey();
    await model.expectDropdownApiKeyVisible();

});

test('Set max_tokens to Max and Min and verify in API response', async ({ agents, page }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openModel();
    const model = agent.model;

    // Click Max button and verify API request
    const maxResponsePromise = page.waitForResponse(
        (resp) =>
            resp.url().includes('/api/versions/') &&
            resp.request().method() === 'PUT' &&
            resp.status() === 200,
        { timeout: 15000 }
    );
    await model.clickAdvancedParameterMaxBtn('max_tokens');
    const maxResponse = await maxResponsePromise;
    const maxRequestBody = JSON.parse(maxResponse.request().postData() || '{}');
    expect(maxRequestBody?.configuration?.max_tokens).toBe(128000);

    // Click Min button and verify API request
    const minResponsePromise = page.waitForResponse(
        (resp) =>
            resp.url().includes('/api/versions/') &&
            resp.request().method() === 'PUT' &&
            resp.status() === 200,
        { timeout: 15000 }
    );
    await model.clickAdvancedParameterMinBtn('max_tokens');
    const minResponse = await minResponsePromise;
    const minRequestBody = JSON.parse(minResponse.request().postData() || '{}');
    expect(minRequestBody?.configuration?.max_tokens).toBe('min');

    // Reset to default for cleanup
    await model.clickAdvancedParameterResetBtn('max_tokens');
});
