import { test } from '../../fixtures/base.fixture';

const KB_NAME = 'Resume';

test('should show resource chunk modal when KB is clicked', async ({ sidepanel }) => {
    await sidepanel.gotoKnowledgeBase();
    await sidepanel.knowledgeBasePage.clickKbByName(KB_NAME);
    await sidepanel.knowledgeBasePage.expectResourceChunkModalVisible();
});
