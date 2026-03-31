import { expect, test } from '../../../fixtures/base.fixture';
import { AuthKeyPage } from '../../../pages/sidepanel/auth-key.page';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Integration Guide - API Agent', () => {

  test('TC-IG-01: API tab - every copy button should work', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openIntegrationGuide();
    await agent.integrationGuide.expectPageVisible();

    // Copy curl snippet and verify
    await agent.integrationGuide.copyCurlCodeBlock();
    await agent.integrationGuide.expectApiSnippetCopied('curl');

    // Copy response code block and verify
    await agent.integrationGuide.copyResponseCodeBlock();
    await agent.integrationGuide.expectApiResponseCopied();
  });

  test('TC-IG-02: Batch API tab - every copy button should work', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openIntegrationGuide();
    await agent.integrationGuide.expectPageVisible();

    await agent.integrationGuide.clickBatchTab();

    // Copy batch curl and verify
    await agent.integrationGuide.copyBatchCurlCodeBlock();
    await agent.integrationGuide.expectBatchCurlCopied();

    // Copy batch response and verify
    await agent.integrationGuide.copyBatchResponseCodeBlock();
    await agent.integrationGuide.expectBatchResponseCopied();
  });

  test('TC-IG-03: clicking create auth key redirects to auth key page', async ({ agents, context }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openIntegrationGuide();
    await agent.integrationGuide.expectPageVisible();

    // API tab auth key link
    const [newTab] = await Promise.all([
      context.waitForEvent('page'),
      agent.integrationGuide.clickCreateApiAuthKey(),
    ]);
    await newTab.waitForLoadState();

    const authKeyPage = new AuthKeyPage(newTab);
    await authKeyPage.expectPageVisible();
    await newTab.close();

    // Batch tab auth key link
    await agent.integrationGuide.clickBatchTab();
    const [batchTab] = await Promise.all([
      context.waitForEvent('page'),
      agent.integrationGuide.clickCreateBatchAuthKey(),
    ]);
    await batchTab.waitForLoadState();

    const batchAuthKeyPage = new AuthKeyPage(batchTab);
    await batchAuthKeyPage.expectPageVisible();
  });

  test('TC-IG-04: step 2 language dropdown shows curl, js, java, go', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openIntegrationGuide();
    await agent.integrationGuide.expectPageVisible();

    await agent.integrationGuide.expectLanguageDropdownVisible();

    // Default is curl
    await agent.integrationGuide.expectApiSnippetVisible('curl');

    // Switch to JavaScript
    await agent.integrationGuide.selectLanguage('javascript');
    await agent.integrationGuide.expectApiSnippetVisible('javascript');

    // Switch to Java
    await agent.integrationGuide.selectLanguage('java');
    await agent.integrationGuide.expectApiSnippetVisible('java');

    // Switch to Go
    await agent.integrationGuide.selectLanguage('go');
    await agent.integrationGuide.expectApiSnippetVisible('go');
  });

  test('TC-IG-05: API tab - steps should not be empty', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openIntegrationGuide();
    await agent.integrationGuide.expectPageVisible();

    await agent.integrationGuide.expectApiStep1HasText();
    await agent.integrationGuide.expectApiStep2HasText();
    await agent.integrationGuide.expectApiResponseSectionHasText();
  });

  test('TC-IG-06: Batch API tab - steps should not be empty', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.tabs.openIntegrationGuide();
    await agent.integrationGuide.expectPageVisible();

    await agent.integrationGuide.clickBatchTab();

    await agent.integrationGuide.expectBatchStep1HasText();
    await agent.integrationGuide.expectBatchStep2HasText();
    await agent.integrationGuide.expectBatchResponseSectionHasText();
  });
});
