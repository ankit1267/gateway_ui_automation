import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test.describe('Tool Call Count - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-SET-08: Maximum Function Call Limit label and input are visible, input clamps 90 to 30', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openSettings();

    await agent.settings.expectMaximumFunctionCallLimitVisible();
    await agent.settings.expectToolCallCountInputVisible();

    await agent.settings.fillToolCallCount('90');
    const value = await agent.settings.getToolCallCountValue();
    expect(value).toBe('30');
    await agent.settings.fillToolCallCount('2');
  });

});
