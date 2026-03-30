import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { test as base, request as apiRequest } from '@playwright/test';
import { AgentsPage } from '../pages/sidepanel/agents.page';
import { SidepanelPage } from '../pages/sidepanel/sidepanel.page';
import { getEnvConfig } from '../env.config';

const testEnv = process.env.TEST_ENV || 'dev';
const AUTH_FILE = `playwright/.auth/state-${testEnv}.json`;

let _cachedToken = '';
let _cachedProxyToken = '';

export async function getAuthToken(): Promise<string> {
  if (_cachedToken) return _cachedToken;
  const envConfig = getEnvConfig();
  const api = await apiRequest.newContext();
  const res = await api.post(envConfig.authApiUrl, {
    headers: { 'automation-token': process.env.GTWY_AUTOMATION_TOKEN! },
    data: { env: envConfig.envParam },
  });
  if (!res.ok()) throw new Error(`Auth API failed: ${res.status()}`);
  const data = await res.json();
  console.log('[Auth API response]', data);
  if (!data.proxy_auth_token) throw new Error('No proxy_auth_token in response');
  _cachedToken = data.token;
  _cachedProxyToken = data.proxy_auth_token;
  await api.dispose();
  return _cachedToken;
}

type Fixtures = {
  agents: AgentsPage;
  sidepanel: SidepanelPage;
};

export const test = base.extend<Fixtures>({
  storageState: [
    async ({ browser }, use) => {
      if (!fs.existsSync(AUTH_FILE)) {
        const envConfig = getEnvConfig();
        await getAuthToken();
        const ctx = await browser.newContext();
        const p = await ctx.newPage();
        await p.goto(
          `${envConfig.appUrl}/login?proxy_auth_token=${_cachedProxyToken}`
        );
        await p.waitForURL(/\/org\/\d+/, { timeout: 30_000 });

        fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
        await ctx.storageState({ path: AUTH_FILE });
        await ctx.close();
      }
      

      await use(AUTH_FILE);
    },
    { scope: 'test' },
  ],

  agents: async ({ page }, use) => {
    await use(new AgentsPage(page));
  },
  sidepanel: async ({ page }, use) => {
    await use(new SidepanelPage(page));
  }
});

export const expect = test.expect;