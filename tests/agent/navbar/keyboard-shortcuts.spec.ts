import { test, expect } from '../../../fixtures/base.fixture';

const TESTING_AGENT = process.env.TESTING_AGENT!;

test.describe('Agent - Keyboard Shortcuts', () => {
  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
    await agents.assertAgentVisible(TESTING_AGENT);
  });

  test('TC-SHORTCUT-01: Ctrl+K opens command palette search', async ({ agents, page }) => {
    await agents.openAgent(TESTING_AGENT);

    await page.keyboard.press('Control+k');

    await expect(page.getByTestId('command-palette-modal')).toBeVisible();
    await expect(page.getByTestId('command-palette-search-input')).toBeVisible();
  });

  test('TC-SHORTCUT-02: Ctrl+/ opens keyboard shortcuts modal', async ({ agents, page }) => {
    await agents.openAgent(TESTING_AGENT);

    await page.keyboard.press('Control+/');

    await expect(page.getByTestId('KEYBOARD_SHORTCUTS_MODAL')).toHaveAttribute('open', '');
    await expect(page.getByRole('heading', { name: 'Keyboard Shortcuts' })).toBeVisible();
    await expect(page.getByText('Show keyboard shortcuts')).toBeVisible();
  });

  test('TC-SHORTCUT-03: Esc closes keyboard shortcuts modal', async ({ agents, page }) => {
    await agents.openAgent(TESTING_AGENT);

    await page.keyboard.press('Control+/');
    await expect(page.getByTestId('KEYBOARD_SHORTCUTS_MODAL')).toHaveAttribute('open', '');

    await page.keyboard.press('Escape');

    await expect(page.getByTestId('KEYBOARD_SHORTCUTS_MODAL')).not.toHaveAttribute('open', '');
  });

  test('TC-SHORTCUT-04: Esc closes command palette modal', async ({ agents, page }) => {
    await agents.openAgent(TESTING_AGENT);

    await page.keyboard.press('Control+k');
    await expect(page.getByTestId('command-palette-modal')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByTestId('command-palette-modal')).toBeHidden();
  });

  test('TC-SHORTCUT-05: G then C navigates to Agent Config', async ({ agents, page }) => {
    const agent = await agents.openAgent(TESTING_AGENT);
    await agent.header.openHistory();
    await expect(page).toHaveURL(/\/agents\/history\//);

    await page.getByTestId('navbar-tab-history').click();
    await page.locator('body').click();

    await page.keyboard.press('g');
    await page.keyboard.press('c');

    await expect(page).toHaveURL(/\/agents\/configure\//);
  });

  test('TC-SHORTCUT-06: G then T navigates to Test Cases', async ({ agents, page }) => {
    await agents.openAgent(TESTING_AGENT);

    await page.getByTestId('navbar-tab-configure').click();

    await page.keyboard.press('g');
    await page.keyboard.press('t');

    await expect(page).toHaveURL(/\/agents\/testcase\//);
  });

  test('TC-SHORTCUT-07: G then H navigates to History', async ({ agents, page }) => {
    await agents.openAgent(TESTING_AGENT);

    await page.getByTestId('navbar-tab-configure').click();

    await page.keyboard.press('g');
    await page.keyboard.press('h');

    await expect(page).toHaveURL(/\/agents\/history\//);
  });
});
