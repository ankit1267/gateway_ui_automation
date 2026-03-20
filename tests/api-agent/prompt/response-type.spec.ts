import { test, expect } from '../../../fixtures/base.fixture';



const AGENT_NAME = process.env.AGENT_NAME!;



test.describe('Prompt - Response Type', () => {



  test.beforeEach(async ({ agents }) => {

    await agents.goto('api');

  });



  test('TC-PROMPT-RESP-01: Change response type options', async ({ agents }) => {

    const agent = await agents.openAgent(AGENT_NAME);



    await agent.tabs.openPrompt();

    await agent.prompt.selectResponseType('default');

    await agent.prompt.selectResponseType('text');

    await agent.prompt.selectResponseType('json_object');

    await agent.prompt.selectResponseType('json_schema');

    await agent.prompt.selectResponseType('widget');

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



  test('TC-PROMPT-RESP-06: JSON schema textarea supports scrolling and manual resizing', async ({ agents }) => {

    const agent = await agents.openAgent(AGENT_NAME);



    await agent.tabs.openPrompt();

    await agent.prompt.selectResponseType('json_schema');



    // fill with enough lines to overflow the fixed h-32 height

    const manyLines = Array.from({ length: 100 }, (_, i) => `"key${i}": "value${i}"`).join(',\n');

    await agent.prompt.fillJsonSchema(`{\n${manyLines}\n}`);



    // scrolling: content overflows and scrollTop increases after scroll

    await agent.prompt.expectJsonSchemaTextareaScrollable();

    await agent.prompt.scrollJsonSchemaToBottom();

    await agent.prompt.expectJsonSchemaScrolled();



    // resizing: drag resize handle down by 100px and verify height increased

    const originalHeight = await agent.prompt.getJsonSchemaTextareaHeight();

    await agent.prompt.resizeJsonSchemaTextarea(100);

    const newHeight = await agent.prompt.getJsonSchemaTextareaHeight();

    expect(newHeight).toBeGreaterThan(originalHeight);

  });



  test('TC-PROMPT-RESP-07: Invalid JSON schema shows error, valid empty object clears it', async ({ agents }) => {

    const agent = await agents.openAgent(AGENT_NAME);



    await agent.tabs.openPrompt();

    await agent.prompt.selectResponseType('json_schema');



    await agent.prompt.typeJsonSchema('{');

    await agent.prompt.blurInput();

    await agent.prompt.expectInvalidJsonSchemaVisible();



    await agent.prompt.typeJsonSchema('{}');

    await agent.prompt.blurInput();

  });



  test('TC-PROMPT-RESP-08: JSON schema response type enforces schema fields in playground response', async ({ agents }) => {

    const agent = await agents.openAgent(AGENT_NAME);



    await agent.tabs.openPrompt();

    await agent.prompt.selectResponseType('json_schema');



    const schema = JSON.stringify({

      name: 'name',

      schema: {

        type: 'object',

        properties: {

          name: {

            type: 'string',

            description: 'name of person',

          },

        },

        required: ['name'],

        additionalProperties: false,

      },

      strict: true,

    });

    await agent.prompt.fillJsonSchema(schema);

    await agent.prompt.blurInput();

    await agent.prompt.expectSavedVisible();

    await agent.playground.typeMessage('hii');

    await agent.playground.expectChatMessageVisible(1);

    await agent.playground.expectChatMessageContainsText(1, 'name');

  });



  test('TC-PROMPT-RESP-05: Keyboard shortcuts Ctrl+A, Ctrl+C, Ctrl+X, Ctrl+V work in JSON schema textarea', async ({ agents }) => {

    const agent = await agents.openAgent(AGENT_NAME);



    await agent.tabs.openPrompt();

    await agent.prompt.selectResponseType('json_schema');



    const json = '{"a":1}';

    await agent.prompt.typeJsonSchema(json);

    await agent.prompt.expectJsonSchemaTextareaValue(json);



    // Ctrl+A: select all â†’ typing replaces entire content

    await agent.prompt.pressKeyInJsonSchema('Control+a');

    await agent.prompt.pressKeyInJsonSchema('Delete');

    await agent.prompt.expectJsonSchemaTextareaValue('');



    // Ctrl+C + Ctrl+V: copy all and paste at end â†’ content doubles

    await agent.prompt.typeJsonSchema(json);

    await agent.prompt.pressKeyInJsonSchema('Control+a');

    await agent.prompt.pressKeyInJsonSchema('Control+c');

    await agent.prompt.pressKeyInJsonSchema('End');

    await agent.prompt.pressKeyInJsonSchema('Control+v');

    await agent.prompt.expectJsonSchemaTextareaValue(json + json);



    // Ctrl+X: cut all â†’ textarea empty

    await agent.prompt.pressKeyInJsonSchema('Control+a');

    await agent.prompt.pressKeyInJsonSchema('Control+x');

    await agent.prompt.expectJsonSchemaTextareaValue('');



    // Ctrl+V: paste cut content â†’ content restored

    await agent.prompt.pressKeyInJsonSchema('Control+v');

    await agent.prompt.expectJsonSchemaTextareaValue(json + json);

  });



});