import { test, expect } from '../../../fixtures/base.fixture';
import { openAgentAndAssertApi } from '../../../utils/agent-api';

const TESTING_AGENT_NAME = process.env.TESTING_AGENT!;
const A2A_AGENT = 'Motivation Master';

test('Agent renders inside embed container after selection', async ({
  agents, page,
}) => {

    await agents.goto('api');

  const agent = await openAgentAndAssertApi(agents, page, TESTING_AGENT_NAME);

  await agent.tabs.openConnectors();

  // trigger action
  await agent.connectors.clickAddAgent();

  // capture APIs BEFORE the action that triggers them
  const versionApiPromise = page.waitForResponse(res => {
    if (!res.url().includes('/api/versions') || res.request().method() !== 'PUT') return false;
    const body = res.request().postDataJSON();
    return body?.agents?.connected_agents !== undefined;
  });

  const agentApiPromise = page.waitForResponse(res =>
    res.url().includes('/api/agent/') &&
    res.request().method() === 'PUT'
  );

  // remove agent if already present before adding
  await agent.connectors.removeConnectedAgentIfExists(A2A_AGENT);

  // action AFTER promises are set up - prevents race condition
  await agent.connectors.a2aDropdown.selectAgent(A2A_AGENT);
  await page.getByTestId('agent-description-save-button').click();

  // resolve responses ONCE
  const versionRes = await versionApiPromise;
  const agentRes = await agentApiPromise;

  const versionData = await versionRes.json();
  const agentData = await agentRes.json();

  // basic validation
  expect(versionData.message).toBe('Agent Updated successfully');
  expect(agentData.message).toBe('Agent Updated successfully');

  // =====  REQUEST → RESPONSE VALIDATION =====

  // extract request payload
  const requestPayload = versionRes.request().postDataJSON();

  const connectedAgents = versionData.agent.connected_agents;

  expect(connectedAgents).toBeTruthy();

  // validate the added agent exists in connected_agents by ID
  const addedAgentId = Object.keys(requestPayload.agents.connected_agents)[0];
  
  expect(connectedAgents[addedAgentId]).toBeDefined();
  expect(connectedAgents[addedAgentId].bridge_id).toBe(addedAgentId);
  
  // also validate agent API response
  expect(agentData.agent.name).toBe(A2A_AGENT);

  // UI validation
  await agent.connectors.expectAgentVisible(A2A_AGENT);

  // cleanup
  await agent.connectors.removeAgent();
  await agent.connectors.expectAlert('Agent removed successfully');
  
});