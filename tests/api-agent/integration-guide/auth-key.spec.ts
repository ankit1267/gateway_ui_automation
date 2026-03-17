import { expect, test } from '../../../fixtures/base.fixture';
import { AuthKeyPage } from '../../../pages/sidepanel/auth-key.page';


const AGENT_NAME = process.env.AGENT_NAME!;

test('@regression Integration Guide â†’ Create Auth Key navigates correctly in api key tab', async ({ agents, context }) => {

  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openIntegrationGuide();

  // Wait for new tab
  const [newTab] = await Promise.all([
    context.waitForEvent('page'),
    agent.integrationGuide.clickCreateApiAuthKey(),
  ]);

  await newTab.waitForLoadState();

  const authKeyPage = new AuthKeyPage(newTab);

  await authKeyPage.expectPageVisible();
});

test('@regression Integration Guide â†’ Create Auth Key navigates correctly in batch api tab', async ({ agents, context }) => {

  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openIntegrationGuide();
  await agent.integrationGuide.clickBatchTab();
  // Wait for new tab
  const [newTab] = await Promise.all([
    context.waitForEvent('page'),
    agent.integrationGuide.clickCreateBatchAuthKey(),
  ]);

  await newTab.waitForLoadState();

  const authKeyPage = new AuthKeyPage(newTab);

  await authKeyPage.expectPageVisible();
});

test('@regression Integration Guide â†’ Copy buttons work in API and Batch tabs', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openIntegrationGuide();

  await agent.integrationGuide.expectPageVisible();

  // API Guide tab (default)
  await agent.integrationGuide.copyCurlCodeBlock();
  await agent.integrationGuide.copyResponseCodeBlock();

  // Batch API tab
  await agent.integrationGuide.clickBatchTab();

  await agent.integrationGuide.copyBatchCurlCodeBlock();
  await agent.integrationGuide.copyBatchResponseCodeBlock();
});
