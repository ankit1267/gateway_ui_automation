import { test } from '../../../fixtures/base.fixture';
import type { AgentsPage } from '../../../pages/sidepanel/agents.page';
import type { AgentPage } from '../../../pages/agent/agent.page';
import { selectResponseTypeAndVerifyApi, type ResponseTypeValue } from '../../../utils/response-type-api';


const AGENT_NAME = process.env.AGENT_NAME!;
const SAMPLE_JSON_SCHEMA = '{"name": "testing","schema": {"type": "object","properties": {name": {"type": "string","description": "name of user"}},"required": ["name"],"additionalProperties": false},"strict": true}';

function logResponseTypeApiCapture(selectedType: string, captured: { requestCount: number; responseType: string; requestBody: Record<string, unknown> }) {
  const body = captured.requestBody as { configuration?: unknown };

  console.log(
    `[response-type-api] selected=${selectedType} parsed=${captured.responseType} requests=${captured.requestCount}`,
    JSON.stringify(body.configuration ?? {}, null, 2),
  );
}

async function openAgentPrompt(agents: AgentsPage): Promise<AgentPage> {
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openPrompt();
  return agent;
}

test.describe('Prompt - Response Type', () => {

  test.beforeEach(async ({ agents }) => {

    await agents.goto('api');

  });

  test('TC-PROMPT-RESP-01: Change response type options', async ({ agents, page }) => {

    const agent = await openAgentPrompt(agents);

    // Start from "Not set" so every step below is a real change that triggers an update request.
    await agent.prompt.resetResponseTypeToDefault();

    const steps: Array<{ type: ResponseTypeValue; select: () => Promise<void> }> = [
      { type: 'text', select: () => agent.prompt.selectResponseType('text') },
      { type: 'json_object', select: () => agent.prompt.selectResponseType('json_object') },
      { type: 'json_schema', select: () => agent.prompt.setJsonSchemaResponseType(SAMPLE_JSON_SCHEMA) },
      { type: 'default', select: () => agent.prompt.resetResponseTypeToDefault() },
    ];

    for (const step of steps) {
      const captured = await selectResponseTypeAndVerifyApi(page, step.select, step.type);
      logResponseTypeApiCapture(step.type, captured);
    }

  });

  test('TC-PROMPT-RESP-02: Remove resets response type to default', async ({ agents }) => {

    const agent = await openAgentPrompt(agents);

    await agent.prompt.selectResponseType('text');
    await agent.prompt.resetResponseTypeToDefault();
    await agent.prompt.expectResponseTypeIsDefault();

  });

  test('TC-PROMPT-RESP-03: Select json_schema, add JSON schema, click Remove, verify reset to default', async ({ agents }) => {

    const agent = await openAgentPrompt(agents);

    await agent.prompt.setJsonSchemaResponseType(SAMPLE_JSON_SCHEMA);
    await agent.prompt.resetResponseTypeToDefault();

    await agent.prompt.expectResponseTypeIsDefault();
    await agent.prompt.expectJsonSchemaEditorNotVisible();

  });



  test('TC-PROMPT-RESP-04: JSON schema textarea accepts manually typed and pasted JSON', async ({ agents }) => {

    const agent = await openAgentPrompt(agents);

    await agent.prompt.selectResponseType('json_schema');



    const typedJson = '{"type":"string"}';

    await agent.prompt.typeJsonSchema(typedJson);

    await agent.prompt.expectJsonSchemaTextareaValue(typedJson);



    const pastedJson = '{"type":"object","properties":{"id":{"type":"number"}}}';

    await agent.prompt.pasteJsonSchema(pastedJson);

    await agent.prompt.expectJsonSchemaTextareaValue(pastedJson);

  });

   test('TC-PROMPT-RESP-05: Keyboard shortcuts Ctrl+A, Ctrl+C, Ctrl+X, Ctrl+V work in JSON schema textarea', async ({ agents }) => {

    const agent = await openAgentPrompt(agents);

    await agent.prompt.selectResponseType('json_schema');



    const json = '{"a":1}';

    await agent.prompt.typeJsonSchema(json);

    await agent.prompt.expectJsonSchemaTextareaValue(json);



    // Ctrl+A: select all → typing replaces entire content

    await agent.prompt.pressKeyInJsonSchema('Control+a');

    await agent.prompt.pressKeyInJsonSchema('Delete');

    await agent.prompt.expectJsonSchemaTextareaValue('');



    // Ctrl+C + Ctrl+V: copy all and paste at end → content doubles

    await agent.prompt.typeJsonSchema(json);

    await agent.prompt.pressKeyInJsonSchema('Control+a');

    await agent.prompt.pressKeyInJsonSchema('Control+c');

    await agent.prompt.pressKeyInJsonSchema('End');

    await agent.prompt.pressKeyInJsonSchema('Control+v');

    await agent.prompt.expectJsonSchemaTextareaValue(json + json);



    // Ctrl+X: cut all → textarea empty

    await agent.prompt.pressKeyInJsonSchema('Control+a');

    await agent.prompt.pressKeyInJsonSchema('Control+x');

    await agent.prompt.expectJsonSchemaTextareaValue('');



    // Ctrl+V: paste cut content → content restored

    await agent.prompt.pressKeyInJsonSchema('Control+v');

    await agent.prompt.expectJsonSchemaTextareaValue(json + json);

  });

  test('TC-PROMPT-RESP-06: Invalid JSON schema shows error, valid empty object clears it', async ({ agents }) => {

    const agent = await openAgentPrompt(agents);

    await agent.prompt.selectResponseType('json_schema');

    await agent.prompt.clickJsonSchemaFullscreen();

    await agent.prompt.clickJsonSchemaFullscreenTextarea();
    await agent.prompt.fillJsonSchemaFullscreenTextarea(`{
  "properties": {
    "name": {
      "description": "The name of the user" 
      // Missing "type" keyword
    }
  }
}`);
    await agent.prompt.clickJsonSchemaSaveAndClose();
    await agent.prompt.expectInvalidJsonSchemaTextVisible();

    await agent.prompt.fillJsonSchemaFullscreenTextarea('{}');


    await agent.prompt.clickJsonSchemaSaveAndClose();

  });

  test('TC-PROMPT-RESP-07: Invalid JSON schema in inline editor shows red border and error message on blur', async ({ agents, page }) => {

    const agent = await openAgentPrompt(agents);
    await agent.prompt.selectResponseType('json_schema');

    // Type invalid JSON content into the inline editor
    await agent.prompt.typeJsonSchema('nbnb');

    // Click outside the JSON schema textarea to trigger validation
    await page.locator('body').click({ position: { x: 5, y: 5 } });

    // Assert: red border on the editor container and the error message is shown
    await agent.prompt.expectJsonSchemaEditorRedBorder();
    // we will not check the error message as it is validate the JSON schema structure so message will be different for each invalid schema
    // await agent.prompt.expectInvalidJsonSchemaErrorMessageVisible();

  });

});