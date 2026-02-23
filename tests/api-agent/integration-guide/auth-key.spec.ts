import { expect, test } from '../../../fixtures/base.fixture';
import { AuthKeyPage } from '../../../pages/sidepanel/auth-key.page';


const AGENT_NAME = process.env.AGENT_NAME || 'Testing Agent';

test('@regression Integration Guide → Create Auth Key navigates correctly in api key tab', async ({ agents, context }) => {

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

test('@regression Integration Guide → Create Auth Key navigates correctlyin batch api tab', async ({ agents, context }) => {

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
