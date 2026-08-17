import { test, expect } from '../../../fixtures/base.fixture';
import { updateParameterWithApi, waitForAgentUpdateApi, verifyAgentUpdateRequest } from '../../../utils/model-api';



const AGENT_NAME = process.env.AGENT_NAME!;


test('Check if llm configs are working', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Gemini');

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
    await model.clickFallbackServiceDropdown();
    await model.clickFallbackServiceDropdown();
    await model.clickFallbackModelDropdown();
    await model.clickFallbackModelDropdown();
    await model.expectFallbackModelDropdownVisible();
    // Test configure api key
    await model.clickConfigureApiKey();

});

test('Set max_tokens to Max and Min and verify in API response', async ({ agents, page }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();
    const model = agent.model;

    // Click Max button and verify API request contains max_tokens value (either 128000 or 'max')
    const maxResponse = await Promise.all([
        waitForAgentUpdateApi(page),
        model.clickAdvancedParameterMaxBtn('max_tokens')
    ]).then(([resp]) => resp);
    
    const maxRequestBody = JSON.parse(maxResponse.request().postData() || '{}');
    expect([128000, 'min']).toContain(maxRequestBody?.configuration?.max_tokens);

    // Click Min button and verify API request contains 'min'
    await updateParameterWithApi(
        page,
        () => model.clickAdvancedParameterMinBtn('max_tokens'),
        'max_tokens',
        'max'
    );

    // Reset to default for cleanup
    await model.clickAdvancedParameterResetBtn('max_tokens');
});

test('Check reasoning dropdown', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();
    await agent.model.selectServiceProvider('Openai');
    const model = agent.model;
     // Test reasoning dropdown
    await model.clickAdvancedParameterreasoningDropdown('reasoning');
    await model.expectAdvancedParameterreasoningVisible('reasoning');
    await model.clickAdvancedParameterreasoningDropdown('reasoning');
});