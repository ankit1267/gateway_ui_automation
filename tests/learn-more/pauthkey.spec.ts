import { test } from '../../fixtures/base.fixture';


test('open auth key external link', async ({ sidepanel }) => {

  await sidepanel.gotoPauthKey();

  const kbPage = await sidepanel.openExternalLink();

  await sidepanel.expectExternalLinkVisible(
  kbPage,
  'Auth Key'
);

});