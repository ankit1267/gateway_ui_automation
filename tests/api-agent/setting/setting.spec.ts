import { test, expect } from '../../../fixtures/base.fixture';



const ORG_NAME = process.env.WORKSPACE_NAME;
const AGENT_NAME = process.env.TESTING_AGENT!;

test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
});

test(
    'TC-SET-01: Switching to Triggers shows ViaSocket embed in Settings',
    async ({ agents }) => {
       const agent = await agents.openAgent(AGENT_NAME);
       await agent.tabs.openSettings();
      

        await agent.settings.checkTriggerRadio();
        await expect(agent.settings.bridgeTypeTrigger).toBeChecked({ timeout: 10_000 });

        await expect(agent.settings.embedHeader).toBeVisible();

        await agent.settings.closeEmbedIfVisible();

        await agent.settings.selectApiRadio();
        await expect(agent.settings.bridgeTypeApi).toBeChecked({ timeout: 10_000 });
    }
);

test(
    'TC-SET-02:Verify that user can select different tone options in Settings.',
    async ({ agents }) => {
       const agent = await agents.openAgent(AGENT_NAME);
       await agent.tabs.openSettings();
      

        await agent.settings.ensureApiMode();

        await agent.settings.selectTone('neutral');
        await agent.settings.selectTone('humorous');
        await agent.settings.selectTone('formal');
    }
);

test(
    'TC-SET-03:Verify response style dropdown accepts valid values.',
    async ({ agents }) => {
       const agent = await agents.openAgent(AGENT_NAME);
       await agent.tabs.openSettings();
      

        await agent.settings.ensureApiMode();

        await agent.settings.selectResponseStyle('analytical');
        await agent.settings.selectResponseStyle('crisp');
        await agent.settings.selectResponseStyle('storytelling');
    }
);

test(
    'TC-SET-04:Verify enabling and disable Guardrails configuration.',
    async ({ agents }) => {
       const agent = await agents.openAgent(AGENT_NAME);
       await agent.tabs.openSettings();
      

        await agent.settings.ensureApiMode();

        await agent.settings.checkGuardrailToggle();
        await expect(agent.settings.addGuardrailBtn).toBeVisible({ timeout: 10_000 });

        await agent.settings.uncheckGuardrailToggle();
        await expect(agent.settings.addGuardrailBtn).toBeHidden({ timeout: 10_000 });
    }
);

test(
    'TC-SET-05:Verify webhook validation when Custom mode is selected.',
    async ({ agents }) => {
       const agent = await agents.openAgent(AGENT_NAME);
       await agent.tabs.openSettings();
      

        await agent.settings.ensureApiMode();

        await agent.settings.selectCustomMode();
        await agent.settings.fillWebhookUrl('');
        await agent.settings.clickHiddenElement();

        await expect(agent.settings.getByText('Please enter a valid webhook')).toBeVisible();

        await agent.settings.selectDefaultMode();
    }
);

test(
    'TC-SET-06:Invalid headers JSON is rejected.',
    async ({ agents }) => {
       const agent = await agents.openAgent(AGENT_NAME);
       await agent.tabs.openSettings();
      

        await agent.settings.ensureApiMode();

        await agent.settings.selectCustomMode();
        await agent.settings.fillHeaders('{invalid}');
        await agent.settings.clickHiddenElement();

        await expect(agent.settings.getByText('Invalid JSON')).toBeVisible();

        await agent.settings.selectDefaultMode();
    }
);

test(
    'TC-SET-07:Agent Settings – Guardrail Configuration.',
    async ({ agents }) => {
       const agent = await agents.openAgent(AGENT_NAME);
       await agent.tabs.openSettings();
      

        await agent.settings.ensureApiMode();

        await agent.settings.checkGuardrailToggle();

        await expect(agent.settings.addGuardrailBtn).toBeEnabled();
        await agent.settings.clickAddGuardrailTypes();

        await expect(agent.settings.promptInjection).toBeVisible();
        await expect(agent.settings.bias).toBeVisible();

        await agent.settings.checkPromptInjection();
        await agent.settings.checkBias();

        await expect(agent.settings.promptInjection).toBeChecked();
        await expect(agent.settings.bias).toBeChecked();

        await agent.settings.uncheckPromptInjection();
        await agent.settings.uncheckBias();

        //Disable guardrails toggle again
        await agent.settings.uncheckGuardrailToggle();
        await expect(agent.settings.guardrailsToggle).not.toBeChecked();
    }
);
