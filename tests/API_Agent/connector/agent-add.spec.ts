import { test } from '@playwright/test';
import { ConnectorPage } from '../../../pages/api_agent/connectorPage';

test.use({ storageState: 'auth.json' });

const ORG_ID = process.env.ORG_ID!;
const AGENT_NAME = process.env.AGENT_NAME!;
const A2A_AGENT = 'chatbotagent';

test(
  'Agent renders inside embed container after selection',
  async ({ page }) => {
    await page.goto(`/org/${ORG_ID}/agents`);

    const connectorPage = new ConnectorPage(page);

    await connectorPage.openAgent(AGENT_NAME);
    await connectorPage.openConnectorsTab();

    await connectorPage.addConnectedAgent();
    await connectorPage.selectAgent(A2A_AGENT);

    await connectorPage.expectAgentContainer(A2A_AGENT);
    await connectorPage.removeAgent();
  }
);
