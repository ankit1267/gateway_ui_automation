import { expect, test } from '../../../fixtures/base.fixture';

// test('migrate modal validation', async ({ agents }) => {

//   await agents.goto('chatbot');

//   // Open old agent
//   const oldAgent = await agents.openAgent('for testing the old agent');

//   await oldAgent.prompt.openMigrateModal();
//   await oldAgent.prompt.expectMigrateModalFieldsVisible();

// });

//we will comment out this because our new ui doesn't have migrate button and if any agent has that migrate button so after migration it will automatically changed to new ui so these test will fail when ui is changed it only supports for old ui