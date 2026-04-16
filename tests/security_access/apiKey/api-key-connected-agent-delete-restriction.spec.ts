import { test, expect } from '../../../fixtures/base.fixture';

const CONNECTED_API_KEY_NAME = 'neww';
const DELETE_BLOCKED_TOAST = 'Cannot delete API key as it is currently in use';

test.describe('API Keys - Delete Restriction', () => {
  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoApiKeys();
  });

  test('TC-APIKEY-08: API key connected to agents cannot be deleted', async ({ sidepanel }) => {
    const row = sidepanel.apiKeysPage.getApiKeyRow(CONNECTED_API_KEY_NAME);
    await expect(row).toBeVisible();

    await sidepanel.apiKeysPage.openConnectedAgentsByApiKeyName(CONNECTED_API_KEY_NAME);
    await sidepanel.apiKeysPage.expectConnectedAgentsModalTitleVisible(CONNECTED_API_KEY_NAME);
    await sidepanel.apiKeysPage.expectConnectedAgentsListVisible();
    await sidepanel.apiKeysPage.expectConnectedAgentCardVisible();

    await sidepanel.apiKeysPage.closeConnectedAgentsModal();

    await sidepanel.apiKeysPage.deleteApiKeyByName(CONNECTED_API_KEY_NAME);

    await sidepanel.apiKeysPage.expectDeleteBlockedToastVisible(DELETE_BLOCKED_TOAST);
    await expect(row).toBeVisible();
  });
});
