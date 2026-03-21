import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { test as base, request as apiRequest } from '@playwright/test';
import { AgentsPage } from '../pages/sidepanel/agents.page';
import { SidepanelPage } from '../pages/sidepanel/sidepanel.page';

const AUTH_FILE = 'playwright/.auth/state.json';

type Fixtures = {
  agents: AgentsPage;
  sidepanel: SidepanelPage;
};

export const test = base.extend<Fixtures>({
  storageState: [
    async ({ browser }, use) => {
      if (!fs.existsSync(AUTH_FILE)) {
        const api = await apiRequest.newContext();
        const res = await api.post(
          'https://dev-db.gtwy.ai/api/auth/generate-token',
          {
            headers: { 'automation-token': process.env.GTWY_AUTOMATION_TOKEN! },
            data: { env: 'dev' },
          }
        );

        if (!res.ok()) throw new Error(`Auth API failed: ${res.status()}`);

        const data = await res.json();
        if (!data.proxy_auth_token) throw new Error('No proxy_auth_token in response');

        await api.dispose();

        const ctx = await browser.newContext();
        const p = await ctx.newPage();
        await p.goto(
          `https://dev.gtwy.ai/login?proxy_auth_token=${data.proxy_auth_token}`
        );
        await p.waitForURL(/\/org\/\d+/, { timeout: 30_000 });

        fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
        await ctx.storageState({ path: AUTH_FILE });
        await ctx.close();
        console.log(data.proxy_auth_token);
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