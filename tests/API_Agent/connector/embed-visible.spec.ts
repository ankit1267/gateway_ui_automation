import { test } from '@playwright/test';
import { ConnectorPage } from '../../../pages/api_agent/connectorPage';

test.use({ storageState: 'auth.json' });

const ORG_ID = process.env.ORG_ID!;
const AGENT_NAME = process.env.AGENT_NAME!;

test(
  'ViaSocket embed is visible when adding a tool',
  async ({ page }) => {
    await page.goto(`/org/${ORG_ID}/agents`);

    const connectorPage = new ConnectorPage(page);

    await connectorPage.openAgent(AGENT_NAME);
    await connectorPage.openConnectorsTab();

    await connectorPage.addTool();
    await connectorPage.clickAddNewTools();

    await connectorPage.expectViaSocketVisible();
  }
);
