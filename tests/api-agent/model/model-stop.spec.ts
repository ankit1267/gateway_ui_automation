import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = "Model Stop Testing";

test.describe('Model - Stop parameter', () => {

  test('TC-MODEL-09: Fill stop parameter and verify set default resets it', async ({ agents, page }) => {
    await agents.goto('api');

    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openModel();

    await agent.model.expectParameterVisible('stop');

    // API Verification: Wait for stop parameter update request
    const fillResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/versions/') &&
        resp.request().method() === 'PUT' &&
        resp.status() === 200,
      { timeout: 15000 }
    );

    await agent.model.fillAdvancedParameterText('stop', 'you');

    // API Verification: Verify stop parameter in request
    const fillResponse = await fillResponsePromise;
    const fillRequestBody = JSON.parse(fillResponse.request().postData() || '{}');
    expect(fillRequestBody?.configuration?.stop).toBe('you');

    // API Verification: Wait for reset request
    const resetResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/versions/') &&
        resp.request().method() === 'PUT' &&
        resp.status() === 200,
      { timeout: 15000 }
    );

    await agent.model.clickAdvancedParameterResetBtn('stop');

    // API Verification: Verify stop parameter is reset
    const resetResponse = await resetResponsePromise;
    const resetRequestBody = JSON.parse(resetResponse.request().postData() || '{}');
    expect(resetRequestBody?.configuration?.stop).toBeUndefined();
  });

});
