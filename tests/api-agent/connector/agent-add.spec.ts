import { test } from '@playwright/test';
import { ConnectorPage } from '../../../pages/connector.page';
import { navigateToAgents } from '../../../utils/navigation';

test.use({ storageState: 'auth.json' });

const ORG_NAME = process.env.WORKSPACE_NAME;
const TESTING_AGENT = process.env.TESTING_AGENT!;
const A2A_AGENT = process.env.AGENT_NAME!;

test.beforeEach(async ({ page }) => {
  await navigateToAgents(page, 'api');
})

test(
  'Agent renders inside embed container after selection',
  async ({ page }) => {

    const connectorPage = new ConnectorPage(page);

    await connectorPage.openAgent(TESTING_AGENT);
    await connectorPage.openConnectorsTab();

    await connectorPage.addConnectedAgent();
    await connectorPage.selectAgent(A2A_AGENT);

    await connectorPage.expectAgentContainer(A2A_AGENT);
    await connectorPage.removeAgent();
  }
);
