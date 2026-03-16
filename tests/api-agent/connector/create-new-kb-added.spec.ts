import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_ID = process.env.TESTING_AGENT_ID!;

test(
  'TC-KB-01: User can create a Knowledge Base and see it listed in Connectors',
  async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgentById(AGENT_ID);
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