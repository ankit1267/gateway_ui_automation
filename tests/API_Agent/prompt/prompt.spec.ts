import { test, expect } from '@playwright/test';
import { ApiAgentCreatePage } from '../../../pages/api_agent/apiAgentCreatePage';


test.use({ storageState: 'auth.json' });

test(
  'System prompt auto-generates when agent purpose is entered',
  async ({ page }) => {
    await page.goto('/org');

    const createPage = new ApiAgentCreatePage(page);

    await createPage.openCreateAgent();
    await createPage.createAgentWithPurpose(
      'You are an intelligent, reliable AI agent designed to assist users efficiently.'
    );

    await createPage.expectInstructionsNotEmpty();
    await createPage.deleteAgent();
  }
);

test(
  'System prompt defaults when no agent purpose is added',
  async ({ page }) => {
    await page.goto('/org');

    const createPage = new ApiAgentCreatePage(page);

    await createPage.openCreateAgent();
    await createPage.createAgentWithPurpose();

    const role = await createPage.getRoleValue();
    const goal = await createPage.getGoalValue();
    const instructions = await createPage.getInstructionsValue();

    expect(role).toBe('AI Bot');
    expect(goal).toBe(
      'Respond logically and clearly, maintaining a neutral, automated tone.'
    );
    expect(instructions).toContain('Guidelines:');
    await createPage.deleteAgent();
  }
);

test(
  'System prompt resets when junk characters are used',
  async ({ page }) => {
    await page.goto('/org');

    const createPage = new ApiAgentCreatePage(page);

    await createPage.openCreateAgent();
    await createPage.createAgentWithPurpose(
      '@@@###$$$%%%^^^&&&***((()))'
    );

    const value = await createPage.getInstructionsValue();
    expect(['Guidelines:', 'Act like a chatbot']).toContain(value);

    await createPage.deleteAgent();
  }
);
