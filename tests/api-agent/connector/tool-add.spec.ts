import { test } from '@playwright/test';
import { ConnectorPage } from '../../../pages/api-agent/connector.page';
import { navigateToAgents } from '../../../utils/navigation';

test.use({ storageState: 'auth.json' });

const ORG_NAME = process.env.WORKSPACE_NAME!;
const AGENT_NAME = process.env.AGENT_NAME!;
const TOOL_NAME = 'SendEmailonGmail2';

test.beforeEach(async ({ page }) => {
  await navigateToAgents(page, 'api');
})

test(
  'Tool renders inside embed container after selection',
  async ({ page }) => {

    const connectorPage = new ConnectorPage(page);

    await connectorPage.openAgent(AGENT_NAME);
    await connectorPage.openConnectorsTab();

    await connectorPage.addTool();
    await connectorPage.selectTool(TOOL_NAME);

    await connectorPage.expectEmbedRendered(TOOL_NAME);
    await connectorPage.removeTool();
  }
);
