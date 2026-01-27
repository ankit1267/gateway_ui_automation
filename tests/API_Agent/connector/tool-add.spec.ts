import { test } from '@playwright/test';
import { ConnectorPage } from '../../../pages/api_agent/connectorPage';

test.use({ storageState: 'auth.json' });

const ORG_ID = process.env.ORG_ID!;
const AGENT_NAME = process.env.AGENT_NAME!;
const TOOL_NAME = 'SearchMailsonGmail';

test(
  'Tool renders inside embed container after selection',
  async ({ page }) => {
    await page.goto(`/org/${ORG_ID}/agents`);

    const connectorPage = new ConnectorPage(page);

    await connectorPage.openAgent(AGENT_NAME);
    await connectorPage.openConnectorsTab();

    await connectorPage.addTool();
    await connectorPage.selectTool(TOOL_NAME);

    await connectorPage.expectEmbedRendered(TOOL_NAME);
    await connectorPage.removeTool();
  }
);
