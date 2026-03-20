import { test } from '../../fixtures/base.fixture';


test('open knowledge base external link', async ({ sidepanel }) => {

  await sidepanel.gotoKnowledgeBase();

  const kbPage = await sidepanel.openExternalLink();

  await sidepanel.expectExternalLinkVisible(
  kbPage,
  'Knowledge Base'
);

});

test('open auth key external link', async ({ sidepanel }) => {

  await sidepanel.gotoPauthKey();

  const kbPage = await sidepanel.openExternalLink();

  await sidepanel.expectExternalLinkVisible(
  kbPage,
  'Auth Key'
);

});

test('open widgets external link', async ({ sidepanel }) => {

  await sidepanel.gotoWidgets();

  const kbPage = await sidepanel.openExternalLink();

  await sidepanel.expectExternalLinkVisible(
  kbPage,
  'Widget UI Documentation'
);

});

test('open api key external link', async ({ sidepanel }) => {

  await sidepanel.gotoApiKeys();

  const kbPage = await sidepanel.openExternalLink();

  await sidepanel.expectExternalLinkVisible(
  kbPage,
  'Service API Key'
);

});

test('open rag embed external link', async ({ sidepanel }) => {

  await sidepanel.gotoRAGEmbed();

  const kbPage = await sidepanel.openExternalLink();

  await sidepanel.expectExternalLinkVisible(
  kbPage,
  'RAG Embed'
);

});

test('open integration external link', async ({ sidepanel }) => {

  await sidepanel.gotoIntegration();

  const kbPage = await sidepanel.openExternalLink();

  await sidepanel.expectExternalLinkVisible(
  kbPage,
  'GTWY Embed Integration Guide'
);

});

test('open auth route external link', async ({ sidepanel }) => {

  await sidepanel.gotoAuthRoute();

  const kbPage = await sidepanel.openExternalLink();

  await sidepanel.expectExternalLinkVisible(
  kbPage,
  'OAuth 2.0'
);

});

test('open agents external link', async ({ sidepanel }) => {

  await sidepanel.gotoAgents();

  const kbPage = await sidepanel.openExternalLink();

  await sidepanel.expectExternalLinkVisible(
  kbPage,
  'Agents'
);

});
