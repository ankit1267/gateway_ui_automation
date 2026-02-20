import { test, expect } from '@playwright/test';
import { ApiAgentCreatePage } from '../../../pages/api-agent/api-agent-create.page';
import { navigateToAgents } from '../../../utils/navigation';


test.use({ storageState: 'auth.json' });

test(
  'System prompt auto-generates when agent purpose is entered',
  async ({ page }) => {
    await navigateToAgents(page, 'api');

    const createPage = new ApiAgentCreatePage(page);

    await createPage.openCreateAgent();
    await createPage.createAgentWithPurpose(
      'You are an intelligent, reliable AI agent designed to assist users efficiently.'
    );

    await createPage.expectInstructionsNotEmpty();
    const agentName = await page.getByTestId('navbar-agent-name-display').innerText();
    await createPage.deleteAgentByName(agentName);
  }
);

test(
  'System prompt defaults when no agent purpose is added',
  async ({ page }) => {
    await navigateToAgents(page, 'api');

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
    const agentName = await page.getByTestId('navbar-agent-name-display').innerText();
    await createPage.deleteAgentByName(agentName);
  }
);

test(
  'System prompt resets when junk characters are used',
  async ({ page }) => {
    await navigateToAgents(page, 'api');

    const createPage = new ApiAgentCreatePage(page);

    await createPage.openCreateAgent();
    await createPage.createAgentWithPurpose(
      '@@@###$$$%%%^^^&&&***((()))'
    );

    const value = await createPage.getInstructionsValue();
    expect(value).toContain('Guidelines:');

    const agentName = await page.getByTestId('navbar-agent-name-display').innerText();
    await createPage.deleteAgentByName(agentName);

  }
);
