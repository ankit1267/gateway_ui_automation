import { test, expect } from '@playwright/test';

test.use({
    storageState: 'auth.json',
});

test('System prompt auto-generates when agent purpose is entered', async ({ page }) => {
    // Navigate to org page
    await page.goto('/org');

    // Go to create API agent
    await page.getByText('My space').click();
    await page.getByRole('button', { name: '+ Create New API Agent' }).click();

    

   await page.locator('#default-agent-sidebar').getByRole('textbox', {
        name: 'Agent purpose description',
    }).fill(
        'You are an intelligent, reliable AI agent designed to assist users efficiently and accurately. Your primary function is to provide customer support and answer queries based on the provided API documentation.',
    );

    await page
        .locator('#default-agent-sidebar')
        .getByRole('button', { name: 'Create Agent' })
        .click();

    // System prompt textarea (adjust selector if you have test-id)
    await page.locator('textarea').nth(4).click();
    const systemPromptTextarea = page.locator('textarea').nth(4);
    // Expect system prompt to auto-generate (non-empty)
    await expect(systemPromptTextarea).not.toHaveValue('');

    // Optional: validate partial generated content

});

test('System prompt defaults to initial system prompt when no agent purpose is added', async ({ page }) => {
    // Navigate to org page
    await page.goto('https://app.gtwy.ai/org');

    // Go to create API agent
    await page.getByText('My space').click();
    await page.getByRole('button', { name: '+ Create New API Agent' }).click();

    await page
        .locator('#default-agent-sidebar')
        .getByRole('button', { name: 'Create Agent' })
        .click();

    // System prompt textarea (adjust selector if you have test-id)
    const systemPromptTextarea = page.locator('textarea').nth(4);

    // Capture the initial default system prompt before creating the agent
    const initialDefault = `Role: AI Bot
Objective: Respond logically and clearly, maintaining a neutral, automated tone.
Guidelines:
Identify the task or question first.
Provide brief reasoning before the answer or action.
Keep responses concise and contextually relevant.
Avoid emotion, filler, or self-reference.
Use examples or placeholders only when helpful.`;
    // Create agent without entering a purpose


    // Expect the system prompt after creation to equal the initial default
    await expect(systemPromptTextarea).toHaveValue(initialDefault);
});

test('System prompt has junk and special characters go back to default', async ({ page }) => {
    // Navigate to org page
    await page.goto('https://app.gtwy.ai/org');

    // Go to create API agent
    await page.getByText('My space').click();
    await page.getByRole('button', { name: '+ Create New API Agent' }).click();

    await page.locator('#default-agent-sidebar').getByRole('textbox', {
        name: 'Agent purpose description',
    }).fill(
        '@@@###$$$%%%^^^&&&***((()))___+++===---;;;:::"""<<<>>>???///\\\\|||~~~',
    );

    await page
        .locator('#default-agent-sidebar')
        .getByRole('button', { name: 'Create Agent' })
        .click();

    // System prompt textarea (adjust selector if you have test-id)
    await page.locator('textarea').nth(4).click();
    
    const initialDefault = `Role: AI Bot
Objective: Respond logically and clearly, maintaining a neutral, automated tone.
Guidelines:
Identify the task or question first.
Provide brief reasoning before the answer or action.
Keep responses concise and contextually relevant.
Avoid emotion, filler, or self-reference.
Use examples or placeholders only when helpful.`;
    // Expect system prompt to auto-generate (non-empty)
    const actualValue = await page.locator('textarea').nth(4).inputValue();
    expect([initialDefault, 'Act like a chatbot']).toContain(actualValue);

    // Optional: validate partial generated content

});