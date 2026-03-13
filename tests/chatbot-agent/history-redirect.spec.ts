import { test } from '../../fixtures/base.fixture';

const CHATBOT_AGENT = process.env.CHATBOT_AGENT!;

test.describe('Agents - History Button Redirect - Chatbot Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('chatbot');
  });

  test('TC-CB-HISTORY-01: Clicking History button on chatbot row redirects to history page', async ({ agents }) => {
    await agents.assertAgentVisible(CHATBOT_AGENT);

    await agents.clickHistoryButton(CHATBOT_AGENT);

    await agents.expectHistoryPageUrl();
  });

});
