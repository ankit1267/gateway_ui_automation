import { test, expect } from '../../../fixtures/base.fixture';
import { getEnvConfig } from '../../../env.config';
import { getAuthToken } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Settings - Cached Response', () => {

  test('TC-CACHE-01: Verify cached response section is visible in settings tab', async ({ agents }) => {
    await agents.goto('api');

    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openSettings();
    await agent.settings.ensureApiMode();

    // Verify cached response section is visible
    await agent.settings.expectCachedResponseVisible();
  });

  test('TC-CACHE-02: Toggle cached response on and validate API response', async ({ agents, page }) => {
    await agents.goto('api');

    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openSettings();
    await agent.settings.ensureApiMode();

    // Get initial state
    const initialState = await agent.settings.isCachedResponseChecked();

    // Wait for API response when toggling
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/versions/') && response.request().method() === 'PUT'
    );

    // Toggle to opposite state via UI
    await agent.settings.toggleCachedResponse();

    // Wait for and validate the API response
    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.agent).toHaveProperty('cache_on');

    // Verify UI state changed
    const newState = await agent.settings.isCachedResponseChecked();
    expect(newState).toBe(!initialState);

    // Verify API response matches UI state
    expect(body.agent.cache_on).toBe(newState);

    //console.log(`API validation passed: cache_on is ${newState}`);

    // Restore initial state
    await agent.settings.toggleCachedResponse();
  });

});
