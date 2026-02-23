import { test as base } from '@playwright/test';
import { AgentsPage } from '../pages/sidepanel/agents.page';

type Fixtures = {
  agents: AgentsPage;
};

export const test = base.extend<Fixtures>({
  storageState: 'auth.json',

  agents: async ({ page }, use) => {
    await use(new AgentsPage(page));
  }
});

export const expect = test.expect;