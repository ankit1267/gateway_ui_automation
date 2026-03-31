import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Prompt - JSON Schema Builder', () => {

  test('TC-PROMPT-JS-01: enter valid schema name', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
   

    await agent.prompt.selectResponseType('json_schema');
    await agent.prompt.fillJsonSchema('{}');
    await agent.prompt.openBuildVisually();
    await agent.prompt.expectJsonSchemaBuilderVisible();

    await agent.prompt.fillSchemaName('valid_schema_name');
    expect(await agent.prompt.getSchemaNameValue()).toBe('valid_schema_name');
  });

  test('TC-PROMPT-JS-02: enter invalid schema name with special characters', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
   
    await agent.prompt.selectResponseType('json_schema');
    await agent.prompt.fillJsonSchema('{}');
    await agent.prompt.openBuildVisually();
    await agent.prompt.expectJsonSchemaBuilderVisible();

    await agent.prompt.fillSchemaName('invalid@#$%^&*!');
    expect(await agent.prompt.getSchemaNameValue()).toBe('invalid@#$%^&*!');
  });

  test('TC-PROMPT-JS-03: verify no properties message when none added', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    
    await agent.prompt.selectResponseType('json_schema');
    await agent.prompt.fillJsonSchema('{}');
    await agent.prompt.openBuildVisually();
    await agent.prompt.expectJsonSchemaBuilderVisible();

    await agent.prompt.expectNoPropertiesMessage();
  });

  test('TC-PROMPT-JS-04: add property and build JSON schema', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    

    await agent.prompt.selectResponseType('json_schema');
    await agent.prompt.fillJsonSchema('{}');
    await agent.header.expectSavedVisible();
    await agent.prompt.openBuildVisually();
    await agent.prompt.expectJsonSchemaBuilderVisible();

    await agent.prompt.addJsonSchemaProperty();
    await agent.prompt.expectPropertyVisible('new0');

    await agent.prompt.fillPropertyName('new0', 'username');
    await agent.prompt.expectPropertyVisible('username');

    await agent.prompt.togglePropertyRequired('username');

    await agent.prompt.selectPropertyType('username', 'string');

    await agent.prompt.fillPropertyDescription('username', 'The name of the user');
  });

  test('TC-PROMPT-JS-05: delete property and verify removal', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    

    await agent.prompt.selectResponseType('json_schema');
    await agent.prompt.fillJsonSchema('{}');
    await agent.prompt.openBuildVisually();
    await agent.prompt.expectJsonSchemaBuilderVisible();

    await agent.prompt.addJsonSchemaProperty();
    await agent.prompt.expectPropertyVisible('new0');

    await agent.prompt.deleteProperty('new0');
    await agent.prompt.expectPropertyNotVisible('new0');

    await agent.prompt.expectNoPropertiesMessage();
  });

  test('TC-PROMPT-JS-06: object type property has nested add property option', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
   

    await agent.prompt.selectResponseType('json_schema');
    await agent.prompt.fillJsonSchema('{}');
    await agent.header.expectSavedVisible();
    await agent.prompt.openBuildVisually();
    await agent.prompt.expectJsonSchemaBuilderVisible();

    await agent.prompt.addJsonSchemaProperty();
    await agent.prompt.expectPropertyVisible('new0');

    await agent.prompt.selectPropertyType('new0', 'object');

    await agent.prompt.expectObjectAddChildPropertyVisible('new0');

    await agent.prompt.clickObjectAddChildProperty('new0');
    await agent.prompt.expectPropertyVisible('new0.new0');
  });

  test('TC-PROMPT-JS-07: expand and collapse object type properties', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
   

    await agent.prompt.selectResponseType('json_schema');
    await agent.prompt.fillJsonSchema('{}');
    await agent.prompt.openBuildVisually();
    await agent.prompt.expectJsonSchemaBuilderVisible();

    await agent.prompt.addJsonSchemaProperty();
    await agent.prompt.selectPropertyType('new0', 'object');
    await agent.prompt.clickObjectAddChildProperty('new0');
    await agent.prompt.expectPropertyVisible('new0.new0');

    await agent.prompt.expectPropertyExpandButtonVisible('new0');

    await agent.prompt.togglePropertyExpand('new0');
    await agent.prompt.expectPropertyNotVisible('new0.new0');

    await agent.prompt.togglePropertyExpand('new0');
    await agent.prompt.expectPropertyVisible('new0.new0');
  });

  test('TC-PROMPT-JS-08: save schema and verify success toast', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
   

    await agent.prompt.selectResponseType('json_schema');
    await agent.prompt.fillJsonSchema('{}');
    await agent.prompt.openBuildVisually();
    await agent.prompt.expectJsonSchemaBuilderVisible();

    await agent.prompt.fillSchemaName('test_schema');
    await agent.prompt.addJsonSchemaProperty();
    await agent.prompt.fillPropertyDescription('new0', 'A test property');

    await agent.prompt.saveJsonSchemaBuilder();
    await agent.prompt.expectJsonSchemaSavedSuccessfully();
  });

  test('TC-PROMPT-JS-09: close without saving and verify previous data remains', async ({ agents }) => {
    await agents.goto('api');
    const agent = await agents.openAgent(AGENT_NAME);
    

    await agent.prompt.selectResponseType('json_schema');
    await agent.prompt.fillJsonSchema('{}');
    await agent.header.expectSavedVisible();
    await agent.prompt.openBuildVisually();
    await agent.prompt.expectJsonSchemaBuilderVisible();

    await agent.prompt.fillSchemaName('unsaved_schema');
    await agent.prompt.addJsonSchemaProperty();
    await agent.prompt.fillPropertyDescription('new0', 'Should not be saved');

    await agent.prompt.closeJsonSchemaBuilder();

    await agent.prompt.expectJsonSchemaTextareaValue('{}');
  });
});
