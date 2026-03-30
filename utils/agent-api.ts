import type { Page } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';
import { getAuthToken } from '../fixtures/base.fixture';
import { getEnvConfig } from '../env.config';
import type { AgentPage } from '../pages/agent/agent.page';
import type { AgentsPage } from '../pages/sidepanel/agents.page';

export async function openAgentAndAssertApi(
  agents: AgentsPage,
  page: Page,
  expectedAgentName: string
): Promise<AgentPage> {
  const [agentApiResponse, agent] = await Promise.all([
    page.waitForResponse(res =>
      /\/api\/agent\/[a-f0-9]{24}$/.test(res.url()) &&
      res.request().method() === 'GET' &&
      res.status() === 200
    ),
    agents.openAgent(expectedAgentName),
  ]);

  const agentApiData = await agentApiResponse.json();
  expect(agentApiData.agent.name).toBe(expectedAgentName);

  return agent;
}


export async function getAgentData(
  request: any,
  agentId: string
) {
  const token = await getAuthToken();
  const envConfig = getEnvConfig();
  const dbApiBaseUrl = envConfig.authApiUrl.replace('/api/auth/generate-token', '');

  const res = await request.get(
    `${dbApiBaseUrl}/api/versions/${agentId}`,
    {
      headers: {
        authorization: token,
      },
    }
  );

  if (res.status() !== 200) {
    throw new Error(`Failed to fetch agent`);
  }

  return res.json();
}