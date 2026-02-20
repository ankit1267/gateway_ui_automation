import { test, expect } from '@playwright/test';
import { ConnectorPage } from '../../../pages/api-agent/connector.page';

test.use({ storageState: 'auth.json' });

const ORG_NAME = process.env.WORKSPACE_NAME!;
const AGENT_NAME = process.env.AGENT_NAME!;

test.beforeEach(async ({ page }) => {
  await page.goto('/org');
  await page.getByText(`${ORG_NAME}`).click();
})

test(
  'TC-KB-01: User can create a Knowledge Base and see it listed in Connectors',
  async ({ page }) => {

    const connectorPage = new ConnectorPage(page);

    await connectorPage.openAgent(AGENT_NAME);
    await connectorPage.openConnectorsTab();

    // Act: Add Knowledge Base
    await connectorPage.addKnowledgeBase();
    await page.getByText('Add new Knowledge Base').click();

    await page
      .getByRole('textbox', { name: 'Knowledge Base name' })
      .fill('Wikipedia');

    await page
      .getByRole('textbox', { name: /Brief description/i })
      .fill('Related to gesture based gaming application');

    await page
      .getByRole('textbox', { name: /https:\/\/example\.com\/resource/i })
      .fill('https://en.wikipedia.org/wiki/Gesture_recognition');

    await page.getByRole('button', { name: 'Add Resource' }).click();

    // Assert
    await expect(
      page.locator('#tools-section-container')
    ).toContainText('Wikipedia');


    await connectorPage.removeKB();

  }
);

test.afterEach(async ({ page }) => {
  await page.goto('/org');

  await page.getByText(ORG_NAME).click();
  await page.getByRole('button', { name: 'Knowledge base' }).click();

  const kbRow = page
    .getByRole('row')
    .filter({ hasText: 'Wikipedia' });

  await kbRow.getByRole('cell', { name: 'Test Knowledgebase delete' }).click();
  await page.getByTestId('delete-modal-confirm-button').click();
});
