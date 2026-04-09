import { test } from '../../../fixtures/base.fixture';
import { waitForAgentUpdateApi, verifyAgentUpdateRequest } from '../../../utils/model-api';

const AGENT_NAME = "Model Stop Testing";

test.describe('Model - Stop parameter', () => {

  test('TC-MODEL-09: Fill stop parameter and verify set default resets it', async ({ agents, page }) => {
    await agents.goto('api');

    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openModel();
    
    await agent.model.expectParameterVisible('stop');
    
    // API Verification: Fill stop parameter and verify API request
    const [fillResponse] = await Promise.all([
      waitForAgentUpdateApi(page, { 
        payloadField: 'configuration.stop', 
        payloadValue: 'you' 
      }),
      (async () => {
        await agent.model.fillAdvancedParameterText('stop', 'you');
        await agent.model.clickOutsideToSave();
      })()
    ]);
    
    await verifyAgentUpdateRequest(fillResponse, {
      'configuration.stop': 'you'
    });

    // API Verification: Reset stop parameter and verify API request
    const [resetResponse] = await Promise.all([
      waitForAgentUpdateApi(page),
      agent.model.clickAdvancedParameterResetBtn('stop')
    ]);
    
    await verifyAgentUpdateRequest(resetResponse, {
      'configuration.stop': 'default'
    });
    
    await agent.header.expectSavedVisible();
  });

});
