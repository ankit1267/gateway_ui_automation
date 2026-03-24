import { test } from '../../../fixtures/base.fixture';

const AUTH_KEY_NAME = "my auth key";

test.describe('Auth Key - Security & Access', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoPauthKey();
  });

  test('TC-AUTH-01: Validation error shown for name shorter than 3 characters', async ({ sidepanel }) => {
    await sidepanel.authKeyPage.clickCreateNewKey();
    await sidepanel.authKeyPage.clickCreateSubmit();
    await sidepanel.authKeyPage.expectValidationErrorToast();
  });

  test('TC-AUTH-02: Create, copy and delete auth key', async ({ sidepanel }) => {

    // -------- Create --------
    await sidepanel.authKeyPage.clickCreateNewKey();
    await sidepanel.authKeyPage.fillAuthKeyName(AUTH_KEY_NAME);
    await sidepanel.authKeyPage.clickCreateSubmit();
    await sidepanel.authKeyPage.expectCreateSuccessToast();
    await sidepanel.authKeyPage.expectKeyListed(AUTH_KEY_NAME);

    // -------- Copy --------
    await sidepanel.authKeyPage.copyKeyByName(AUTH_KEY_NAME);
    await sidepanel.authKeyPage.expectCopySuccessToast();

    // -------- Delete --------
    await sidepanel.authKeyPage.clickDeleteIconByName(AUTH_KEY_NAME);
    await sidepanel.authKeyPage.deleteModal.confirm();
    await sidepanel.authKeyPage.expectDeleteSuccessToast();
  });

});
