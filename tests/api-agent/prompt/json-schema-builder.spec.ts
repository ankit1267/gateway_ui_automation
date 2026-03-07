import { test } from '../../../fixtures/base.fixture';

test.describe('Prompt - JSON Schema Builder', () => {
  test('TC-PROMPT-JS-01: open Build Visually and add schema property', async ({ agents }) => {
    await agents.goto('api');

    const agent = await agents.openAgent(process.env.AGENT_NAME!);

    await agent.prompt.selectResponseType('json_schema');
    await agent.prompt.fillJsonSchema('{}');
    await agent.prompt.openBuildVisually();

    await agent.prompt.expectJsonSchemaBuilderVisible();

    await agent.prompt.addJsonSchemaProperty();
    await agent.prompt.expectNewJsonSchemaPropertyVisible();
    await agent.prompt.fillNewJsonSchemaPropertyDescription('string');

    await agent.prompt.saveJsonSchemaBuilder();
    await agent.prompt.expectJsonSchemaSavedSuccessfully();
  });
});
