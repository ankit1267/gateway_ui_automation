import { test, expect } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;

test(
  'TC-KB-01: User can create a Knowledge Base and see it listed in Connectors',
  async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.tabs.openConnectors();
    await agent.connectors.clickAddKB();
    await agent.connectors.knowledgeBaseDropdown.addNewKnowledgeBase();
    const modal = agent.connectors.knowledgeBaseModal;
    await modal.createKB(
      'Wikipedia',
      'Related to gesture based gaming application',
      'https://en.wikipedia.org/wiki/Gesture_recognition'
    );

    await agent.connectors.expectKBVisible('Wikipedia');
    await agent.connectors.removeKB();
  }
);

test.afterEach(async ({ agents }) => {

  await agents.goto('api');
  await agents.sidebar.openKnowledgeBase();
  await agents.knowledgeBasePage.deleteKnowledgeBaseByName('Wikipedia');

});