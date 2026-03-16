import { test } from '../../../fixtures/base.fixture';



const AGENT_ID = process.env.AGENT_ID!;


test('Check if llm configs are working', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgentById(AGENT_ID);
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

