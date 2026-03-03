import { test, expect } from '../../fixtures/base.fixture';

const KB_NAME = 'Resume';

test('should return results when querying a knowledge base', async ({ sidepanel }) => {
    await sidepanel.gotoKnowledgeBase();
    await sidepanel.knowledgeBasePage.queryKbByName(KB_NAME);

    await sidepanel.knowledgeBasePage.fillQueryKbTextarea('What is the candidate experience?');
    await sidepanel.knowledgeBasePage.clickQuerySubmit();

    await sidepanel.knowledgeBasePage.expectQueryResultsVisible();
});
