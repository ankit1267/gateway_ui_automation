import { test } from '@playwright/test';
import { ConnectorPage } from '../../../pages/api_agent/connectorPage';

test.use({ storageState: 'auth.json' });

const ORG_NAME = process.env.WORKSPACE_NAME;
const AGENT_NAME = 'Testing Agent';
const A2A_AGENT = process.env.AGENT_NAME!;

test.beforeEach(async ({ page }) => {
    await page.goto('/org');
    await page.getByText(`${ORG_NAME}`).click();
})

test(
  'Agent renders inside embed container after selection',
  async ({ page }) => {

    const connectorPage = new ConnectorPage(page);

    await connectorPage.openAgent(AGENT_NAME);
    await connectorPage.openConnectorsTab();

    await connectorPage.addConnectedAgent();
    await connectorPage.selectAgent(A2A_AGENT);

    await connectorPage.expectAgentContainer(A2A_AGENT);
    await connectorPage.removeAgent();
  }
);
