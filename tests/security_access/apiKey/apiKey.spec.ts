import { test, expect } from '../../../fixtures/base.fixture';

const API_KEY_NAME = 'test_api_key';
const API_KEY_VALUE = process.env.TEST_API_KEY_VALUE!;
const API_KEY_UPDATED_NAME = process.env.TEST_API_KEY_UPDATED_NAME || 'test_api_key_updated';
const API_KEY_COMMENT = 'Test API key for automation';
const API_KEY_LIMIT = '1000';
const API_KEY_SERVICE = 'Gemini';
const API_KEY_RESET_PERIOD = 'Monthly';

test.describe('API Keys - CRUD Operations', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoApiKeys();
  });

  test.afterEach(async ({ sidepanel }) => {
    try {
      await sidepanel.apiKeysPage.deleteApiKeyByName(API_KEY_NAME);
    } catch (error) {
      // Ignore if key doesn't exist
    }
    try {
      await sidepanel.apiKeysPage.deleteApiKeyByName(API_KEY_UPDATED_NAME);
    } catch (error) {
      // Ignore if key doesn't exist
    }
  });

  test('TC-APIKEY-01: Create new API key with name, value, comment, limit, period and service', async ({ sidepanel }) => {
    await sidepanel.apiKeysPage.createApiKey(API_KEY_NAME, API_KEY_VALUE, API_KEY_SERVICE, API_KEY_COMMENT, API_KEY_LIMIT, API_KEY_RESET_PERIOD);
    
    const row = sidepanel.apiKeysPage.getApiKeyRow(API_KEY_NAME);
    await expect(row).toBeVisible();
  });


  test('TC-APIKEY-02: Update API key name', async ({ sidepanel }) => {
    await sidepanel.apiKeysPage.createApiKey(API_KEY_NAME, API_KEY_VALUE, API_KEY_SERVICE);
    
    await sidepanel.apiKeysPage.updateApiKeyByName(API_KEY_NAME);
    await sidepanel.apiKeysPage.clearApiKeyName();
    await sidepanel.apiKeysPage.fillApiKeyName(API_KEY_UPDATED_NAME);
    await sidepanel.apiKeysPage.clickAddApiKey();
    
    const updatedRow = sidepanel.apiKeysPage.getApiKeyRow(API_KEY_UPDATED_NAME);
    await expect(updatedRow).toBeVisible();
  });

  test('TC-APIKEY-03: Update API key comment', async ({ sidepanel }) => {
    const updatedComment = 'Updated comment for testing';
    await sidepanel.apiKeysPage.createApiKey(API_KEY_NAME, API_KEY_VALUE, API_KEY_SERVICE, API_KEY_COMMENT);
    
    await sidepanel.apiKeysPage.updateApiKeyByName(API_KEY_NAME);
    await sidepanel.apiKeysPage.clearApiKeyComment();
    await sidepanel.apiKeysPage.fillApiKeyComment(updatedComment);
    await sidepanel.apiKeysPage.clickAddApiKey();
    
    const row = sidepanel.apiKeysPage.getApiKeyRow(API_KEY_NAME);
    await expect(row).toBeVisible();
  });

  test('TC-APIKEY-04: Update API key limit', async ({ sidepanel }) => {
    const updatedLimit = '5000';
    await sidepanel.apiKeysPage.createApiKey(API_KEY_NAME, API_KEY_VALUE, API_KEY_SERVICE, API_KEY_COMMENT, API_KEY_LIMIT, API_KEY_RESET_PERIOD);
    
    await sidepanel.apiKeysPage.updateApiKeyByName(API_KEY_NAME);
    await sidepanel.apiKeysPage.clearApiKeyLimit();
    await sidepanel.apiKeysPage.fillApiKeyLimit(updatedLimit);
    await sidepanel.apiKeysPage.clickAddApiKey();
    
    const row = sidepanel.apiKeysPage.getApiKeyRow(API_KEY_NAME);
    await expect(row).toBeVisible();
  });

  test('TC-APIKEY-06: Delete API key', async ({ sidepanel }) => {
    await sidepanel.apiKeysPage.createApiKey(API_KEY_NAME, API_KEY_VALUE, API_KEY_SERVICE);
    
    const row = sidepanel.apiKeysPage.getApiKeyRow(API_KEY_NAME);
    await expect(row).toBeVisible();
    
    await sidepanel.apiKeysPage.deleteApiKeyByName(API_KEY_NAME);
    
    await expect(row).not.toBeVisible();
  });

  test('TC-APIKEY-07: Modal - fill name, apikey, comment and cancel', async ({ sidepanel }) => {
    await sidepanel.apiKeysPage.addNewApiKey();

    await sidepanel.apiKeysPage.fillApiKeyName(API_KEY_NAME);
    await sidepanel.apiKeysPage.fillApiKey(API_KEY_VALUE);
    await sidepanel.apiKeysPage.fillApiKeyComment(API_KEY_COMMENT);
    await sidepanel.apiKeysPage.cancelApiKey();
    
    const row = sidepanel.apiKeysPage.getApiKeyRow(API_KEY_NAME);
    await expect(row).not.toBeVisible();
  });

});
