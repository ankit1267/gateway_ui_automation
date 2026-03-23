import { test } from '../../fixtures/base.fixture';
import { WorkspacePage } from '../../pages/workspace.page';

test.describe.serial('Org page - Search bar visibility', () => {

  test('TC-ORG-01: Search bar is visible when organizations count exceeds 5', async ({ page }) => {
    const workspacePage = new WorkspacePage(page);
    await workspacePage.goto();

    const count = await workspacePage.getOrganizationCount();

    if (count > 5) {
      await workspacePage.expectSearchBarVisible();
    }
  });

});
