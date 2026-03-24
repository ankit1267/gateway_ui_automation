import { test, expect } from '../../fixtures/base.fixture';

const TESTING_AGENT = 'Parental Guidance';

test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
});

// ---------------------------------------------------------------------------
// 1. Modal open, close, save-disabled, close-without-saving
// ---------------------------------------------------------------------------

test('modal open, close, save-disabled, and close-without-saving', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAgentConfig();

    const modal = agent.connectors.variableModal;

    // Open and verify visible
    await modal.waitForVisible();
    await expect(modal.getModal()).toBeVisible();

    // Save button disabled when no changes
    await expect(modal.getSaveButton()).toBeDisabled();

    // Close modal
    await modal.close();

    // Reopen, add parameter, close without saving — changes should be discarded
    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    await modal.addParameter();
    await modal.close();

    // Reopen and verify parameter was NOT persisted
    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    await expect(modal.getParameterNameInput('new0')).not.toBeVisible();

    await modal.close();
});

// ---------------------------------------------------------------------------
// 2. Parameter CRUD: add, verify, add multiple, delete specific
// ---------------------------------------------------------------------------

test('parameter CRUD: add single, add multiple, delete specific', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAgentConfig();

    const modal = agent.connectors.variableModal;

    // Add single parameter and verify
    await modal.addParameter();
    await modal.save();
    await agent.header.expectSavedVisible();

    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    await expect(modal.getParameterNameInput('new0')).toBeVisible();
    await expect(modal.getParameterNameInput('new0')).toHaveValue('new0');

    // Cleanup single
    await modal.deleteParameter('new0');
    await modal.save();
    await agent.header.expectSavedVisible();

    // Add multiple parameters and verify persistence
    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    await modal.addParameter(); // new0
    await modal.addParameter(); // new1
    await modal.save();
    await agent.header.expectSavedVisible();

    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    await expect(modal.getParameterNameInput('new0')).toBeVisible();
    await expect(modal.getParameterNameInput('new1')).toBeVisible();

    // Delete only new0, verify new1 still exists
    await modal.deleteParameter('new0');
    await modal.save();
    await agent.header.expectSavedVisible();

    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    await expect(modal.getParameterNameInput('new0')).not.toBeVisible();
    await expect(modal.getParameterNameInput('new1')).toBeVisible();

    // Cleanup
    await modal.deleteParameter('new1');
    await modal.save();
    await agent.header.expectSavedVisible();
});

// ---------------------------------------------------------------------------
// 3. Parameter type selection (number, boolean, array)
// ---------------------------------------------------------------------------

test('change parameter type to number, boolean, and array', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAgentConfig();

    const modal = agent.connectors.variableModal;

    for (const type of ['number', 'boolean', 'array']) {
        await modal.addParameter();
        await modal.selectType('new0', type);
        await modal.save();
        await agent.header.expectSavedVisible();

        await agent.connectors.clickAgentConfig();
        await modal.waitForVisible();
        await expect(modal.getTypeSelect('new0')).toHaveValue(type);

        // Cleanup before next iteration
        await modal.deleteParameter('new0');
        await modal.save();
        await agent.header.expectSavedVisible();

        if (type !== 'array') {
            await agent.connectors.clickAgentConfig();
            await modal.waitForVisible();
        }
    }
});

// ---------------------------------------------------------------------------
// 4. Required checkbox: set and unset
// ---------------------------------------------------------------------------

test('set and unset required on a parameter', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAgentConfig();

    const modal = agent.connectors.variableModal;

    // Add parameter and set required
    await modal.addParameter();
    await modal.setRequired('new0');
    await modal.save();
    await agent.header.expectSavedVisible();

    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    await expect(modal.getRequiredCheckbox('new0')).toBeChecked();

    // Unset required
    await modal.unsetRequired('new0');
    await modal.save();
    await agent.header.expectSavedVisible();

    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    await expect(modal.getRequiredCheckbox('new0')).not.toBeChecked();

    // Cleanup
    await modal.deleteParameter('new0');
    await modal.save();
    await agent.header.expectSavedVisible();
});




// ---------------------------------------------------------------------------
// 5. Add parameter with all details at once
// ---------------------------------------------------------------------------

test('add parameter with name, type, required, and value path', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAgentConfig();

    const modal = agent.connectors.variableModal;
    await modal.addParameter();
    await modal.fillParameterName('new0');
    await modal.selectType('new0', 'number');
    await modal.setRequired('new0');
    await modal.fillValuePath('new0', 'age');
    await modal.fillParameterDescription('new0', 'User age');
    await modal.save();
    await agent.header.expectSavedVisible();

    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    await expect(modal.getParameterNameInput('new0')).toHaveValue('new0');
    await expect(modal.getTypeSelect('new0')).toHaveValue('number');
    await expect(modal.getRequiredCheckbox('new0')).toBeChecked();
    await expect(modal.getValuePathInput('new0')).toHaveValue('age');
    await expect(modal.getParameterDescriptionTextarea('new0')).toHaveValue('User age');

    // Cleanup
    await modal.deleteParameter('new0');
    await modal.save();
    await agent.header.expectSavedVisible();
});

// ---------------------------------------------------------------------------
// 6. Enum (allowed values)
// ---------------------------------------------------------------------------

test('enable enum and set allowed values on a parameter', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAgentConfig();

    const modal = agent.connectors.variableModal;
    await modal.addParameter();
    await modal.toggleEnum('new0');

    const enumInput = modal.getEnumInput('new0');
    await expect(enumInput).toBeVisible();
    await modal.fillEnum('new0', '["red","green","blue"]');
    await modal.save();
    await agent.header.expectSavedVisible();

    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    await expect(modal.getEnumInput('new0')).toHaveValue('["red","green","blue"]');

    // Cleanup
    await modal.deleteParameter('new0');
    await modal.save();
    await agent.header.expectSavedVisible();
});

// ---------------------------------------------------------------------------
// 7. Object type with child properties
// ---------------------------------------------------------------------------

test('change type to object and add child property', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAgentConfig();

    const modal = agent.connectors.variableModal;
    await modal.addParameter();
    await modal.selectType('new0', 'object');
    await modal.addChildProperty('new0');

    // Child parameter should be visible as new0.new0
    await expect(modal.getParameterNameInput('new0.new0')).toBeVisible();

    await modal.save();
    await agent.header.expectSavedVisible();

    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    await expect(modal.getParameterNameInput('new0.new0')).toBeVisible();

    // Cleanup
    await modal.deleteParameter('new0');
    await modal.save();
    await agent.header.expectSavedVisible();
});

// ---------------------------------------------------------------------------
// 8. Thread ID toggle
// ---------------------------------------------------------------------------

test('toggle thread ID on and verify it persists', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAgentConfig();

    const modal = agent.connectors.variableModal;
    const threadToggle = modal.getThreadIdToggle();

    const wasChecked = await threadToggle.isChecked();
    await modal.toggleThreadId();
    await modal.save();
    await agent.header.expectSavedVisible();

    await agent.connectors.clickAgentConfig();
    await modal.waitForVisible();
    if (wasChecked) {
        await expect(threadToggle).not.toBeChecked();
    } else {
        await expect(threadToggle).toBeChecked();
    }

    // Restore original state
    await modal.toggleThreadId();
    await modal.save();
    await agent.header.expectSavedVisible();
});



// ---------------------------------------------------------------------------
// 9. Simple/Advanced mode toggle and version select
// ---------------------------------------------------------------------------

test('simple/advanced mode toggle and version select', async ({ agents }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAgentConfig();

    const modal = agent.connectors.variableModal;

    // Switch to advanced mode
    await modal.switchToAdvancedMode();
    await expect(modal.getJsonTextarea()).toBeVisible();
    await expect(modal.getAddParameterButton()).not.toBeVisible();

    // Switch back to simple mode
    await modal.switchToSimpleMode();
    await expect(modal.getJsonTextarea()).not.toBeVisible();
    await expect(modal.getAddParameterButton()).toBeVisible();

    // Version select
    const versionSelect = modal.getVersionSelect();
    if (await versionSelect.isVisible()) {
        await expect(versionSelect).toBeEnabled();
    }

    await modal.close();
});
