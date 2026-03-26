import { test } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;

test.describe('Agent - Published Version', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-PUBLISHED-01: Select published version from navbar and verify read-only banner is visible', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);

    const agent = await agents.openAgent(TESTING_AGENT);

    await agent.header.expectPublishedButtonVisible();
    await agent.header.clickPublishedButton();

    await agent.header.expectPublishedDataBannerVisible();
  });

  test('TC-PUBLISHED-02: Publish and Revert buttons are not visible in published version', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);

    const agent = await agents.openAgent(TESTING_AGENT);

    await agent.header.clickPublishedButton();

    await agent.header.expectPublishButtonNotVisible();
    await agent.header.expectRevertButtonNotVisible();
  });

  test('TC-PUBLISHED-03: Prompt fields are disabled in published version', async ({ agents }) => {
    await agents.assertAgentVisible(TESTING_AGENT);

    const agent = await agents.openAgent(TESTING_AGENT);

    await agent.header.clickPublishedButton();

    await agent.tabs.openPrompt();

    await agent.prompt.expectPromptFieldsDisabled();
  });

});
