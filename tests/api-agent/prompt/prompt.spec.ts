import { test, expect } from '../../../fixtures/base.fixture';
import { deleteAgentApi, captureAgentIdFromUrl } from '../../../utils/api-cleanup';
import { AgentsPage } from '../../../pages/sidepanel/agents.page';
import { AgentPage } from '../../../pages/agent/agent.page';

/** Step 1 – Navigate to agent list and open the Create Agent modal. */
async function openCreateAgentDialog(agents: AgentsPage): Promise<void> {
  await agents.goto('api');
  await agents.clickCreateNewAgent();
}

/** Step 2 – Submit the modal and navigate to the Prompt tab. */
async function submitAndOpenPrompt(agents: AgentsPage): Promise<AgentPage> {
  const agent = await agents.clickCreateNewAgentSubmit();
  await agent.tabs.openPrompt();
  return agent;
}


test.describe('Prompt tab - API Agent', () => {
  let capturedAuthHeader: string | null = null;

  test.beforeEach(async ({ page }) => {
    capturedAuthHeader = null;
    page.on('request', (req) => {
      const auth = req.headers()['authorization'];
      if (auth) capturedAuthHeader = auth;
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Test 1 (from recorded codegen)
  // Verifies that all three prompt fields (role, goal, instructions) are
  // visible immediately after creating a new agent and opening the Prompt tab.
  // ─────────────────────────────────────────────────────────────────────────
  test('Prompt fields are visible after creating a new agent', async ({ agents, page }) => {
    await openCreateAgentDialog(agents);
    const agent = await submitAndOpenPrompt(agents);
    const agentId = captureAgentIdFromUrl(page);

    // All three prompt fields should be visible (POM methods)
    await agent.prompt.expectRoleVisible();
    await agent.prompt.clickGoal();
    await agent.prompt.expectInstructionsVisible();

    await deleteAgentApi(page, agentId, capturedAuthHeader);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Test 2
  // Verifies that filling the "Goal" (agent purpose) auto-generates
  // a non-empty Instructions field.
  // ─────────────────────────────────────────────────────────────────────────
  test('System prompt auto-generates when agent purpose is entered', async ({ agents, page }) => {
    await openCreateAgentDialog(agents);

    // Fill purpose in the modal before submitting
    await agents.createAgentModal.fillPurpose(
      'You are an intelligent, reliable AI agent designed to assist users efficiently.'
    );
    const agent = await submitAndOpenPrompt(agents);
    const agentId = captureAgentIdFromUrl(page);

    // Instructions should now be non-empty
    const systemPrompt = await agent.prompt.getSystemPromptValue();
    expect(systemPrompt.trim()).not.toBe('');

    await deleteAgentApi(page, agentId, capturedAuthHeader);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Test 3
  // Verifies that when no agent purpose is entered, the prompt fields
  // contain sensible default values.
  // ─────────────────────────────────────────────────────────────────────────
  test('System prompt defaults when no agent purpose is added', async ({ agents, page }) => {
    await openCreateAgentDialog(agents);
    const agent = await submitAndOpenPrompt(agents);
    const agentId = captureAgentIdFromUrl(page);

    // Read default values without filling anything
    const role = await agent.prompt.getRoleValue();
    const goal = await agent.prompt.getGoalValue();
    const instructions = await agent.prompt.getInstructionsValue();

    expect(role).toBe('AI Bot');
    expect(goal).toBe('Respond logically and clearly, maintaining a neutral, automated tone.');
    expect(instructions).toContain('Guidelines:');

    await deleteAgentApi(page, agentId, capturedAuthHeader);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Test 4
  // Verifies that entering junk / nonsense characters in the goal field
  // causes the instructions to reset back to the default value.
  // ─────────────────────────────────────────────────────────────────────────
  test('System prompt resets when junk characters are used', async ({ agents, page }) => {
    await openCreateAgentDialog(agents);

    // Fill modal purpose with junk characters before submitting
    await agents.createAgentModal.fillPurpose('@@@###$$$%%%^^^&&&***((()))');
    const agent = await submitAndOpenPrompt(agents);
    const agentId = captureAgentIdFromUrl(page);

    // System prompt should fall back to the default content
    const systemPrompt = await agent.prompt.getSystemPromptValue();
    expect(systemPrompt).toMatch(/Guidelines:|Act like a chatbot/);

    await deleteAgentApi(page, agentId, capturedAuthHeader);
  });

});
