import { test } from '@playwright/test';
import { ConnectorPage } from '../../../pages/api-agent/connector.page';

test.use({ storageState: 'auth.json' });

const ORG_NAME = process.env.WORKSPACE_NAME!;
const AGENT_NAME = process.env.AGENT_NAME!;

test.beforeEach(async ({ page }) => {
  await page.goto('/org');
  await page.getByText(`${ORG_NAME}`).click();
})

test(
  'ViaSocket embed is visible when adding a tool',
  async ({ page }) => {


    const connectorPage = new ConnectorPage(page);

    await connectorPage.openAgent(AGENT_NAME);
    await connectorPage.openConnectorsTab();

    await connectorPage.addTool();
    await connectorPage.clickAddNewTools();

    await connectorPage.expectViaSocketVisible();
  }
);
