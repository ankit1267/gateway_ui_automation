import { test, expect } from '../../../fixtures/base.fixture';
import { selectResponseTypeAndVerifyApi } from '../../../utils/response-type-api';

const AGENT_NAME = process.env.AGENT_NAME!;

function logResponseTypeApiCapture(selectedType: string, captured: { requestCount: number; responseType: string; requestBody: Record<string, unknown> }) {
  const body = captured.requestBody as { configuration?: unknown };

  console.log(
    `[response-type-api] selected=${selectedType} parsed=${captured.responseType} requests=${captured.requestCount}`,
    JSON.stringify(body.configuration ?? {}, null, 2),
  );
}

test.describe('Prompt - Response Type', () => {

  test.beforeEach(async ({ agents }) => {

    await agents.goto('api');

  });

  test('TC-PROMPT-RESP-01: Change response type options', async ({ agents, page }) => {

    const agent = await agents.openAgent(AGENT_NAME);

    await agent.tabs.openPrompt();

    const defaultCapture = await selectResponseTypeAndVerifyApi(
      page,
      async () => {
        await agent.prompt.selectResponseType('default');
      },
      'default',
    );
    logResponseTypeApiCapture('default', defaultCapture);

    const textCapture = await selectResponseTypeAndVerifyApi(
      page,
      async () => {
        await agent.prompt.selectResponseType('text');
      },
      'text',
    );
    logResponseTypeApiCapture('text', textCapture);

    const jsonObjectCapture = await selectResponseTypeAndVerifyApi(
      page,
      async () => {
        await agent.prompt.selectResponseType('json_object');
      },
      'json_object',
    );
    logResponseTypeApiCapture('json_object', jsonObjectCapture);

    const jsonSchemaCapture = await selectResponseTypeAndVerifyApi(
      page,
      async () => {
        await agent.prompt.selectResponseType('json_schema');
      },
      'json_schema',
    );
    logResponseTypeApiCapture('json_schema', jsonSchemaCapture);

    const widgetCapture = await selectResponseTypeAndVerifyApi(
      page,
      async () => {
        await agent.prompt.selectResponseType('widget');
      },
      'widget',
    );
    logResponseTypeApiCapture('widget', widgetCapture);

  });

  test('TC-PROMPT-RESP-02: Set Default button resets response type to default', async ({ agents }) => {

    const agent = await agents.openAgent(AGENT_NAME);

    await agent.tabs.openPrompt();
    await agent.prompt.selectResponseType('text');
    await agent.prompt.expectResponseTypeSetDefaultVisible();
    await agent.prompt.clickResponseTypeSetDefault();
    await agent.prompt.expectResponseTypeIsDefault();

  });



  test('TC-PROMPT-RESP-03: Select json_schema, add JSON schema, click Set Default, verify reset to default', async ({ agents }) => {

    const agent = await agents.openAgent(AGENT_NAME);



    await agent.tabs.openPrompt();

    await agent.prompt.selectResponseType('json_schema');



    await agent.prompt.fillJsonSchema('{"type":"object","properties":{"name":{"type":"string"}}}');



    await agent.prompt.expectResponseTypeSetDefaultVisible();

    await agent.prompt.clickResponseTypeSetDefault();



    await agent.prompt.expectResponseTypeIsDefault();

  });



  test('TC-PROMPT-RESP-04: JSON schema textarea accepts manually typed and pasted JSON', async ({ agents }) => {

    const agent = await agents.openAgent(AGENT_NAME);



    await agent.tabs.openPrompt();

    await agent.prompt.selectResponseType('json_schema');



    const typedJson = '{"type":"string"}';

    await agent.prompt.typeJsonSchema(typedJson);

    await agent.prompt.expectJsonSchemaTextareaValue(typedJson);



    const pastedJson = '{"type":"object","properties":{"id":{"type":"number"}}}';

    await agent.prompt.pasteJsonSchema(pastedJson);

    await agent.prompt.expectJsonSchemaTextareaValue(pastedJson);

  });

   test('TC-PROMPT-RESP-05: Keyboard shortcuts Ctrl+A, Ctrl+C, Ctrl+X, Ctrl+V work in JSON schema textarea', async ({ agents }) => {

    const agent = await agents.openAgent(AGENT_NAME);



    await agent.tabs.openPrompt();

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



   // not scrollable currently
  // test('TC-PROMPT-RESP-06: JSON schema textarea supports scrolling and manual resizing', async ({ agents }) => {

  //   const agent = await agents.openAgent(AGENT_NAME);



  //   await agent.tabs.openPrompt();

  //   await agent.prompt.selectResponseType('json_schema');



  //   // fill with enough lines to overflow the fixed h-32 height

  //   const manyLines = Array.from({ length: 100 }, (_, i) => `"key${i}": "value${i}"`).join(',\n');

  //   await agent.prompt.fillJsonSchema(`{\n${manyLines}\n}`);



  //   // scrolling: content overflows and scrollTop increases after scroll

  //   await agent.prompt.expectJsonSchemaTextareaScrollable();

  //   await agent.prompt.scrollJsonSchemaToBottom();

  //   await agent.prompt.expectJsonSchemaScrolled();



  //   // resizing: drag resize handle down by 100px and verify height increased

  //   const originalHeight = await agent.prompt.getJsonSchemaTextareaHeight();

  //   await agent.prompt.resizeJsonSchemaTextarea(100);

  //   const newHeight = await agent.prompt.getJsonSchemaTextareaHeight();

  //   expect(newHeight).toBeGreaterThan(originalHeight);

  // });



  test('TC-PROMPT-RESP-07: Invalid JSON schema shows error, valid empty object clears it', async ({ agents }) => {

    const agent = await agents.openAgent(AGENT_NAME);



    await agent.tabs.openPrompt();

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

  test('TC-PROMPT-RESP-08: Invalid JSON schema in inline editor shows red border and error message on blur', async ({ agents, page }) => {

    const agent = await agents.openAgent(AGENT_NAME);

    await agent.tabs.openPrompt();
    await agent.prompt.selectResponseType('json_schema');

    // Type invalid JSON content into the inline editor
    await agent.prompt.typeJsonSchema('nbnb');

    // Click outside the JSON schema textarea to trigger validation
    await page.locator('body').click({ position: { x: 5, y: 5 } });

    // Assert: red border on the editor container and the error message is shown
    await agent.prompt.expectJsonSchemaEditorRedBorder();
    await agent.prompt.expectInvalidJsonSchemaErrorMessageVisible();

  });

});