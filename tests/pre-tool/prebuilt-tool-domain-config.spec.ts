import { test } from '../../fixtures/base.fixture';

const AGENT_ID = process.env.AGENT_ID!;
const TOOL_NAME = 'Gtwy web search';
const TOOL_KEY = 'Gtwy_Web_Search';
const DOMAIN = 'dev.gtwy.ai';

test.describe('Tool - Prebuilt Tool Domain Config', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-TOOL-01: Add domain, edit with invalid then valid value, and delete', async ({ agents }) => {
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.selectTool(TOOL_NAME);
    await agent.connectors.clickPrebuiltToolConfig(TOOL_KEY);

    await agent.connectors.prebuiltToolsConfigModal.addDomain(DOMAIN);
    await agent.connectors.prebuiltToolsConfigModal.expectDomainItemVisible(0);

    // invalid edit — no TLD
    await agent.connectors.prebuiltToolsConfigModal.clickEditDomain(0);
    await agent.connectors.prebuiltToolsConfigModal.getEditInput(0).fill('invalidomain');
    await agent.connectors.prebuiltToolsConfigModal.clickSaveEdit(0);
    await agent.connectors.prebuiltToolsConfigModal.expectEditInvalidDomainError(0);
    await agent.connectors.prebuiltToolsConfigModal.clickCancelEdit(0);

    // valid edit
    await agent.connectors.prebuiltToolsConfigModal.editDomain(0, 'jwt.io');
    await agent.connectors.prebuiltToolsConfigModal.expectDomainItemVisible(0);

    await agent.connectors.prebuiltToolsConfigModal.clickDeleteDomain(0);
    await agent.connectors.prebuiltToolsConfigModal.close();
  });

  test('TC-TOOL-02: Domain format validation — full URL rejected, no TLD rejected, www prefix accepted, duplicate rejected', async ({ agents }) => {
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAddTool();
    await agent.connectors.toolDropdown.selectTool(TOOL_NAME);
    await agent.connectors.clickPrebuiltToolConfig(TOOL_KEY);

    // full URL format is rejected
    await agent.connectors.prebuiltToolsConfigModal.addDomain('https://www.jwt.io/');
    await agent.connectors.prebuiltToolsConfigModal.expectDomainItemNotVisible(0);

    // no TLD is rejected
    await agent.connectors.prebuiltToolsConfigModal.addDomain('devgtwyai');
    await agent.connectors.prebuiltToolsConfigModal.expectInvalidDomainError();
    await agent.connectors.prebuiltToolsConfigModal.expectDomainItemNotVisible(0);

    // www prefix is accepted
    await agent.connectors.prebuiltToolsConfigModal.addDomain('www.jwt.io');
    await agent.connectors.prebuiltToolsConfigModal.expectDomainItemVisible(0);
    await agent.connectors.prebuiltToolsConfigModal.clickDeleteDomain(0);

    // duplicate domain is rejected
    await agent.connectors.prebuiltToolsConfigModal.addDomain(DOMAIN);
    await agent.connectors.prebuiltToolsConfigModal.addDomain(DOMAIN);
    await agent.connectors.prebuiltToolsConfigModal.expectDomainAlreadyExistsError();
    await agent.connectors.prebuiltToolsConfigModal.clickDeleteDomain(0);

    await agent.connectors.prebuiltToolsConfigModal.close();
  });

  test.afterEach(async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgentById(AGENT_ID);
    await agent.tabs.openConnectors();
    await agent.connectors.deletePrebuiltToolIfExists(TOOL_KEY);
  });

});
