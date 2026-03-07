import { test } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('History - Chatbot Agent Version Compare', () => {
  test('TC-HISTORY-01: Compare UI thread IDs with API IDs for versions 1 and 2', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.header.openHistory();

    const version1Response = await agent.history.selectVersionAndGetHistoryResponse('1');
    await agent.history.verifyHistoryMatchesAPI(version1Response);

    const version2Response = await agent.history.selectVersionAndGetHistoryResponse('2');
    await agent.history.verifyHistoryMatchesAPI(version2Response);
  });
});
