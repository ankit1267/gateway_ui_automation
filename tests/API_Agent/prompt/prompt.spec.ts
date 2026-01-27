import { test, expect } from '@playwright/test';
import { ApiAgentCreatePage } from '../../../pages/api_agent/apiAgentCreatePage';


test.use({ storageState: 'auth.json' });

const DEFAULT_SYSTEM_PROMPT = `Role: AI Bot
Objective: Respond logically and clearly, maintaining a neutral, automated tone.
Guidelines:
Identify the task or question first.
Provide brief reasoning before the answer or action.
Keep responses concise and contextually relevant.
Avoid emotion, filler, or self-reference.
Use examples or placeholders only when helpful.`;

test(
  'System prompt auto-generates when agent purpose is entered',
  async ({ page }) => {
    await page.goto('/org');

    const createPage = new ApiAgentCreatePage(page);

    await createPage.openCreateAgent();
    await createPage.createAgentWithPurpose(
      'You are an intelligent, reliable AI agent designed to assist users efficiently.'
    );

    await createPage.expectSystemPromptNotEmpty();
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

    const value = await createPage.getSystemPromptValue();
    expect(value).toBe(DEFAULT_SYSTEM_PROMPT);
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

    const value = await createPage.getSystemPromptValue();
    expect([DEFAULT_SYSTEM_PROMPT, 'Act like a chatbot']).toContain(value);

    await createPage.deleteAgent();
  }
);
