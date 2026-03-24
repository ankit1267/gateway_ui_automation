import { test } from '../../../fixtures/base.fixture';

const AGENT_NAME = 'Model Stop Testing';

test.describe.serial('Model - Stop parameter', () => {

  test('TC-MODEL-09: Fill stop parameter and verify set default resets it', async ({ agents }) => {
    await agents.goto('api');

    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();

    await agent.model.expectParameterVisible('stop');

    await agent.model.fillAdvancedParameterText('stop', 'you');

    await agent.model.clickAdvancedParameterResetBtn('stop');
  });

});
