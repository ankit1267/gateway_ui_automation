import type { Page } from '@playwright/test';
import { getEnvConfig } from '../env.config';
import { getAuthToken } from '../fixtures/base.fixture';

function getDbBaseUrl(): string {
  const { authApiUrl } = getEnvConfig();
  return authApiUrl.replace('/api/auth/generate-token', '');
}

export async function deleteAgentApi(
  page: Page,
  agentId: string,
  authHeader: string | null
): Promise<void> {
  if (!agentId) return;
  await page.context().request.delete(`${getDbBaseUrl()}/api/agent/${agentId}`, {
    headers: {
      ...(authHeader ? { authorization: authHeader } : {}),
      'content-type': 'application/json',
    },
    data: { org_id: process.env.ORG_ID!, restore: false },
  });
}

export async function deleteAgentApiWithToken(
  page: Page,
  agentId: string
): Promise<void> {
  if (!agentId) return;
  const authToken = await getAuthToken();
  const response = await page.context().request.delete(`${getDbBaseUrl()}/api/agent/${agentId}`, {
    headers: {
      authorization: authToken,
      'content-type': 'application/json',
    },
    data: { org_id: process.env.ORG_ID!, restore: false },
  });

  //console.log(`Delete agent API status: ${response.status()}, ok: ${response.ok()}`);
}

export function captureAgentIdFromUrl(page: Page): string {
  const url = page.url();
  //console.log(`Current URL: ${url}`);
  const match = url.match(/\/([a-f0-9]{24})/);
  //console.log(`Match result: ${match?.[1] ?? 'no match'}`);
  return match?.[1] ?? '';
}

export async function deleteKnowledgeBaseResource(
  page: Page,
  resourceId: string,
  authHeader: string | null
): Promise<void> {
  if (!resourceId) return;
  await page.context().request.delete(`${getDbBaseUrl()}/api/rag/resource/${resourceId}`, {
    headers: {
      ...(authHeader ? { authorization: authHeader } : {}),
    },
  });
}

export async function removeToolFromVersion(
  page: Page,
  versionId: string,
  functionId: string,
  functionName: string,
  authHeader: string | null
): Promise<void> {
  if (!versionId || !functionId) return;
  await page.context().request.put(`${getDbBaseUrl()}/api/versions/${versionId}`, {
    headers: {
      ...(authHeader ? { authorization: authHeader } : {}),
      'content-type': 'application/json',
    },
    data: { functionData: { function_id: functionId, function_name: functionName } },
  });
}

export async function removeKBFromVersion(
  page: Page,
  versionId: string,
  originalDocIds: object[],
  authHeader: string | null
): Promise<void> {
  if (!versionId) return;
  await page.context().request.put(`${getDbBaseUrl()}/api/versions/${versionId}`, {
    headers: {
      ...(authHeader ? { authorization: authHeader } : {}),
      'content-type': 'application/json',
    },
    data: { doc_ids: originalDocIds },
  });
}

export async function disablePreTool(
  page: Page,
  agentId: string,
  versionId: string,
  preToolType: string,
  authHeader: string | null
): Promise<void> {
  if (!agentId || !versionId) return;
  await page.context().request.put(`${getDbBaseUrl()}/api/tools/pre_tool/${agentId}`, {
    headers: {
      ...(authHeader ? { authorization: authHeader } : {}),
      'content-type': 'application/json',
    },
    data: { pre_tools: { type: preToolType }, version_id: versionId, status: '0' },
  });
}
