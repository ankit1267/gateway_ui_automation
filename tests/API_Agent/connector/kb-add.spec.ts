import { test } from '@playwright/test';
import { ConnectorPage } from '../../../pages/api_agent/connectorPage';

test.use({ storageState: 'auth.json' });

const ORG_NAME = process.env.WORKSPACE_NAME!;
const AGENT_NAME = process.env.AGENT_NAME!;
const K_BASE = 'Resume';

test.beforeEach(async ({ page }) => {
    await page.goto('/org');
    await page.getByText(`${ORG_NAME}`).click();
})

test(
  'Knowledgebase renders inside embed container after selection',
  async ({ page }) => {
    const connectorPage = new ConnectorPage(page);

    await connectorPage.openAgent(AGENT_NAME);
    await connectorPage.openConnectorsTab();

    await connectorPage.addKnowledgeBase();
    await connectorPage.selectKnowledgeBase(K_BASE);

    await connectorPage.expectKB(K_BASE);
    await connectorPage.removeKB();
  }
);
