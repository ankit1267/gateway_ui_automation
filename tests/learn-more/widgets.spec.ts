import { test } from '../../fixtures/base.fixture';


test('open widgets external link', async ({ sidepanel }) => {

  await sidepanel.gotoWidgets();

  const kbPage = await sidepanel.openExternalLink();

  await sidepanel.expectExternalLinkVisible(
  kbPage,
  'Widgets'
);

});