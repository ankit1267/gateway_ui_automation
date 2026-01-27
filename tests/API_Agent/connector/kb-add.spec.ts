import { test } from '@playwright/test';
import { ConnectorPage } from '../../../pages/api_agent/connectorPage';

test.use({ storageState: 'auth.json' });

const ORG_ID = process.env.ORG_ID!;
const AGENT_NAME = process.env.AGENT_NAME!;
const K_BASE = 'Insurance Info';

test(
  'Knowledgebase renders inside embed container after selection',
  async ({ page }) => {
    await page.goto(`/org/${ORG_ID}/agents`);

    const connectorPage = new ConnectorPage(page);

    await connectorPage.openAgent(AGENT_NAME);
    await connectorPage.openConnectorsTab();

    await connectorPage.addKnowledgeBase();
    await connectorPage.selectKnowledgeBase(K_BASE);

    await connectorPage.expectKB(K_BASE);
    await connectorPage.removeKB();
  }
);
