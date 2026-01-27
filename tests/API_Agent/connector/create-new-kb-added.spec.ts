import { test, expect } from '@playwright/test';
import { ConnectorPage } from '../../../pages/api_agent/connectorPage';

test.use({ storageState: 'auth.json' });

const ORG_ID = process.env.ORG_ID!;
const AGENT_NAME = process.env.AGENT_NAME!;

test(
  'TC-KB-01: User can create a Knowledge Base and see it listed in Connectors',
  async ({ page }) => {
    // Arrange
    await page.goto(`/org/${ORG_ID}/agents`);
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

    // Cleanup (recommended for CI stability)
    await connectorPage.removeKB();
  }
);
