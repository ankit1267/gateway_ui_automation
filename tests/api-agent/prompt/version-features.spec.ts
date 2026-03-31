import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Version Features - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-VER-03: Version changes in URL when switching versions', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();

    const secondTestId = await agent.header.getSecondVersionButtonTestId();
    const secondVersionId = secondTestId.replace('version-button-', '');

    await agent.header.clickSecondVersionButton();
    await agent.header.waitForVersionInUrl(secondVersionId);

    const newVersion = await agent.header.getVersionFromUrl();
    expect(newVersion).toBe(secondVersionId);
  });

  test('TC-VER-04: Version description tooltip shown on hover', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.header.hoverFirstVersionButton();
    await agent.header.expectVersionTooltipVisible();
  });

  test('TC-VER-05: Clicking Published shows read-only banner', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.expectSavedVisible();
    await agent.header.expectPublishedButtonVisible();
    await agent.header.clickPublishedButton();
    await agent.header.expectPublishedDataBannerVisible();
  });

});
