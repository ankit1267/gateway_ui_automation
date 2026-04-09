import { test, expect } from '../../fixtures/base.fixture';

const WORKSPACE = process.env.WORKSPACE_NAME!;

test.beforeEach(async ({ sidepanel }) => {
  await sidepanel.gotoKnowledgeBase();
  await sidepanel.knowledgeBasePage.clickCreate();
})


test('Upload File option shows file upload input', async ({ page, sidepanel }) => {
  await sidepanel.knowledgeBasePage.selectUploadRadio();

  //Assert file upload input is visible
  await expect(
    page.locator('#knowledgebase-file-upload')
  ).toBeVisible();
});


test('Content option shows content textbox', async ({ page, sidepanel }) => {
  await sidepanel.knowledgeBasePage.selectContentRadio();
  // Assert file upload input is visible
  await expect(
    page.locator('#knowledgebase-content-textarea-create')
  ).toBeVisible();
});