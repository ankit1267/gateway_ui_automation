import { test, expect } from '../../../fixtures/base.fixture';
import { openAgentAndAssertApi } from '../../../utils/agent-api';

const TESTING_AGENT_NAME = process.env.TESTING_AGENT!;
const A2A_AGENT = process.env.AGENT_NAME!;

test('Agent renders inside embed container after selection', async ({
  agents, page,
}) => {

    await agents.goto('api');

  const agent = await openAgentAndAssertApi(agents, page, TESTING_AGENT_NAME);

  await agent.tabs.openConnectors();

  // trigger action
  await agent.connectors.clickAddAgent();
  
  // capture APIs AFTER opening dropdown to avoid background requests
  const versionApiPromise = page.waitForResponse(res => {
    if (!res.url().includes('/api/versions') || res.request().method() !== 'PUT') return false;
    const body = res.request().postDataJSON();
    // Only capture if request has connected_agents in payload (agent-add specific)
    return body?.agents?.connected_agents !== undefined;
  });

  const agentApiPromise = page.waitForResponse(res =>
    res.url().includes('/api/agent/') &&
    res.request().method() === 'PUT'
  );

  await agent.connectors.a2aDropdown.selectAgent(A2A_AGENT);

  // resolve responses ONCE
  const versionRes = await versionApiPromise;
  const agentRes = await agentApiPromise;

  console.log('[CAPTURED] Version API:', {
    url: versionRes.url(),
    method: versionRes.request().method(),
    status: versionRes.status()
  });

  console.log('[CAPTURED] Agent API:', {
    url: agentRes.url(),
    method: agentRes.request().method(),
    status: agentRes.status()
  });

  const versionData = await versionRes.json();
  const agentData = await agentRes.json();

  // logs
  console.log('===== VERSION API RESPONSE =====');
  console.log(JSON.stringify(versionData, null, 2));

  console.log('===== AGENT API RESPONSE =====');
  console.log(JSON.stringify(agentData, null, 2));

  console.log('Version API URL:', versionRes.url());
  console.log('Agent API URL:', agentRes.url());

  // basic validation
  expect(versionData.message).toBe('Agent Updated successfully');
  expect(agentData.message).toBe('Agent Updated successfully');

  // ===== 🔥 REQUEST → RESPONSE VALIDATION =====

  // extract request payload
  const requestPayload = versionRes.request().postDataJSON();

  console.log('===== VERSION REQUEST PAYLOAD =====');
  console.log(JSON.stringify(requestPayload, null, 2));

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