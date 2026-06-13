import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Agent Name - API vs Frontend Match', () => {

  test('TC-AGENT-NAME-API-01: Agent name on frontend matches API response name field', async ({ agents, page }) => {
    await agents.goto('api');

    // Use exact regex to match single-agent endpoint (GET /api/agent/{24-char-id})
    // Avoids matching the list endpoint GET /api/agent/ which fires at the same time
    const responsePromise = page.waitForResponse(
      (response) =>
        /\/api\/agent\/[a-f0-9]{24}$/.test(response.url()) &&
        response.request().method() === 'GET' &&
        response.status() === 200,
      { timeout: 45000 }
    );

    const agent = await agents.openAgent(AGENT_NAME);

    // Wait for single-agent API response
    const response = await responsePromise;

    // Extract agent ID from page URL after navigation
    const agentId = page.url().match(/([a-f0-9]{24})/)?.[1];
    expect(response.url()).toContain(agentId);

    // Response shape: { success, agent: { name, ... }, access }
    const responseBody = await response.json();
    const apiAgentName: string = responseBody.agent.name;

    // Wait for frontend name element and compare
    await expect(page.getByTestId('navbar-agent-name-display')).toBeVisible({ timeout: 10000 });
    const frontendAgentName = await agent.header.getAgentNameText();

    expect(frontendAgentName.trim()).toBe(apiAgentName.trim());
  });

});
