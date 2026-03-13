import { test } from '../../fixtures/base.fixture';

test('history api vs ui validation', async ({ agents }) => {
  await agents.goto('chatbot');

  const agent = await agents.openAgent("Parental Guidance");

  await agent.header.openHistory();

  const apiResponse = await agent.history.applyDateFilter('2025-11-05T18:30', '2026-03-05T18:30');
  await agent.history.verifyHistoryMatchesAPI(apiResponse);
  await agent.history.clearDateRange();

  
});