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

  test('TC-ADMIN-39: Verify all fields are visible in Add New Model modal', async ({ sidepanel }) => {
    await sidepanel.addNewModelPage.clickAddNewModel();

    // Modal container
    await expect(sidepanel.page.locator('#add-new-model-modal-container')).toBeVisible();

    // Header elements
    await expect(sidepanel.page.getByRole('heading', { name: 'Add a New Model' })).toBeVisible();
    await expect(sidepanel.page.getByText('Add and configure a new model for your agent in just a few steps.')).toBeVisible();
    await expect(sidepanel.page.getByTestId('add-model-header-close-button')).toBeVisible();

    // Model Details section
    await expect(sidepanel.page.getByRole('heading', { name: 'Model Details' })).toBeVisible();
    await expect(sidepanel.page.getByTestId('add-model-service-select')).toBeVisible();
    await expect(sidepanel.page.getByTestId('add-model-name-input')).toBeVisible();
    await expect(sidepanel.page.getByTestId('add-model-display-name-input')).toBeVisible();

    // Model Capabilities section
    await expect(sidepanel.page.getByRole('heading', { name: 'Model Capabilities' })).toBeVisible();
    await expect(sidepanel.page.getByText('Enable/disable the features this model supports.')).toBeVisible();
    await expect(sidepanel.page.getByTestId('add-model-vision-checkbox')).toBeVisible();
    await expect(sidepanel.page.getByText('Supports Vision')).toBeVisible();
    await expect(sidepanel.page.getByTestId('add-model-tools-checkbox')).toBeVisible();
    await expect(sidepanel.page.getByText('Supports Tools')).toBeVisible();
    await expect(sidepanel.page.getByTestId('add-model-system-prompt-checkbox')).toBeVisible();
    await expect(sidepanel.page.getByText('Support System Prompt')).toBeVisible();
    await expect(sidepanel.page.getByTestId('add-model-type-select')).toBeVisible();
    await expect(sidepanel.page.getByText('Model Type')).toBeVisible();

    // Reference Specification section
    await expect(sidepanel.page.getByRole('heading', { name: 'Reference Specification' })).toBeVisible();
    await expect(sidepanel.page.getByTestId('add-model-input-cost-input')).toBeVisible();
    await expect(sidepanel.page.getByTestId('add-model-output-cost-input')).toBeVisible();
    await expect(sidepanel.page.locator('#add-model-description-textarea')).toBeVisible();
    await expect(sidepanel.page.locator('#add-model-knowledge-cutoff-input')).toBeVisible();
    await expect(sidepanel.page.locator('#add-model-usecase-textarea')).toBeVisible();

    // Model Parameters section
    await expect(sidepanel.page.getByRole('heading', { name: 'Model Parameters' })).toBeVisible();
    await expect(sidepanel.page.getByText('(advanced tuning)')).toBeVisible();
    await expect(sidepanel.page.locator('#add-model-add-param-button')).toBeVisible();

    // Pre-defined parameters
    await expect(sidepanel.page.getByText('Max Tokens')).toBeVisible();
    await expect(sidepanel.page.getByText('Sets the maximum number of tokens (words or characters) the model can generate in a single response.')).toBeVisible();
    await expect(sidepanel.page.getByText('Enabled Tools')).toBeVisible();
    await expect(sidepanel.page.getByText('List of special tools (e.g. code interpreter, web search) the model is allowed to use during generation.')).toBeVisible();
    await expect(sidepanel.page.getByText('Tool Usage Preference')).toBeVisible();
    await expect(sidepanel.page.getByText('Defines whether tools should be used automatically (`auto`), not at all (`none`), or must be used (`required`).')).toBeVisible();
    await expect(sidepanel.page.getByText('Response Format')).toBeVisible();
    await expect(sidepanel.page.getByText('Sets the structure of the model\'s output: plain text, JSON object, or JSON schema.')).toBeVisible();
    await expect(sidepanel.page.getByText('Parallel Tool Calls')).toBeVisible();
    await expect(sidepanel.page.getByText('Allows the model to call multiple tools at the same time when necessary. Speeds up multi-tool responses.')).toBeVisible();
    await expect(sidepanel.page.getByText('reasoning')).toBeVisible();
    await expect(sidepanel.page.getByText('stream')).toBeVisible();
    await expect(sidepanel.page.getByText('service tier')).toBeVisible();

    // Footer buttons
    await expect(sidepanel.page.getByTestId('add-model-reset-button')).toBeVisible();
    await expect(sidepanel.page.locator('#add-model-save-button')).toBeVisible();
  });

});
