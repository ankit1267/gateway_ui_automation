import { test } from '../../../fixtures/base.fixture';
import { verifyJsonSchemaResponseApiUpdate } from '../../../utils/json-schema-response-api';

const AGENT_NAME = process.env.AGENT_NAME!;

test.describe('Prompt - Build with AI', () => {
  test('TC-PROMPT-BAI-01: generate and apply instruction from Build with AI panel', async ({ agents, page }) => {
    await agents.goto('api');

    const agent = await agents.openAgent(AGENT_NAME);

    // const selectCapture = await verifyJsonSchemaResponseApiUpdate(
    //   page,
    //   async () => {
    //   },
    // );
    // console.log(
      //   `[json-schema-api] action=select-json_schema requests=${selectCapture.requestCount}`,
      //   JSON.stringify((selectCapture.requestBody as { configuration?: { response_type?: unknown } }).configuration?.response_type ?? {}, null, 2),
      // );
      await agent.prompt.selectResponseType('json_schema');

    await agent.prompt.openBuildWithAI();
    await agent.prompt.closeBuildWithAI();
    await agent.prompt.openBuildWithAI();
    await agent.prompt.promptHelper.generateJsonSchemaInstruction('improve');
    await agent.prompt.promptHelper.clickJsonSchemaCanvasSendButton();

    await agent.prompt.promptHelper.expectApplyButtonVisible();
    await agent.prompt.promptHelper.clickResetChat();
    await agent.prompt.promptHelper.expectConversationsCleared();

    await agent.prompt.promptHelper.generateJsonSchemaInstruction('improve');
    await agent.prompt.promptHelper.clickJsonSchemaCanvasSendButton();

    await agent.prompt.promptHelper.expectApplyButtonVisible();
    await agent.prompt.promptHelper.expectCopyButtonVisible();

    await agent.prompt.expectBuildWithAIScrollable();

    const applyCapture = await verifyJsonSchemaResponseApiUpdate(
      page,
      async () => {
        await agent.prompt.promptHelper.clickApplyButton();
      },
      {
        requireJsonSchema: true,
      },
    );
    // console.log(
    //   `[json-schema-api] action=apply-build-with-ai requests=${applyCapture.requestCount}`,
    //   JSON.stringify((applyCapture.requestBody as { configuration?: { response_type?: unknown } }).configuration?.response_type ?? {}, null, 2),
    // );

    await agent.prompt.promptHelper.expectMainVisible();

    
  });
});
