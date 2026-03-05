import { test } from '../../../fixtures/base.fixture';

const API_KEY_NAME = 'test_api_key';
const API_KEY_VALUE = 'AIzaSyCW9iewaNI64Z8RP58oHksojNFl6R96WmA';

test('API Key modal - fill name, apikey, comment and submit', async ({ sidepanel }) => {
    await sidepanel.gotoApiKeys();
    await sidepanel.apiKeysPage.addNewApiKey();

    await sidepanel.apiKeysPage.fillApiKeyName(API_KEY_NAME);
    await sidepanel.apiKeysPage.fillApiKey(API_KEY_VALUE);
    await sidepanel.apiKeysPage.fillApiKeyComment('test key');
    await sidepanel.apiKeysPage.clickAddApiKey();
    await sidepanel.apiKeysPage.deleteApiKeyByName(API_KEY_NAME);
});
