import { test, expect } from '../../fixtures/base.fixture';

test.describe('Admin Settings - Add New Model', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoAddNewModel();
    await sidepanel.addNewModelPage.waitForPage();
  });

  test('TC-ADMIN-18: Model Management page title is visible', async ({ sidepanel }) => {
    await expect(sidepanel.addNewModelPage.pageTitle).toBeVisible();
  });

  test('TC-ADMIN-19: Add New Model button is visible', async ({ sidepanel }) => {
    await expect(sidepanel.addNewModelPage.addNewModelButton).toBeVisible();
  });

  test('TC-ADMIN-20: Model table or empty state is displayed', async ({ sidepanel }) => {
    const isEmpty = await sidepanel.addNewModelPage.isEmptyState();
    if (isEmpty) {
      await expect(sidepanel.addNewModelPage.emptyState).toBeVisible();
    } else {
      const rowCount = await sidepanel.addNewModelPage.getTableRowCount();
      expect(rowCount).toBeGreaterThan(0);
    }
  });

  test('TC-ADMIN-35: Clicking Add New Model button opens model form modal', async ({ sidepanel }) => {
    await sidepanel.addNewModelPage.clickAddNewModel();
    await expect(sidepanel.page.locator('#add-new-model-modal-container')).toBeVisible();
    await expect(sidepanel.page.getByRole('heading', { name: 'Add a New Model' })).toBeVisible();
    await expect(sidepanel.page.getByRole('heading', { name: 'Model Details' })).toBeVisible();
  });

  test('TC-ADMIN-36: Add New Model modal can be closed', async ({ sidepanel }) => {
    await sidepanel.addNewModelPage.clickAddNewModel();
    await expect(sidepanel.page.locator('#add-new-model-modal-container')).toBeVisible();

    await sidepanel.page.getByTestId('add-model-header-close-button').dispatchEvent('click');
    await expect(sidepanel.page.locator('#ADD_NEW_MODEL_MODAL')).not.toHaveAttribute('open', { timeout: 5000 });
  });

  test('TC-ADMIN-37: Add New Model modal Reset button is functional', async ({ sidepanel }) => {
    await sidepanel.addNewModelPage.clickAddNewModel();
    await expect(sidepanel.page.locator('#add-new-model-modal-container')).toBeVisible();

    await expect(sidepanel.page.getByTestId('add-model-reset-button')).toBeVisible();
    await sidepanel.page.getByTestId('add-model-reset-button').click();
  });

  test('TC-ADMIN-38: Add New Model modal Save button is present', async ({ sidepanel }) => {
    await sidepanel.addNewModelPage.clickAddNewModel();
    await expect(sidepanel.page.locator('#add-model-save-button')).toBeVisible();
  });

});
