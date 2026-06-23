import { test, expect } from '../../../fixtures/base.fixture';
import { fillPromptAndVerifyApi } from '../../../utils/fill-prompt-api';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Prompt - Diff Detailed Compare & Version Management', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  // ── Missing Test Area #14: Prompt Comparison / Diff - Detailed section compare ──
  test('TC-PROMPT-DIFF-01: Diff modal shows Role section differences', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    const role = `Diff role test ${Date.now()}`;
    const goal = `Diff goal test ${Date.now()}`;
    const instruction = `Diff instruction test ${Date.now()}`;

    await fillPromptAndVerifyApi(
      page,
      async () => {
        await agent.prompt.fillPrompt(role, goal, instruction);
        await agent.prompt.clickSaveButton();
      },
      { role, goal, instruction }
    );

    await agent.prompt.clickInstructions();
    await agent.prompt.diffButtonClick();
    await agent.prompt.diffModalVisible();

    // Verify diff modal contains Role section
    await expect(page.getByText('Role', { exact: true }).first()).toBeVisible();

    // Verify published and current values are shown
    await expect(page.locator('.font-mono span').first()).toBeVisible();
  });

  test('TC-PROMPT-DIFF-02: Diff modal shows Goal section differences', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    const role = `Goal diff role ${Date.now()}`;
    const goal = `Goal diff goal ${Date.now()}`;
    const instruction = `Goal diff instruction ${Date.now()}`;

    await fillPromptAndVerifyApi(
      page,
      async () => {
        await agent.prompt.fillPrompt(role, goal, instruction);
        await agent.prompt.clickSaveButton();
      },
      { role, goal, instruction }
    );

    await agent.prompt.clickInstructions();
    await agent.prompt.diffButtonClick();
    await agent.prompt.diffModalVisible();

    // Verify Goal section exists in diff
    await expect(page.getByText('Goal', { exact: true }).first()).toBeVisible();
  });

  test('TC-PROMPT-DIFF-03: Diff modal shows Instruction section differences', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    const role = `Inst diff role ${Date.now()}`;
    const goal = `Inst diff goal ${Date.now()}`;
    const instruction = `Inst diff instruction ${Date.now()}`;

    await fillPromptAndVerifyApi(
      page,
      async () => {
        await agent.prompt.fillPrompt(role, goal, instruction);
        await agent.prompt.clickSaveButton();
      },
      { role, goal, instruction }
    );

    await agent.prompt.clickInstructions();
    await agent.prompt.diffButtonClick();
    await agent.prompt.diffModalVisible();

    // Verify Instruction section exists in diff
    await expect(page.getByText('Instruction', { exact: true }).first()).toBeVisible();
  });

  test('TC-PROMPT-DIFF-04: Diff button from helper-open header works', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.prompt.fillRole(`Helper diff ${Date.now()}`);
    await agent.prompt.clickSaveButton();

    // Open helper
    await agent.prompt.openPromptHelper();

    // Click diff from helper-open header
    await agent.prompt.clickDiffButtonFromHelperView();
    await agent.prompt.diffModalVisible();
  });

  // ── Missing Test Area #15: Version Management - Delete & switch with prompt changes ──
  test('TC-PROMPT-VER-01: Create version, make prompt changes, switch versions', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Create a new version first
    await agent.header.clickNewButton();
    await agent.header.fillVersionDescription(`test-version-${Date.now()}`);
    await agent.header.createNewVersion();

    await expect(
      page.getByRole('alert').filter({ hasText: 'New version created' })
    ).toBeVisible();

    // Make prompt changes on current version
    const modifiedRole = `Version switch role ${Date.now()}`;
    await agent.prompt.fillRole(modifiedRole);
    await agent.prompt.clickSaveButton();

    // Switch to a different version
    const secondTestId = await agent.header.getSecondVersionButtonTestId();
    const secondVersionId = secondTestId.replace('version-button-', '');
    await agent.header.clickSecondVersionButton();
    await agent.header.waitForVersionInUrl(secondVersionId);

    // Verify URL changed
    const currentVersion = await agent.header.getVersionFromUrl();
    expect(currentVersion).toBe(secondVersionId);
  });

  test('TC-PROMPT-VER-02: Delete a version and verify it is removed', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    // Count versions before deletion
    const countBefore = await agent.header.getVersionButtonCount();

    if (countBefore > 1) {
      // Delete the first version
      await agent.header.deleteFirstVersion();

      // Verify version count decreased
      const countAfter = await agent.header.getVersionButtonCount();
      expect(countAfter).toBeLessThan(countBefore);
    }
  });

  test('TC-PROMPT-VER-03: Version button tooltip shows description on hover', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.tabs.openPrompt();

    // Hover first version button
    await agent.header.hoverFirstVersionButton();
    await agent.header.expectVersionTooltipVisible();
  });

  test('TC-PROMPT-VER-04: Switch to published version shows read-only banner', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);

    await agent.tabs.openPrompt();

    // Click published button if visible
    await agent.header.expectPublishedButtonVisible();
    await agent.header.clickPublishedButton();

    // Verify read-only banner
    await agent.header.expectPublishedDataBannerVisible();
  });
});
