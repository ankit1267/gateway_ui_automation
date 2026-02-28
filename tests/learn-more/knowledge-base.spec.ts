import { test } from '../../fixtures/base.fixture';


test('open knowledge base external link', async ({ sidepanel }) => {

  await sidepanel.gotoKnowledgeBase();

  const kbPage = await sidepanel.openExternalLink();

  await sidepanel.expectExternalLinkVisible(
  kbPage,
  'Knowledge Base'
);

});