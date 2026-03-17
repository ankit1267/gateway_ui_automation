import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
});

test('TC-VER-01: Version cannot be created with empty description', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.clickNewButton();

    page.once('dialog', async dialog => {
        expect(dialog.message()).toMatch(/description/i);
        await dialog.dismiss();
    });

    await agent.header.createNewVersion();
});

test('TC-VER-02: Version can be created with valid description', async ({ agents, page }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.header.clickNewButton();

    await agent.header.fillVersionDescription('version');
    await agent.header.createNewVersion();

    await expect(
        page.getByRole('alert').filter({ hasText: 'New version created' })
    ).toBeVisible();

    await agent.header.deleteFirstVersion();
});
