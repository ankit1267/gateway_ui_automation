import { test as base } from '@playwright/test';
import { AgentsPage } from '../pages/sidepanel/agents.page';
import { SidepanelPage } from '../pages/sidepanel/sidepanel.page';

type Fixtures = {
  agents: AgentsPage;
  sidepanel: SidepanelPage;
};

export const test = base.extend<Fixtures>({
  storageState: 'playwright/.auth/state.json',

  agents: async ({ page }, use) => {
    await use(new AgentsPage(page));
  },
  sidepanel: async ({ page }, use) => {
    await use(new SidepanelPage(page));
  }
});

export const expect = test.expect;